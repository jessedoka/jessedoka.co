
"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs = pathSegments.map((segment, idx) => {
        const href = '/' + pathSegments.slice(0, idx + 1).join('/');
        const label = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toLowerCase());
        return (
            <Link key={idx} href={href}>
                <p className="text-base text-neutral-800 dark:text-neutral-400 font-medium">{label}</p>
            </Link>
        );
    });
    return (
        <div className="gap-2 items-center hidden md:flex">
            {pathname !== '/' && (
                <Link href="/">
                    <p className="text-lg text-neutral-800 dark:text-neutral-400 font-medium">~</p>
                </Link>
            )}
            {breadcrumbs}
        </div>
    );
}
