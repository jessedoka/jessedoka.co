import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Footer from '@/components/footer';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Footer', () => {
  it('renders the author name', () => {
    render(<Footer />);
    expect(screen.getByText('Jesse Doka')).toBeInTheDocument();
  });

  it('renders an Instagram link', () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="https://www.instagram.com/jesse.doka/"]');
    expect(link).toBeInTheDocument();
  });

  it('renders a GitHub link', () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="https://github.com/jessedoka"]');
    expect(link).toBeInTheDocument();
  });

  it('renders a LinkedIn link', () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="https://www.linkedin.com/in/jesse-doka/"]');
    expect(link).toBeInTheDocument();
  });

  it('renders a mailto link', () => {
    const { container } = render(<Footer />);
    const link = container.querySelector('a[href="mailto:jcsscdoka@gmail.com"]');
    expect(link).toBeInTheDocument();
  });

  it('renders exactly four social links', () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll('footer a');
    expect(links).toHaveLength(4);
  });
});
