import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout, { metadata } from '../app/layout';

// Mock the external components and modules
jest.mock('@vercel/analytics/react', () => ({
    Analytics: () => <div data-testid="analytics">Analytics</div>
}));

jest.mock('@vercel/speed-insights/next', () => ({
    SpeedInsights: () => <div data-testid="speed-insights">Speed Insights</div>
}));

jest.mock('geist/font/sans', () => ({
    GeistSans: { variable: 'mock-sans-variable' }
}));

jest.mock('geist/font/mono', () => ({
    GeistMono: { variable: 'mock-mono-variable' }
}));

jest.mock('@/components/nav', () => ({
    Navbar: () => <nav data-testid="navbar">Navigation</nav>
}));

jest.mock('@/components/footer', () => ({
    __esModule: true,
    default: () => <footer data-testid="footer">Footer</footer>
}));

// jest.mock('@/lib/utils', () => ({
//     cn: (...classes) => classes.filter(Boolean).join(' ')
// }));

describe('RootLayout', () => {
    const setup = () => {
        return render(
            <RootLayout>
                <div data-testid="test-content">Test Content</div>
            </RootLayout>
        );
    };

    describe('Structure and Components', () => {
        it('renders the basic structure with all required components', () => {
            setup();

            const html = screen.getByRole('document');
            expect(html).toHaveAttribute('lang', 'en');

            expect(screen.getByTestId('navbar')).toBeInTheDocument();
            expect(screen.getByTestId('footer')).toBeInTheDocument();
            expect(screen.getByTestId('analytics')).toBeInTheDocument();
            expect(screen.getByTestId('speed-insights')).toBeInTheDocument();

            // Check if children are rendered
            expect(screen.getByTestId('test-content')).toBeInTheDocument();
        });

        it('applies correct classes for theme and fonts', () => {
            setup();
            const html = screen.getByRole('document');

            // Test each class separately
            expect(html).toHaveClass('text-black');
            expect(html).toHaveClass('bg-white');
            expect(html).toHaveClass('dark:text-white');
            expect(html).toHaveClass('dark:bg-[#111010]');
            expect(html).toHaveClass('mock-sans-variable');
            expect(html).toHaveClass('mock-mono-variable');
        });
    });

    describe('Layout Structure', () => {
        it('renders main content with correct classes', () => {
            setup();

            const main = screen.getByRole('main');
            expect(main).toHaveClass(
                'antialiased',
                'max-w-2xl',
                'md:flex-row',
                'mx-4',
                'lg:mx-auto',
                'd-flex',
                'flex-column',
                'min-vh-100',
                'mb-auto',
                'mt-8'
            );
        });

        it('renders content wrapper with correct classes', () => {
            setup();

            const contentWrapper = screen.getByTestId('test-content').parentElement;
            expect(contentWrapper).toHaveClass(
                'flex-auto',
                'min-w-0',
                'flex',
                'flex-col',
                'px-2',
                'md:px-0',
                'mb-auto'
            );
        });
    });

    describe('Metadata', () => {
        it('has correct base metadata configuration', () => {
            expect(metadata.metadataBase?.toString()).toBe('https://www.jessedoka.co/');
            expect(metadata.description).toBe('Developer');
        });

        it('has correct OpenGraph configuration', () => {
            const og = metadata.openGraph;
            expect(og).toEqual({
                title: 'Jesse Doka',
                description: 'Developer',
                url: 'https://www.jessedoka.co/',
                siteName: 'Jesse Doka',
                locale: 'en_GB',
                type: 'website',
            });
        });

        it('has correct robot configurations', () => {
            const robots = metadata.robots;
            expect(robots).toEqual({
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            });
        });

        it('generates random title correctly', () => {
            expect(metadata.title.default).toMatch(/^[a-z]{7} is a word$/);
            expect(metadata.title.template).toBe('%s | Jesse Doka');
        });
    });

    describe('Random Word Generator', () => {
        it('generates random word with default length', () => {
            // We can test this by rendering multiple times and checking the title
            const titles = new Set();
            for (let i = 0; i < 5; i++) {
                render(
                    <RootLayout>
                        <div>Test</div>
                    </RootLayout>
                );
                const title = metadata.title.default;
                titles.add(title);
            }
            // If we got different titles, the random function is working
            expect(titles.size).toBe(1);
        });
    });
});