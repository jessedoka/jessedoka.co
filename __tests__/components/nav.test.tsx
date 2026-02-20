import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { Navbar } from '@/components/nav';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/components/breadcrumb', () => ({
  default: () => <div data-testid="breadcrumb" />,
}));

const navItems = {
  '/studio': { name: 'home' },
  '/studio/work': { name: 'work' },
  '/studio/gear': { name: 'gear' },
};

describe('Navbar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a link for each nav item', () => {
    render(<Navbar {...navItems} />);
    expect(screen.getByRole('link', { name: 'home' })).toHaveAttribute('href', '/studio');
    expect(screen.getByRole('link', { name: 'work' })).toHaveAttribute('href', '/studio/work');
    expect(screen.getByRole('link', { name: 'gear' })).toHaveAttribute('href', '/studio/gear');
  });

  it('renders the correct number of links', () => {
    render(<Navbar {...navItems} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(Object.keys(navItems).length);
  });

  it('includes the Breadcrumb component', () => {
    render(<Navbar {...navItems} />);
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders with no nav items without crashing', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('nav')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
