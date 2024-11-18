import Home from "../app/page";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the getBlogPosts function
jest.mock('@/db/blog', () => ({
    getBlogPosts: () => Promise.resolve([
        {
            slug: 'test-post-1',
            metadata: {
                title: 'Test Post 1',
                publishedAt: '2024-01-01'
            }
        },
        {
            slug: 'test-post-2',
            metadata: {
                title: 'Test Post 2',
                publishedAt: '2024-01-02'
            }
        },
        {
            slug: 'test-post-3',
            metadata: {
                title: 'Test Post 3',
                publishedAt: '2024-01-03'
            }
        },
        {
            slug: 'test-post-4',
            metadata: {
                title: 'Test Post 4',
                publishedAt: '2024-01-04'
            }
        },
        {
            slug: 'test-post-5',
            metadata: {
                title: 'Test Post 5',
                publishedAt: '2024-01-05'
            }
        }
    ])
}));

// Mock the Background component
jest.mock('@/components/background', () => ({
    __esModule: true,
    default: () => <div data-testid="background" />
}));

describe('Home Page', () => {
    beforeEach(async () => {
        await render(await Home());
    });

    describe('Header Section', () => {
        it('renders the welcome message and emoji correctly', async () => {
            const welcomeText = await screen.findByText((_, element) => {
                const hasText = (node) => node.textContent.includes("Hey there, I'm Jesse") &&
                    node.textContent.includes("👋") &&
                    node.textContent.includes("🏡");
                const elementHasText = hasText(element);
                const childrenDontHaveText = Array.from(element.children).every(
                    (child) => !hasText(child)
                );
                return elementHasText && childrenDontHaveText;
            });
            expect(welcomeText).toBeInTheDocument();
        });

        it('renders the builder description', async () => {
            const description = await screen.findByText(/I love to build things and share my experiences/i);
            expect(description).toBeInTheDocument();
        });

        it('renders the journey text with correct links', async () => {
            const githubLink = await screen.findByRole('link', { name: /journey/i });
            const internshipLink = await screen.findByRole('link', { name: /internships/i });

            expect(githubLink).toHaveAttribute('href', 'https://github.com/jessedoka');
            expect(internshipLink).toHaveAttribute('href', '/work');
        });
    });

    describe('Projects Section', () => {
        it('renders all projects with correct links and descriptions', async () => {
            const expectedProjects = [
                {
                    name: 'Reacton',
                    link: 'https://github.com/jessedoka/reacton',
                    description: 'Reaction Tester built with React'
                },
                {
                    name: 'InkByter',
                    link: 'https://github.com/jessedoka/InkByter',
                    description: 'Simple Text Editor made in C'
                },
                {
                    name: 'LCT',
                    link: 'https://github.com/jessedoka/LCT',
                    description: 'A tool for building and managing sentiment analysis lexicons.'
                },
                {
                    name: 'Rankhacker',
                    link: 'https://github.com/jessedoka/rankhacker',
                    description: 'A place where I put all the programming challenges I do'
                },
                {
                    name: 'Sudoka',
                    link: 'https://github.com/jessedoka/sudoka',
                    description: 'A Sudoku game with REST API'
                },
                {
                    name: 'Unkbot',
                    link: 'https://github.com/jessedoka/unkbot',
                    description: 'A Discord bot that just says unk'
                }
            ];

            for (const project of expectedProjects) {
                const projectElement = await screen.findByText(project.name);
                const projectLink = projectElement.closest('a');
                const projectDescription = await screen.findByText(project.description);

                expect(projectLink).toHaveAttribute('href', project.link);
                expect(projectLink).toHaveAttribute('target', '_blank');
                expect(projectLink).toHaveAttribute('rel', 'noreferrer');
                expect(projectDescription).toBeInTheDocument();
            }
        });

        it('renders projects in a grid layout', async () => {
            const projectElement = await screen.findByRole('link', { name: /Reacton/i });
            const projectsGrid = projectElement.closest('div');
            expect(projectsGrid).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3');
        });
    });

    describe('Blog Section', () => {
        it('renders blog posts in correct order with dates', async () => {
            const blogPosts = await screen.findAllByRole('link');
            const filteredBlogPosts = blogPosts.filter(link =>
                link.href.includes('/blog/')
            );
            expect(filteredBlogPosts).toHaveLength(5);

            // Check first blog post
            const firstPostTitle = await screen.findByText('Test Post 5');
            const firstPostDate = await screen.findByText('5 Jan 2024');
            expect(firstPostTitle).toBeInTheDocument();
            expect(firstPostDate).toBeInTheDocument();

            // Verify blog post link structure
            const firstBlogLink = firstPostTitle.closest('a');
            expect(firstBlogLink).toHaveAttribute('href', '/blog/test-post-5');
        });

        it('applies correct styling to blog post titles', async () => {
            const blogTitles = await screen.findAllByText(/Test Post/i);
            blogTitles.forEach(title => {
                expect(title).toHaveClass('text-neutral-800', 'dark:text-neutral-300');
            });
        });
    });

    describe('Layout Elements', () => {
        it('renders the background component', async () => {
            const background = await screen.findByTestId("background");
            expect(background).toBeInTheDocument();
        });

        it('renders the profile icon with correct attributes', async () => {
            const icon = await screen.findByAltText('icon');
            expect(icon).toHaveAttribute('src', '/icon.svg');
            expect(icon).toHaveAttribute('width', '120');
            expect(icon).toHaveAttribute('height', '120');
        });
    });
});