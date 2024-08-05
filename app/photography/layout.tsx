import type { Metadata } from 'next'
import "@/app/globals.css"
import Link from 'next/link';

const random = (length: number = 7) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
};

export const metadata: Metadata = {
    metadataBase: new URL('https://www.jessedoka.co/'),
    title: {
        default: `${random()} is a word`,
        template: '%s | Jesse Doka',
    },
    description: 'Developer',
    openGraph: {
        title: 'Jesse Doka',
        description: 'Developer',
        url: 'https://www.jessedoka.co/',
        siteName: 'Jesse Doka',
        locale: 'en_GB',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

const navItems = [
    {
        name: 'Home',
        href: '/photography',
    },
    {
        name: 'Archive',
        href: '/photography/archive',
    },
    {
        name: 'Blog',
        href: '/photography/blog',
    },
    {
        name: 'Store',
        href: '/photography/store',
    }
];

export default function DevLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="antialiased max-w-5xl md:flex-row mx-4 mt-8 lg:mx-auto d-flex flex-column min-vh-100 mb-auto">
            {/* this is the navbar below */}
            <nav className="sticky top-0 isolate z-10 flex items-center justify-center py-4 px-1 md:justify-between gap-8">
                <div className="relative flex rounded-xl border border-neutral-800 bg-neutral-900-/70 p-1 shadow-md backdrop-blur-md" style={{ opacity: 1, transform: 'none' }}>
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href} passHref>
                            <p className="text-neutral-100 dark:text-zinc-400 hover:text-neutral-100 dark:hover:text-zinc-200 px-2 py-1 rounded cursor-pointer transition-colors duration-200 ease-in-out">{item.name}</p>
                        </Link>
                    ))}
                </div>
                <div className="flex items-center">
                    <p className="text-neutral-100 dark:text-zinc-400">Jesse Doka</p>
                </div>
            </nav>
            {children}
        </main>
    );
}