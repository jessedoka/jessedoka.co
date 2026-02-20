import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, formatDate, formatShortDate } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'block')).toBe('base block');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles undefined and null', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-19T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('formats date with relative suffix (days ago)', () => {
    expect(formatDate('2026-02-18')).toMatch(/18 February 2026/);
    expect(formatDate('2026-02-18')).toMatch(/1d ago/);
  });

  it('formats date with relative suffix (months ago)', () => {
    vi.setSystemTime(new Date('2026-04-19T12:00:00Z'));
    expect(formatDate('2026-02-19')).toMatch(/19 February 2026/);
    expect(formatDate('2026-02-19')).toMatch(/2mo ago/);
  });

  it('formats date with relative suffix (years ago)', () => {
    expect(formatDate('2024-02-19')).toMatch(/19 February 2024/);
    expect(formatDate('2024-02-19')).toMatch(/2y ago/);
  });

  it('returns Today when date is today', () => {
    expect(formatDate('2026-02-19')).toMatch(/19 February 2026/);
    expect(formatDate('2026-02-19')).toMatch(/Today/);
  });

  it('handles date without T (appends T00:00:00)', () => {
    expect(formatDate('2022-12-25')).toMatch(/25 December 2022/);
    expect(formatDate('2022-12-25')).toMatch(/\d+y ago/);
  });

  it('handles ISO date with time', () => {
    expect(formatDate('2026-02-18T14:30:00')).toMatch(/18 February 2026/);
  });
});

describe('formatShortDate', () => {
  it('formats date in short en-gb style', () => {
    expect(formatShortDate('2026-02-17')).toBe('17 Feb 2026');
  });

  it('handles ISO date string', () => {
    const result = formatShortDate('2022-12-25T00:00:00Z');
    expect(result).toMatch(/25/);
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/2022/);
  });
});
