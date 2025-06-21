import Works from "../works";
import { Navbar, NavItem } from '@/components/nav'
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';

import { getBlogPosts } from '@/db/blog';

const navItems: Record<string, NavItem> = {
    '/studio': { name: 'home' },
    '/studio/work': { name: 'work' },
    '/blog': { name: 'blog' },
    '/studio/photography': { name: 'photography' },
    '/studio/store': { name: 'store' },
    '/studio/gear': { name: 'gear' },
}

export default async function Work({ params }: { params: { slug: string } }) {

    let posts = await getBlogPosts();
    let post = posts.find((post) => post.slug === params.slug);

    if (!post) {
        notFound();
    }

    const { metadata, content } = post;


    return (
        <section>
            <div className="flex flex-col space-y-4 ">
                <div className="space-y-2 mb-20 text-center">
                    <h1 className="text-4xl text-neutral-800 dark:text-neutral-400 font-medium">
                        {metadata.title}
                    </h1>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 min-w-0">
                    <Works name={params.slug} />
                </div>
                <article className="prose prose-quoteless prose-neutral dark:prose-invert flex-1 min-w-0">
                    <CustomMDX source={content} />
                </article>
            </div>
        </section>
    );
}