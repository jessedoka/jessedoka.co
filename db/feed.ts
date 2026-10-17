import type { BlogPost } from '@/db/blog';

export type FeedItem = {
  title: string;
  date: string;
  slug: string;
  url: string;
  tags: string[];
  summary: string;
};

/** Tags that always get a feed, even before any post uses them (empty list, not a 404). */
export const ALWAYS_TAGS = ['adr'];

export const ALL_TAG = 'all';

const DEFAULT_SITE_URL = 'https://jessedoka.co';

export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, '');
}

/** Every tag that has a feed: tags in use, the always-on ones, and "all". */
export function feedTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>([ALL_TAG, ...ALWAYS_TAGS]);
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag.toLowerCase())));
  return [...tags];
}

/** Posts carrying `tag` (case-insensitive), newest first. "all" returns every blog post. */
export function toFeed(posts: BlogPost[], tag: string, origin: string): FeedItem[] {
  const wanted = tag.toLowerCase();
  return posts
    .filter((post) => wanted === ALL_TAG || post.tags.some((t) => t.toLowerCase() === wanted))
    .map((post) => ({
      title: post.metadata.title,
      date: String(post.metadata.publishedAt),
      slug: post.slug,
      url: `${origin}/blog/${post.slug}`,
      tags: post.tags,
      summary: post.metadata.summary ?? '',
    }))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** CSV with a header row, every field quoted, tags joined with "|". Works with Sheets IMPORTDATA. */
export function toCsv(items: FeedItem[]): string {
  const header = ['title', 'date', 'slug', 'url', 'tags', 'summary'].join(',');
  const rows = items.map((item) =>
    [item.title, item.date, item.slug, item.url, item.tags.join('|'), item.summary]
      .map(csvCell)
      .join(','),
  );
  return [header, ...rows].join('\n') + '\n';
}
