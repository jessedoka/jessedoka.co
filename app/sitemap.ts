import { getBlogPosts } from "@/db/blog"

export default async function sitemap() {
  let blogs = (await getBlogPosts()).map((post) => ({
    url: `https://jessdoka.co/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = ['', '/blog', '/work'].map((route) => ({
    url: `https://jessedoka.co/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
