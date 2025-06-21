import { Metadata } from 'next';
import { getBlogPosts } from '@/db/blog';
import BlogPage from '@/components/blogpage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'A collection of my actions, thoughts, and reflections.',
};

export default async function Page() {
  const allBlogs = await getBlogPosts();
  if (allBlogs.length === 0) {
    return <div>No blog posts available.</div>;
  }
  return <BlogPage allBlogs={allBlogs} />;
}
