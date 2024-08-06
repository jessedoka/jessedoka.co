import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from "@/lib/utils"
import Footer from '@/components/footer';
import "./globals.css"
import { Navbar } from '@/components/nav';

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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn(
                'text-black bg-white dark:text-white dark:bg-[#111010]',
                GeistSans.variable,
                GeistMono.variable
            )}
        >
            <body>
                <main className="antialiased max-w-2xl md:flex-row mx-4 lg:mx-auto d-flex flex-column min-vh-100 mb-auto mt-8">
                    <div className="flex-auto min-w-0 flex flex-col px-2 md:px-0 mb-auto">
                        <Navbar />
                        {children}
                    </div>
                    <Footer />
                    <Analytics />
                    <SpeedInsights />
                </main>
            </body>
        </html>
    );
}