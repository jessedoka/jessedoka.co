// app/blog/[slug]/page.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blog, { generateMetadata, formatDate} from '../../app/blog/[slug]/page';
import { getBlogPosts } from '../../db/blog';
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';

// Mock dependencies
jest.mock('@/db/blog');
jest.mock('next/navigation');
jest.mock('@/components/mdx', () => ({
    CustomMDX: jest.fn(() => null)
}));

describe('Blog Page Component', () => {
    const mockPost = {
        slug: 'test-post',
        metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-01',
            summary: 'Test summary',
            image: '/test-image.jpg',
        },
        content: 'Test content',
        tags: ['test']
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateMetadata', () => {
        it('should generate correct metadata for a post with image', async () => {
            getBlogPosts.mockResolvedValue([mockPost]);

            const metadata = await generateMetadata({ params: { slug: 'test-post' } });

            expect(metadata).toEqual({
                title: 'Test Post',
                description: 'Test summary',
                openGraph: {
                    title: 'Test Post',
                    description: 'Test summary',
                    type: 'article',
                    publishedTime: '2024-01-01',
                    url: 'https://jessedoka.co/blog/test-post',
                    images: [{ url: 'https://jessedoka.co/test-image.jpg' }],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: 'Test Post',
                    description: 'Test summary',
                    images: ['https://jessedoka.co/test-image.jpg'],
                },
            });
        });

        it('should generate metadata with og-generated image when post has no image', async () => {
            const postWithoutImage = {
                ...mockPost,
                metadata: { ...mockPost.metadata, image: undefined }
            };
            getBlogPosts.mockResolvedValue([postWithoutImage]);

            const metadata = await generateMetadata({ params: { slug: 'test-post' } });

            expect(metadata?.openGraph.images[0].url).toBe(
                'https://jessedoka.co/og?title=Test Post'
            );
        });

        it('should return undefined for non-existent post', async () => {
            getBlogPosts.mockResolvedValue([]);

            const metadata = await generateMetadata({ params: { slug: 'non-existent' } });

            expect(metadata).toBeUndefined();
        });
    });

    describe('formatDate', () => {
        beforeEach(() => {
            // Mock current date to 2024-01-15
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2024-01-15'));
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should format date with years ago', () => {
            const date = '2022-01-15';
            expect(formatDate(date)).toBe('15 January 2022 (2y ago)');
        });

        it('should format date with months ago', () => {
            const date = '2023-11-15';
            expect(formatDate(date)).toBe('15 November 2023 (1y ago)');
        });

        it('should format date with days ago', () => {
            const date = '2024-01-10';
            expect(formatDate(date)).toBe('10 January 2024 (5d ago)');
        });

        it('should handle today', () => {
            const date = '2024-01-15';
            expect(formatDate(date)).toBe('15 January 2024 (Today)');
        });

        it('should handle dates with time component', () => {
            const date = '2024-01-10T15:30:00';
            expect(formatDate(date)).toBe('10 January 2024 (5d ago)');
        });
    });

    describe('Blog Component', () => {
        it('should render blog post correctly', async () => {
            getBlogPosts.mockResolvedValue([mockPost]);

            const { container } = render(await Blog({ params: { slug: 'test-post' } }));

            // Check title is rendered
            expect(screen.getByText('Test Post')).toBeInTheDocument();

            // Check date is rendered
            expect(screen.getByText((content) => content.includes('1 January 2024'))).toBeInTheDocument();

            // Check schema.org script is present
            const script = container.querySelector('script[type="application/ld+json"]');
            expect(script).toBeInTheDocument();

            const schemaData = JSON.parse(script?.innerHTML || '');
            expect(schemaData['@type']).toBe('BlogPosting');
            expect(schemaData.headline).toBe('Test Post');

            // Check CustomMDX is called with correct props
            expect(CustomMDX).toHaveBeenCalledWith(
                expect.objectContaining({
                    source: 'Test content'
                }),
                expect.any(Object)
            );
        });

        it('should call notFound for non-existent post', async () => {
            getBlogPosts.mockResolvedValue([]);

            await Blog({ params: { slug: 'non-existent' } });

            expect(notFound).toHaveBeenCalled();
        });

        it('should handle errors in getBlogPosts', async () => {
            getBlogPosts.mockRejectedValue(new Error('Database error'));

            await expect(Blog({ params: { slug: 'test-post' } })).rejects.toThrow('Database error');
        });
    });
});

describe('Blog Data Fetching', () => {
    const mockPost = {
        slug: 'test-post',
        metadata: {
            title: 'Test Post',
            publishedAt: '2024-01-01',
            summary: 'Test summary',
            image: '/test-image.jpg',
        },
        content: 'Test content',
        tags: ['test']
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch posts with tag filter', async () => {
        const mockPosts = [
            { ...mockPost, tags: ['javascript'] },
            { ...mockPost, slug: 'post-2', tags: ['react'] }
        ];
        getBlogPosts.mockResolvedValue(mockPosts);

        const posts = await getBlogPosts('javascript');
        expect(posts).toHaveLength(2);
        expect(posts[0].tags).toContain('javascript');
    });

    it('should fetch posts with multiple tag filters', async () => {
        const mockPosts = [
            { ...mockPost, tags: ['javascript', 'react'] },
            { ...mockPost, slug: 'post-2', tags: ['react'] }
        ];
        getBlogPosts.mockResolvedValue(mockPosts);

        const posts = await getBlogPosts(['javascript', 'react']);
        expect(posts).toHaveLength(2);
        expect(posts[0].tags).toEqual(expect.arrayContaining(['javascript', 'react']));
    });

    it('should return all posts when no tag filter is provided', async () => {
        const mockPosts = [
            { ...mockPost, tags: ['javascript'] },
            { ...mockPost, slug: 'post-2', tags: ['react'] }
        ];
        getBlogPosts.mockResolvedValue(mockPosts);

        const posts = await getBlogPosts();
        expect(posts).toHaveLength(2);
    });
});