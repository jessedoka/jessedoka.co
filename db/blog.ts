import fs from 'fs';
import path from 'path';

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir: string, subDir: string = ''): { filePath: string; subDir: string }[] {
  let files: { filePath: string; subDir: string }[] = [];
  const items = fs.readdirSync(path.join(dir, subDir), { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      files = files.concat(getMDXFiles(dir, path.join(subDir, item.name)));
    } else if (item.name.endsWith('.mdx')) {
      files.push({ filePath: path.join(dir, subDir, item.name), subDir });
    }
  }
  return files;
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function extractTweetIds(content: string) {
  let tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g);
  return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)?.[0]) || [];
}

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map(({ filePath, subDir }) => {
    let { metadata, content } = readMDXFile(filePath);
    let slug = path.basename(filePath, path.extname(filePath));
    let tweetIds = extractTweetIds(content);
    let tags = subDir.split(path.sep).filter(Boolean); // Split subDir by path separator and filter out empty strings
    return {
      metadata,
      slug,
      tweetIds,
      content,
      tags, // Add tags to the return object
    };
  });
}

export async function getBlogPosts(tagsFilter?: string | string[]) {
  const contentDir = process.env.CONTENT_DIR || path.join(process.cwd(), 'content');
  const allPosts = getMDXData(contentDir);
  if (!tagsFilter) {
    return allPosts; // Return all posts if no filter is provided
  }

  const tagsToMatch = Array.isArray(tagsFilter) ? tagsFilter : [tagsFilter]; // Ensure tagsFilter is an array
  return allPosts.filter(post =>
    tagsToMatch.every(tag => post.tags.includes(tag))
  );
}
