import { getBlogPosts } from '@/db/blog';
import { feedTags, siteUrl, toCsv, toFeed } from '@/db/feed';

// Built once at deploy time, so there is no filesystem read at request time.
export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const dynamicParams = false;

/**
 * GET /api/posts/<tag>      -> JSON  { tag, count, posts: [...] }
 * GET /api/posts/<tag>.csv  -> CSV   (for Google Sheets IMPORTDATA)
 * <tag> is a folder name under content/ (e.g. "projects", "adr"), or "all".
 */
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return feedTags(posts).flatMap((tag) => [{ tag }, { tag: `${tag}.csv` }]);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tag: string }> },
) {
  const { tag: raw } = await params;
  const isCsv = raw.endsWith('.csv');
  const tag = isCsv ? raw.slice(0, -'.csv'.length) : raw;

  const posts = await getBlogPosts();
  const items = toFeed(posts, tag, siteUrl());
  const cache = 'public, s-maxage=3600, stale-while-revalidate=86400';

  if (isCsv) {
    return new Response(toCsv(items), {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': cache },
    });
  }
  return Response.json({ tag, count: items.length, posts: items }, { headers: { 'Cache-Control': cache } });
}
