import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkPage from '../../app/work/page';
import { usePageMetadata } from "../../hooks/usepagemetadata";

// Mock the usePageMetadata hook
jest.mock("../../hooks/usepagemetadata");

// Mock the react-icons
jest.mock("react-icons/si", () => ({
    SiRuby: () => <div data-testid="ruby-icon">Ruby Icon</div>,
    SiRubyonrails: () => <div data-testid="rails-icon">Rails Icon</div>,
    SiTypescript: () => <div data-testid="typescript-icon">TypeScript Icon</div>,
    SiPostgresql: () => <div data-testid="postgresql-icon">PostgreSQL Icon</div>,
}));

describe('WorkPage', () => {
    beforeEach(() => {
        // Clear mock calls before each test
        jest.clearAllMocks();
    });

    it('should render the page title correctly', () => {
        render(<WorkPage />);
        const pageTitle = screen.getByText('my work');
        expect(pageTitle).toBeInTheDocument();
    });

    it('should set correct page metadata', () => {
        render(<WorkPage />);
        expect(usePageMetadata).toHaveBeenCalledWith({
            title: 'Work',
            description: 'A collection of my work experiences and achievements.',
        });
    });

    describe('Singletrack Experience', () => {
        beforeEach(() => {
            render(<WorkPage />);
        });

        it('should render company name and role', () => {
            expect(screen.getByText('Singletrack')).toBeInTheDocument();
            expect(screen.getByText('Software Engineer Intern')).toBeInTheDocument();
        });

        it('should render job description', () => {
            const description = screen.getByText(/Ruby on Rails intern with expertise/);
            expect(description).toBeInTheDocument();
        });

        it('should render all tech stack icons', () => {
            expect(screen.getByTestId('ruby-icon')).toBeInTheDocument();
            expect(screen.getByTestId('rails-icon')).toBeInTheDocument();
            expect(screen.getByTestId('typescript-icon')).toBeInTheDocument();
            expect(screen.getByTestId('postgresql-icon')).toBeInTheDocument();
        });

        it('should render all achievements', () => {
            const achievements = [
                'Specialized in integrating REST APIs with Salesforce',
                'Ensured smooth data exchange between the Rails application and Salesforce',
                'Worked collaboratively with a welcoming and friendly team',
                'Applied engineering principles, including TDD',
            ];

            achievements.forEach(achievement => {
                expect(screen.getByText(new RegExp(achievement))).toBeInTheDocument();
            });
        });
    });

    describe('Component Structure', () => {
        it('should render work experience in correct structure', () => {
            const { container } = render(<WorkPage />);

            // Check for proper section structure
            expect(container.querySelector('section')).toBeInTheDocument();

            // Check for prose styling classes
            const proseDiv = container.querySelector('.prose');
            expect(proseDiv).toBeInTheDocument();
            expect(proseDiv).toHaveClass('prose-neutral');

            // Check for skills container styling
            const skillsContainer = container.querySelector('.flex.flex-wrap');
            expect(skillsContainer).toBeInTheDocument();
            expect(skillsContainer).toHaveClass('border');
            expect(skillsContainer).toHaveClass('rounded-md');
        });

        it('should maintain consistent spacing and layout', () => {
            const { container } = render(<WorkPage />);

            // Check heading margins
            const mainHeading = screen.getByText('my work');
            expect(mainHeading).toHaveClass('mb-8');

            const companyHeading = screen.getByText('Singletrack');
            expect(companyHeading).toHaveClass('mb-1');

            // Check skills container spacing
            const skillsContainer = container.querySelector('.flex.flex-wrap');
            expect(skillsContainer).toHaveClass('p-4');
            expect(skillsContainer).toHaveClass('mb-12');
            expect(skillsContainer).toHaveClass('space-x-6');
        });
    });

    describe('Dark Mode Support', () => {
        it('should include dark mode classes', () => {
            const { container } = render(<WorkPage />);

            // Check prose dark mode
            const proseDiv = container.querySelector('.prose');
            expect(proseDiv).toHaveClass('dark:prose-invert');

            // Check role text dark mode
            const roleText = screen.getByText('Software Engineer Intern');
            expect(roleText).toHaveClass('dark:text-neutral-400');

            // Check skills container dark mode
            const skillsContainer = container.querySelector('.flex.flex-wrap');
            expect(skillsContainer).toHaveClass('dark:bg-black/10');
        });
    });

    describe('Accessibility', () => {
        it('should have proper heading hierarchy', () => {
            render(<WorkPage />);

            const mainHeading = screen.getByText('my work');
            expect(mainHeading.tagName).toBe('H1');

            const companyHeading = screen.getByText('Singletrack');
            expect(companyHeading.tagName).toBe('H2');
        });

        it('should render achievements in a list', () => {
            const { container } = render(<WorkPage />);
            const achievementsList = container.querySelector('ul');
            expect(achievementsList).toBeInTheDocument();
            expect(achievementsList?.children.length).toBe(4); // Four achievements
        });
    });
});