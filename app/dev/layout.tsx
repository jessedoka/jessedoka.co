import { Navbar } from '@/components/nav';
import type { NavItem } from '@/components/nav';
import Footer from '@/components/footer';

const devNavItems: Record<string, NavItem> = {
    '/dev': { name: 'home' },
    '/dev/work': { name: 'work' },
    '/blog': { name: 'blog' }
  };

export default function DevLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="antialiased max-w-2xl md:flex-row mx-4 lg:mx-auto flex-column min-vh-100 mb-auto mt-8">
            <div className="flex-auto min-w-0 flex flex-col px-2 md:px-0 mb-auto">
                <Navbar {...devNavItems} />
                {children}
            </div>
            <Footer />
        </main>
    );
}
