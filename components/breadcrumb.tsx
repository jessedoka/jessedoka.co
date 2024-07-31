// create breadcrumb component
"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';



// turn url into a breadcrumb
export default function Breadcrumb() {
    return (
        <div className="flex gap-2 items-center">
            {
                // if path is on home page do not display
                usePathname() === "/" ? null : (
                    <Link href="/">
                        <p className="text-lg text-neutral-800 dark:text-neutral-400 font-medium">~</p>
                    </Link>
                )
            }
            {usePathname().split("/").map((path, index, array) => {
                if (path === "") {
                    return null;
                }
                return (
                    <Link key={index} href={array.slice(0, index + 1).join("/")}>
                        <p className="text-base text-neutral-800 dark:text-neutral-400 font-medium">{path}</p>
                    </Link>
                )
            })}
        </div>
    )
}