import { Metadata } from 'next';
import { getBlogPosts } from '@/db/blog';
import BlogPage from '@/components/blogpage';


export const metadata: Metadata = {
  title: 'Blog',
  description: 'A collection of my actions, thoughts, and reflections.',
};

export default async function Page() {
  const allBlogs = await getBlogPosts();
  return <BlogPage allBlogs={allBlogs} section="dev" />;
}
