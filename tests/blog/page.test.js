import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import Page, { metadata } from '../../app/blog/page';
import React from 'react';
import { getBlogPosts } from '../../db/blog';
import BlogPage from '../../components/blogpage';

// Mock the entire blog module
jest.mock('@/db/blog', () => ({
    getBlogPosts: jest.fn(),
}));

// Mock the BlogPage component
jest.mock('@/components/blogpage', () => {
    return jest.fn(() => null);
});

describe('Blog Page', () => {
    const mockBlogPosts = [
        {
            metadata: {
                title: 'Test Post 1',
                publishedAt: '2024-01-01',
                summary: 'Test summary 1',
            },
            slug: 'test-post-1',
            content: 'Test content 1',
            tags: ['javascript'],
            tweetIds: [],
        },
        {
            metadata: {
                title: 'Test Post 2',
                publishedAt: '2024-01-02',
                summary: 'Test summary 2',
            },
            slug: 'test-post-2',
            content: 'Test content 2',
            tags: ['react'],
            tweetIds: [],
        },
    ];

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        // Set up the default mock implementation
        getBlogPosts.mockResolvedValue(mockBlogPosts);
    });

    it('should export the correct metadata', () => {
        expect(metadata).toEqual({
            title: 'Blog',
            description: 'A collection of my actions, thoughts, and reflections.',
        });
    });

    it('should fetch blog posts and render BlogPage component', async () => {
        (getBlogPosts).mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve(mockBlogPosts), 100))
        );

        await act(async () => {
            render(await Page());
        });

        // Verify getBlogPosts was called
        expect(getBlogPosts).toHaveBeenCalledTimes(1);

        // Verify BlogPage was rendered with correct props
        expect(BlogPage).toHaveBeenCalledWith(
            {
                allBlogs: mockBlogPosts,
                section: 'dev',
            },
            {}
        );
    });

    it('should handle empty blog posts', async () => {
        // Mock getBlogPosts to return empty array
        getBlogPosts.mockResolvedValue([]);

        await act(async () => {
            render(await Page());
        });

        // Verify getBlogPosts was called
        expect(getBlogPosts).toHaveBeenCalledTimes(1);
        
        // expect page to render "No blog posts found" message
        expect(screen.getByText('No blog posts available.')).toBeInTheDocument();
    });

    it('should handle getBlogPosts error', async () => {
        // Mock getBlogPosts to throw error
        const error = new Error('Failed to fetch blog posts');
        getBlogPosts.mockRejectedValue(error);

        // Verify the error is thrown
        await expect(Page()).rejects.toThrow('Failed to fetch blog posts');
    });
});