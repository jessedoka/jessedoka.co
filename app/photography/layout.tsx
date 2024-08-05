import type { Metadata } from 'next'
import "@/app/globals.css"

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

export default function DevLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            {/* this is the navbar below */}
            <div className='sticky top-0 z-50 p-10 border-b-2 border-neutral-900'>
                <div className='flex justify-between items-center'>
                    <div>Jesse Doka</div>
                    <div>Available for freelance</div>
                </div>
            </div> 
            {children}
        </main>
    );
}