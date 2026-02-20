import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Breadcrumb from '@/components/breadcrumb';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Breadcrumb', () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  it('generates segments from pathname', () => {
    mockUsePathname.mockReturnValue('/blog/my-post');
    render(<Breadcrumb />);
    const blogLinks = screen.getAllByRole('link', { name: /blog/ });
    expect(blogLinks[0]).toHaveAttribute('href', '/blog');
    const postLinks = screen.getAllByRole('link', { name: /my post/ });
    expect(postLinks[0]).toHaveAttribute('href', '/blog/my-post');
  });

  it('formats segment labels from kebab-case to title-like', () => {
    mockUsePathname.mockReturnValue('/studio/work/kingofthering');
    render(<Breadcrumb />);
    expect(screen.getByText('studio')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('kingofthering')).toBeInTheDocument();
  });

  it('shows home link (~) when not on root path', () => {
    mockUsePathname.mockReturnValue('/blog');
    render(<Breadcrumb />);
    const homeLinks = screen.getAllByRole('link', { name: '~' });
    expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    expect(homeLinks[0]).toHaveAttribute('href', '/');
  });

  it('does not show home link when on root path', () => {
    mockUsePathname.mockReturnValue('/');
    const { container } = render(<Breadcrumb />);
    const links = container.querySelectorAll('a[href="/"]');
    const tildeLinks = Array.from(links).filter((a) => a.textContent?.trim() === '~');
    expect(tildeLinks.length).toBe(0);
  });
});
