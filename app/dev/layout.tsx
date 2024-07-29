import type { Metadata } from 'next'
import { Navbar } from '../../components/nav'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from '@/components/footer';
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
    <>
      <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 mb-auto">
        <Navbar />
        {children}
        <Analytics />
        <SpeedInsights />
      </main>
      <div className="mt-10" />
      <Footer />
    </>
  );
}