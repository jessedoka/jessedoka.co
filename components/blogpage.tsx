'use client';

import Link from 'next/link';
import { useState } from 'react';

const wordsPerMinute = 300;

function calculateReadingTime(content: string) {
    let words = content.split(' ').length;
    let minutes = words / wordsPerMinute;
    return Math.ceil(minutes);
}

export default function BlogPage({ allBlogs }: { allBlogs: any[] }) {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const tags = allBlogs.reduce((acc, post) => {
        post.tags
        .filter((tag: any) => !tag.includes('draft') && !tag.includes('photography'))
        .forEach((tag: any) => {
            if (!acc.includes(tag)) {
                acc.push(tag);
            }
        });
        return acc;
    }, [] as string[]);

    return (
        <section>
            <h1 className="font-medium text-2xl mb-8 tracking-tighter">
                blog
            </h1>

            <div className='flex flex-row space-x-4 mb-8'>
                <button
                    className={`text-neutral-600 dark:text-zinc-400 
                        hover:text-neutral-600 dark:hover:text-zinc-200
                        border border-zinc-500 px-1 rounded bg-zinc-900 transition-colors duration-200 ease-in-out`}
                    onClick={() => setSelectedTag(null)}
                >
                    all
                </button>
                {tags.map((tag: any) => (
                    <button
                        key={tag}
                        className={`text-neutral-600 dark:text-zinc-400 
                        hover:text-neutral-600 dark:hover:text-zinc-200
                        border border-zinc-500 p-1 rounded bg-zinc-900 transition-colors duration-200 ease-in-out`}
                        onClick={() => setSelectedTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {allBlogs
                .filter((post) => !post.tags.includes('draft') && !post.tags.includes('photography') && (selectedTag ? post.tags.includes(selectedTag) : true))
                .sort((a, b) => {
                    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
                        return -1;
                    }
                    return 1;
                })
                .map((post) => (
                    <Link
                        key={post.slug}
                        className="flex flex-col space-y-1 mb-4 
            rounded p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out"
                        href={`/dev/blog/${post.slug}`}
                    >
                        <div className="w-full flex flex-col">
                            <div className='flex flex-row space-x-2 justify-between'>
                                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                                    {post.metadata.title}
                                </p>
                                <p className='text-neutral-700 dark:text-neutral-300 text-sm'>
                                    {post.tags.join(', ')}
                                </p>
                            </div>

                            <div className='flex flex-row space-x-2 justify-between'>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                    {new Date(post.metadata.publishedAt).toLocaleDateString('en-gb', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>

                                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                    {calculateReadingTime(post.content)} min read
                                </p>
                            </div>

                            <p className="text-neutral-600 dark:text-neutral-300">
                                {post.metadata.summary}
                            </p>
                        </div>
                    </Link>
                ))}
        </section>
    );
}
