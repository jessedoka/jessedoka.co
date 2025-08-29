import { Navbar } from '@/components/nav';
import type { NavItem } from '@/components/nav';
import Footer from '@/components/footer';

const studioNavItems: Record<string, NavItem> = {
    '/studio': { name: 'home' },
    '/studio/work': { name: 'work' },
    '/studio/gear': { name: 'gear' }
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="antialiased max-w-6xl md:flex-row mx-4 lg:mx-auto flex-column min-vh-100 mb-auto p-8">
            <div className="flex min-w-0 flex-col px-2 md:px-0 mb-auto justify-center">
                <Navbar {...studioNavItems} />
                {children}
            </div>
            <Footer />
        </main>
    );
}
