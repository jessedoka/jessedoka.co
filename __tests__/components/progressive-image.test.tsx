import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProgressiveImage from '@/components/ProgressiveImage';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <img
      src={props.src as string}
      alt={props.alt as string}
      width={props.width}
      height={props.height}
      className={props.className as string}
      data-loading={props.loading}
      data-testid="next-image"
    />
  ),
}));

describe('ProgressiveImage', () => {
  it('shows placeholder when not in view (non-priority)', () => {
    global.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: () => [],
    })) as unknown as typeof IntersectionObserver;
    render(
      <ProgressiveImage src="https://example.com/img.jpg" alt="Test" width={100} height={100} />
    );
    const placeholder = document.querySelector('.animate-pulse');
    expect(placeholder).toBeInTheDocument();
  });

  it('renders Image when priority is true (skips intersection observer)', () => {
    global.IntersectionObserver = vi.fn();
    render(
      <ProgressiveImage
        src="https://example.com/img.jpg"
        alt="Priority"
        priority
        width={200}
        height={200}
      />
    );
    expect(screen.getAllByTestId('next-image').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByAltText('Priority')[0]).toHaveAttribute('src', 'https://example.com/img.jpg');
  });

  it('applies fade-in opacity classes to Image', () => {
    global.IntersectionObserver = vi.fn();
    render(
      <ProgressiveImage
        src="https://example.com/img.jpg"
        alt="Fade"
        priority
      />
    );
    const imgs = screen.getAllByTestId('next-image');
    expect(imgs[0]!.className).toMatch(/transition-opacity|opacity/);
  });
});
