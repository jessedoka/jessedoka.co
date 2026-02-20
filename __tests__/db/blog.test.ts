import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { getBlogPosts, getStudioPosts, type BlogPost } from '@/db/blog';

describe('getBlogPosts', () => {
  it('returns posts without studio tag', async () => {
    const posts = await getBlogPosts();
    expect(Array.isArray(posts)).toBe(true);
    posts.forEach((post) => {
      expect(post.tags).not.toContain('studio');
    });
  });

  it('returns posts with metadata, slug, content, and tags', async () => {
    const posts = await getBlogPosts();
    posts.forEach((post: BlogPost) => {
      expect(post).toHaveProperty('metadata');
      expect(post.metadata).toHaveProperty('title');
      expect(post.metadata).toHaveProperty('publishedAt');
      expect(post.metadata).toHaveProperty('summary');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('tags');
      expect(typeof post.slug).toBe('string');
      expect(post.slug.length).toBeGreaterThan(0);
      expect(Array.isArray(post.tags)).toBe(true);
    });
  });

  it('derives slug from filename (no extension)', async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    posts.forEach((post: BlogPost) => {
      expect(post.slug).not.toMatch(/\.mdx$/);
      expect(post.slug).not.toContain('.');
    });
  });

  it('derives tags from directory structure', async () => {
    const posts = await getBlogPosts();
    const fromBlockchain = posts.find((p) => p.tags.includes('blockchain'));
    const fromProjects = posts.find((p) => p.tags.includes('projects'));
    if (fromBlockchain) expect(fromBlockchain.slug).toBeDefined();
    if (fromProjects) expect(fromProjects.slug).toBeDefined();
  });
});

describe('getStudioPosts', () => {
  it('returns only posts with studio tag', async () => {
    const posts = await getStudioPosts();
    expect(Array.isArray(posts)).toBe(true);
    posts.forEach((post) => {
      expect(post.tags).toContain('studio');
    });
  });

  it('returns posts with metadata, slug, content, and tags', async () => {
    const posts = await getStudioPosts();
    posts.forEach((post: BlogPost) => {
      expect(post).toHaveProperty('metadata');
      expect(post.metadata).toHaveProperty('title');
      expect(post.metadata).toHaveProperty('publishedAt');
      expect(post.metadata).toHaveProperty('summary');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('tags');
    });
  });
});

describe('blog and studio partition', () => {
  it('no post appears in both getBlogPosts and getStudioPosts', async () => {
    const [blogPosts, studioPosts] = await Promise.all([
      getBlogPosts(),
      getStudioPosts(),
    ]);
    const blogSlugs = new Set(blogPosts.map((p) => p.slug));
    studioPosts.forEach((post) => {
      expect(blogSlugs.has(post.slug)).toBe(false);
    });
  });
});
