import { publicEnv } from "@/lib/env.mjs";
import { getBlogPosts } from "@/db/blog"

export const runtime = 'nodejs';

export default async function sitemap() {
  let blogs = (await getBlogPosts()).map((post) => ({
    url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/dev/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt
  }));

  let routes = ['', '/blog', '/dev', '/studio'].map((route) => ({
    url: `${publicEnv.NEXT_PUBLIC_SITE_URL!}/${route}`,
    lastModified: new Date().toISOString().split('T')[0]
  }));

  return [...routes, ...blogs];
}
