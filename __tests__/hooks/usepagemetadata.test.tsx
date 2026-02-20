import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { usePageMetadata } from '@/hooks/usepagemetadata';

function TestComponent({ title, description }: { title: string; description: string }) {
  usePageMetadata({ title, description });
  return <div>Page</div>;
}

describe('usePageMetadata', () => {
  it('sets document.title on mount', () => {
    expect(document.title).toBeDefined();
    render(<TestComponent title="Test Title" description="Test description" />);
    expect(document.title).toBe('Test Title');
  });

  it('creates or updates meta description tag', () => {
    render(<TestComponent title="Meta Test" description="My page description" />);
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveAttribute('content', 'My page description');
  });

  it('updates document.title when props change', () => {
    const { rerender } = render(
      <TestComponent title="First Title" description="First desc" />
    );
    expect(document.title).toBe('First Title');
    rerender(<TestComponent title="Second Title" description="Second desc" />);
    expect(document.title).toBe('Second Title');
  });
});
