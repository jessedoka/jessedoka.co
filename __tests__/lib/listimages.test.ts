import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listImages, getOptimizedImageUrls, getProgressiveImageUrls } from '@/lib/listimages';

const mockSend = vi.fn();
const mockGetSignedUrl = vi.fn();

vi.mock('@/lib/r2', () => ({
  r2: { send: (...args: unknown[]) => mockSend(...args) },
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: (...args: unknown[]) => mockGetSignedUrl(...args),
}));

describe('listImages', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockGetSignedUrl.mockReset();
  });

  it('returns filtered keys (originals only, no variants)', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [
        { Key: 'assets/prefix/photo.jpg' },
        { Key: 'assets/prefix/variants/photo-w640.webp' },
        { Key: 'assets/prefix/photo2.png' },
      ],
      IsTruncated: false,
    });
    const result = await listImages('assets/prefix');
    expect(result).toEqual(['assets/prefix/photo.jpg', 'assets/prefix/photo2.png']);
  });

  it('handles pagination', async () => {
    mockSend
      .mockResolvedValueOnce({
        Contents: [{ Key: 'p/a.jpg' }],
        IsTruncated: true,
        NextContinuationToken: 'token2',
      })
      .mockResolvedValueOnce({
        Contents: [{ Key: 'p/b.jpg' }],
        IsTruncated: false,
      });
    const result = await listImages('p');
    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(result).toEqual(['p/a.jpg', 'p/b.jpg']);
  });

  it('returns empty array for empty bucket', async () => {
    mockSend.mockResolvedValueOnce({ Contents: [], IsTruncated: false });
    const result = await listImages('empty/');
    expect(result).toEqual([]);
  });

  it('excludes variant patterns (w320, w1280 webp/avif)', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [
        { Key: 'x/img-w320.webp' },
        { Key: 'x/img-w1280.avif' },
        { Key: 'x/photo.jpeg' },
      ],
      IsTruncated: false,
    });
    const result = await listImages('x');
    expect(result).toEqual(['x/photo.jpeg']);
  });
});

describe('getOptimizedImageUrls', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockGetSignedUrl.mockReset();
  });

  it('prefers w1280 variant for desktop user agent', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: 'base/img.jpg' }],
      IsTruncated: false,
    });
    mockGetSignedUrl.mockResolvedValue('https://signed/w1280');
    const result = await getOptimizedImageUrls('base', 'Mozilla/5.0 Windows');
    expect(result).toHaveLength(1);
    expect(result[0].url).toBe('https://signed/w1280');
    expect(result[0].fallback).toBeNull();
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: expect.objectContaining({ Key: expect.stringContaining('w1280') }),
      }),
      { expiresIn: 3600 }
    );
  });

  it('prefers w640 for mobile low-DPI user agent', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: 'base/img.jpg' }],
      IsTruncated: false,
    });
    mockGetSignedUrl.mockResolvedValue('https://signed/w640');
    const result = await getOptimizedImageUrls('base', 'Mozilla/5.0 Mobile');
    expect(result[0].url).toBe('https://signed/w640');
    expect(mockGetSignedUrl).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: expect.objectContaining({ Key: expect.stringContaining('w640') }),
      }),
      { expiresIn: 3600 }
    );
  });

  it('falls back to original when variant fails and sets fallback: true', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: 'base/img.jpg' }],
      IsTruncated: false,
    });
    mockGetSignedUrl
      .mockRejectedValueOnce(new Error('variant missing'))
      .mockRejectedValueOnce(new Error('variant missing'))
      .mockRejectedValueOnce(new Error('variant missing'))
      .mockResolvedValueOnce('https://signed/original');
    const result = await getOptimizedImageUrls('base', 'Desktop');
    expect(result[0].url).toBe('https://signed/original');
    expect(result[0].fallback).toBe(true);
  });

  it('throws when original also fails', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: 'base/img.jpg' }],
      IsTruncated: false,
    });
    mockGetSignedUrl.mockRejectedValue(new Error('not found'));
    await expect(getOptimizedImageUrls('base')).rejects.toThrow('Failed to load image');
  });
});

describe('getProgressiveImageUrls', () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockGetSignedUrl.mockReset();
  });

  it('returns urls for each quality level when available', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: 'base/img.jpg' }],
      IsTruncated: false,
    });
    mockGetSignedUrl
      .mockResolvedValueOnce('https://low')
      .mockResolvedValueOnce('https://medium')
      .mockResolvedValueOnce('https://high')
      .mockResolvedValueOnce('https://original');
    const result = await getProgressiveImageUrls('base');
    expect(result).toHaveLength(1);
    expect(result[0].urls).toMatchObject({
      low: 'https://low',
      medium: 'https://medium',
      high: 'https://high',
      original: 'https://original',
    });
    expect(result[0].fallback).toBe('https://original');
  });

  it('sets fallback to best available when some levels missing', async () => {
    mockSend.mockResolvedValueOnce({
      Contents: [{ Key: 'base/img.jpg' }],
      IsTruncated: false,
    });
    mockGetSignedUrl
      .mockRejectedValueOnce(new Error('no low'))
      .mockResolvedValueOnce('https://medium')
      .mockRejectedValueOnce(new Error('no high'))
      .mockResolvedValueOnce('https://original');
    const result = await getProgressiveImageUrls('base');
    expect(result[0].fallback).toBe('https://original');
  });
});
