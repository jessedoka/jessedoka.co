import fs from 'fs';
import path from 'path';

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  random?: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, '').trim();

  
  let frontMatterLines = frontMatterBlock!.trim().split('\n');
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    metadata[key!.trim() as keyof Metadata] = value;
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

function getMDXData(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map(({ filePath, subDir }) => {
    let { metadata, content } = readMDXFile(filePath);
    let slug = path.basename(filePath, path.extname(filePath));
    let tags = subDir.split(path.sep).filter(Boolean);
    return {
      metadata,
      slug,
      content,
      tags,
    };
  });
}

export type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

export async function getBlogPosts() {
  const contentDir = process.env.CONTENT_DIR || path.join(process.cwd(), 'content');
  const allPosts = getMDXData(contentDir);

  return allPosts.filter(post => !post.tags.includes('studio'));
}

export async function getStudioPosts() {
  const contentDir = process.env.CONTENT_DIR || path.join(process.cwd(), 'content');
  const allPosts = getMDXData(contentDir);

  return allPosts.filter(post => post.tags.includes('studio'));
}
