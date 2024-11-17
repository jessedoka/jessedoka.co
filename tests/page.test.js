import Home from "../app/page";
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the getBlogPosts function
jest.mock('@/db/blog', () => ({
    getBlogPosts: () => ([
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
    beforeEach(() => {
        // Since Next.js page components are async, we need to handle them properly
        render(<Home />);
    });

    describe('Header Section', () => {
        it('renders the welcome message and emoji correctly', () => {
            const welcomeText = screen.getByText((_, element) => {
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

        it('renders the builder description', () => {
            const description = screen.getByText(/I love to build things and share my experiences/i);
            expect(description).toBeInTheDocument();
        });

        it('renders the journey text with correct links', () => {
            const githubLink = screen.getByRole('link', { name: /journey/i });
            const internshipLink = screen.getByRole('link', { name: /internships/i });

            expect(githubLink).toHaveAttribute('href', 'https://github.com/jessedoka');
            expect(internshipLink).toHaveAttribute('href', '/work');
        });
    });

    describe('Projects Section', () => {
        it('renders all projects with correct links and descriptions', () => {
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

            expectedProjects.forEach(project => {
                const projectElement = screen.getByText(project.name);
                const projectLink = projectElement.closest('a');
                const projectDescription = screen.getByText(project.description);

                expect(projectLink).toHaveAttribute('href', project.link);
                expect(projectLink).toHaveAttribute('target', '_blank');
                expect(projectLink).toHaveAttribute('rel', 'noreferrer');
                expect(projectDescription).toBeInTheDocument();
            });
        });

        it('renders projects in a grid layout', () => {
            const projectsGrid = screen.getByRole('link', { name: /Reacton/i }).closest('div');
            expect(projectsGrid).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3');
        });
    });

    describe('Blog Section', () => {
        it('renders blog posts in correct order with dates', () => {
            const blogPosts = screen.getAllByRole('link').filter(link =>
                link.href.includes('/blog/')
            );
            expect(blogPosts).toHaveLength(5);

            // Check first blog post
            const firstPostTitle = screen.getByText('Test Post 2');
            const firstPostDate = screen.getByText('2 Jan 2024');
            expect(firstPostTitle).toBeInTheDocument();
            expect(firstPostDate).toBeInTheDocument();

            // Verify blog post link structure
            const firstBlogLink = firstPostTitle.closest('a');
            expect(firstBlogLink).toHaveAttribute('href', '/blog/test-post-2');
        });

        it('applies correct styling to blog post titles', () => {
            const blogTitles = screen.getAllByText(/Test Post/i);
            blogTitles.forEach(title => {
                expect(title).toHaveClass('text-neutral-800', 'dark:text-neutral-300');
            });
        });
    });

    describe('Layout Elements', () => {
        it('renders the background component', () => {
            const background = screen.getByTestId("background");
            expect(background).toBeInTheDocument();
        });

        it('renders the profile icon with correct attributes', () => {
            const icon = screen.getByAltText('icon');
            expect(icon).toHaveAttribute('src', '/icon.svg');
            expect(icon).toHaveAttribute('width', '120');
            expect(icon).toHaveAttribute('height', '120');
        });
    });
});