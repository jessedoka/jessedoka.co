import Works from "../works";
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';

import { getStudioPosts } from '@/db/blog';

export default async function Work({ params }: { params: { slug: string } }) {

    let posts = await getStudioPosts();
    let post = posts.find((post) => post.slug === params.slug);

    if (!post) {
        notFound();
    }

    const { metadata, content } = post;


    return (
        <section>
            <div className="flex flex-col space-y-4">
                <div className="space-y-2 text-center">
                    <h1 className="font-medium text-4xl mb-8 tracking-tighter">
                        {metadata.title}
                    </h1>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                    <Works name={params.slug} />
                </div>
                <article className="prose prose-quoteless prose-neutral dark:prose-invert flex-1 min-w-0">
                    <CustomMDX source={content} />
                </article>
            </div>
        </section>
    );
}