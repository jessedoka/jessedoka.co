import Link from 'next/link';
import { Suspense } from 'react';
import { getBlogPosts } from '@/app/db/blog';
import { getBlogViews } from '@/app/db/queries';

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts',
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();

  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        blog
      </h1>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
              <Suspense fallback={<p className="h-6"/>}>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {getBlogViews(post.slug)} views
                </p>
              </Suspense>
            </div>
          </Link>
        ))}
    </section>
  );
}

