import { describe, it, expect } from 'vitest';
import { getBlogPosts, type BlogPost } from '@/db/blog';
import { ALWAYS_TAGS, feedTags, toCsv, toFeed } from '@/db/feed';
import { GET, generateStaticParams } from '@/app/api/posts/[tag]/route';

const ORIGIN = 'https://example.test';

function post(slug: string, tags: string[], publishedAt: string, title = slug, summary = ''): BlogPost {
  return { slug, tags, content: '', metadata: { title, publishedAt, summary } };
}

const fixtures: BlogPost[] = [
  post('older-adr', ['adr'], '2026-09-01', 'Use SQLite, not Postgres', 'Why "simple" won'),
  post('newer-adr', ['adr'], '2026-10-10', 'Static feed, not API'),
  post('plain', [], '2026-10-12'),
  post('mixed', ['Projects', 'adr'], '2026-10-11'),
];

describe('toFeed', () => {
  it('keeps only posts with the tag, case-insensitively, newest first', () => {
    const items = toFeed(fixtures, 'ADR', ORIGIN);
    expect(items.map((i) => i.slug)).toEqual(['mixed', 'newer-adr', 'older-adr']);
  });

  it('builds the public post URL from the origin', () => {
    expect(toFeed(fixtures, 'adr', ORIGIN)[0].url).toBe('https://example.test/blog/mixed');
  });

  it('returns an empty list for a tag nobody uses', () => {
    expect(toFeed(fixtures, 'nope', ORIGIN)).toEqual([]);
  });

  it('"all" returns every post', () => {
    expect(toFeed(fixtures, 'all', ORIGIN)).toHaveLength(4);
  });
});

describe('toCsv', () => {
  it('writes a header row and one quoted row per post', () => {
    const csv = toCsv(toFeed(fixtures, 'adr', ORIGIN));
    const lines = csv.trimEnd().split('\n');
    expect(lines[0]).toBe('title,date,slug,url,tags,summary');
    expect(lines).toHaveLength(4);
  });

  it('escapes quotes and keeps commas inside a cell', () => {
    const csv = toCsv(toFeed([post('a', ['adr'], '2026-01-01', 'Hello, "world"', 'x, y')], 'adr', ORIGIN));
    expect(csv).toContain('"Hello, ""world"""');
    expect(csv).toContain('"x, y"');
  });

  it('joins tags with a pipe', () => {
    expect(toCsv(toFeed(fixtures, 'adr', ORIGIN))).toContain('"Projects|adr"');
  });

  it('gives just the header when there are no posts', () => {
    expect(toCsv([])).toBe('title,date,slug,url,tags,summary\n');
  });
});

describe('feedTags', () => {
  it('always includes "all" and the always-on tags', () => {
    const tags = feedTags([]);
    expect(tags).toContain('all');
    ALWAYS_TAGS.forEach((t) => expect(tags).toContain(t));
  });

  it('lower-cases tags in use', () => {
    expect(feedTags(fixtures)).toContain('projects');
  });
});

describe('route', () => {
  const call = (tag: string) => GET(new Request('http://localhost'), { params: Promise.resolve({ tag }) });

  it('generates a JSON and a CSV path for each tag, including projects and adr', async () => {
    const params = (await generateStaticParams()).map((p) => p.tag);
    ['projects', 'projects.csv', 'adr', 'adr.csv', 'all', 'all.csv'].forEach((t) => expect(params).toContain(t));
  });

  it('serves the real "projects" posts as JSON', async () => {
    const res = await call('projects');
    expect(res.headers.get('content-type')).toContain('application/json');
    const body = await res.json();
    const real = (await getBlogPosts()).filter((p) => p.tags.includes('projects'));
    expect(real.length).toBeGreaterThan(0);
    expect(body.tag).toBe('projects');
    expect(body.count).toBe(real.length);
    body.posts.forEach((p: { url: string; slug: string }) => expect(p.url).toMatch(new RegExp(`/blog/${p.slug}$`)));
  });

  it('serves the same posts as CSV', async () => {
    const res = await call('projects.csv');
    expect(res.headers.get('content-type')).toContain('text/csv');
    const text = await res.text();
    const real = (await getBlogPosts()).filter((p) => p.tags.includes('projects'));
    expect(text.trimEnd().split('\n')).toHaveLength(real.length + 1);
  });

  it('serves an empty adr feed rather than failing, until a post is tagged', async () => {
    const body = await (await call('adr')).json();
    const real = (await getBlogPosts()).filter((p) => p.tags.includes('adr'));
    expect(body.count).toBe(real.length);
    expect(Array.isArray(body.posts)).toBe(true);
  });
});
