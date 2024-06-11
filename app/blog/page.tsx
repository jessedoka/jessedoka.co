import Link from 'next/link';
import { Suspense } from 'react';
import { getBlogPosts } from '@/app/db/blog';

export const metadata = {
  title: 'Blog',
  description: 'Read my thoughts',
};

// calculate reading time

const wordsPerMinute = 200;

function calculateReadingTime(content: string) {
  let words = content.split(' ').length;
  let minutes = words / wordsPerMinute;
  return Math.ceil(minutes);
}

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
            className="flex flex-col space-y-1 mb-4 
            rounded p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200 ease-in-out"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight te">
                {post.metadata.title}
              </p>

              <div className='flex flex-row space-x-2 justify-between'>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {new Date(post.metadata.publishedAt).toLocaleDateString('en-GB', {
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

