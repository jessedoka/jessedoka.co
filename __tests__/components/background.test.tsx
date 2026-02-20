import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import Background from '@/components/background';

const mockDestroy = vi.fn();
const MockGlslCanvas = vi.fn(function (this: { destroy: () => void }) {
  this.destroy = mockDestroy;
});

vi.mock('glslCanvas', () => ({
  default: MockGlslCanvas,
}));

describe('Background', () => {
  beforeEach(() => {
    mockDestroy.mockClear();
    MockGlslCanvas.mockClear();
  });

  it('renders canvas with data-fragment-url and dimensions', () => {
    const { container } = render(<Background width={800} height={200} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('data-fragment-url', 'worm.frag');
    expect(canvas).toHaveAttribute('width', '800');
    expect(canvas).toHaveAttribute('height', '200');
    expect(canvas).toHaveClass('w-full');
  });

  it('renders wrapper div with overflow hidden', () => {
    const { container } = render(<Background width={100} height={100} />);
    const wrapper = container.querySelector('div.overflow-hidden');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('max-h-[10rem]');
  });

  it('calls GlslCanvas with canvas element on mount', async () => {
    const { container } = render(<Background width={100} height={100} />);
    await waitFor(() => {
      expect(MockGlslCanvas).toHaveBeenCalled();
    });
    expect(MockGlslCanvas).toHaveBeenCalledWith(container.querySelector('canvas'));
  });

  it('calls destroy on unmount', async () => {
    const { container, unmount } = render(<Background width={100} height={100} />);
    await waitFor(() => {
      expect(MockGlslCanvas).toHaveBeenCalled();
    });
    unmount();
    await waitFor(() => {
      expect(mockDestroy).toHaveBeenCalled();
    });
  });
});
