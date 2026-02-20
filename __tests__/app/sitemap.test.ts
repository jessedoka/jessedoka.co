import { describe, it, expect } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('returns an array of URL entries', async () => {
    const result = await sitemap();
    expect(Array.isArray(result)).toBe(true);
    result.forEach((entry) => {
      expect(entry).toHaveProperty('url');
      expect(entry).toHaveProperty('lastModified');
      expect(typeof entry.url).toBe('string');
      expect(entry.url.length).toBeGreaterThan(0);
    });
  });

  it('includes main routes with base URL', async () => {
    const result = await sitemap();
    const urls = result.map((e) => e.url);
    expect(urls.some((u) => u.includes('/blog') || u.endsWith('/blog'))).toBe(true);
    expect(urls.some((u) => u.includes('/dev') || u.endsWith('/dev'))).toBe(true);
    expect(urls.some((u) => u.includes('/studio') || u.endsWith('/studio'))).toBe(true);
  });

  it('includes blog post URLs', async () => {
    const result = await sitemap();
    const blogEntries = result.filter((e) => e.url.includes('/dev/blog/'));
    expect(blogEntries.length).toBeGreaterThan(0);
    blogEntries.forEach((entry) => {
      expect(entry.url).toMatch(/\/dev\/blog\/[\w-]+$/);
    });
  });

  it('uses NEXT_PUBLIC_SITE_URL for base URL', async () => {
    const result = await sitemap();
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.example.com';
    result.forEach((entry) => {
      expect(entry.url.startsWith(base)).toBe(true);
    });
  });
});
