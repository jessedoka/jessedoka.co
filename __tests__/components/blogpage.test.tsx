import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import BlogPage from '@/components/blogpage';
import type { BlogPost } from '@/db/blog';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockBlogPosts: BlogPost[] = [
  {
    slug: 'new-post',
    metadata: {
      title: 'New Post',
      publishedAt: '2026-02-19',
      summary: 'Summary of new post',
    },
    content: Array(301).fill('word').join(' '),
    tags: ['blockchain'],
  },
  {
    slug: 'old-post',
    metadata: {
      title: 'Old Post',
      publishedAt: '2024-01-01',
      summary: 'Summary of old post',
    },
    content: Array(150).fill('word').join(' '),
    tags: ['projects', 'draft'],
  },
  {
    slug: 'studio-post',
    metadata: {
      title: 'Studio Post',
      publishedAt: '2025-06-15',
      summary: 'Studio summary',
    },
    content: 'content',
    tags: ['studio', 'blockchain'],
  },
];

describe('BlogPage', () => {
  it('renders all blog post titles and summaries', () => {
    render(<BlogPage allBlogs={mockBlogPosts} />);
    expect(screen.getAllByText('New Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Old Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Studio Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Summary of new post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Summary of old post').length).toBeGreaterThanOrEqual(1);
  });

  it('shows "all" button and tag filter buttons excluding draft and work', () => {
    render(<BlogPage allBlogs={mockBlogPosts} />);
    expect(screen.getAllByRole('button', { name: 'all' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: 'blockchain' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: 'projects' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: 'studio' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole('button', { name: 'draft' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'work' })).not.toBeInTheDocument();
  });

  it('filters posts when a tag is clicked', () => {
    render(<BlogPage allBlogs={mockBlogPosts} />);
    expect(screen.getAllByText('New Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Old Post').length).toBeGreaterThanOrEqual(1);
    screen.getAllByRole('button', { name: 'blockchain' }).forEach((btn) => fireEvent.click(btn));
    expect(screen.getAllByText('New Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Studio Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByText('Old Post').length).toBe(0);
  });

  it('shows all posts again when "all" is clicked', () => {
    render(<BlogPage allBlogs={mockBlogPosts} />);
    screen.getAllByRole('button', { name: 'blockchain' }).forEach((btn) => fireEvent.click(btn));
    screen.getAllByRole('button', { name: 'all' }).forEach((btn) => fireEvent.click(btn));
    expect(screen.getAllByText('New Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Old Post').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Studio Post').length).toBeGreaterThanOrEqual(1);
  });

  it('sorts posts by date newest first', () => {
    render(<BlogPage allBlogs={mockBlogPosts} />);
    const links = screen.getAllByRole('link', { name: /./ });
    const firstPostLink = links.find((l) => l.getAttribute('href') === '/blog/new-post');
    const secondPostLink = links.find((l) => l.getAttribute('href') === '/blog/old-post');
    expect(firstPostLink?.compareDocumentPosition(secondPostLink!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
  });

  it('displays reading time as ceil(wordCount/300) min read', () => {
    render(<BlogPage allBlogs={mockBlogPosts} />);
    const minReadElements = screen.getAllByText(/min read/);
    const text = minReadElements.map((el) => el.textContent).join(' ');
    expect(text).toMatch(/2 min read/);
    expect(text).toMatch(/1 min read/);
  });
});
