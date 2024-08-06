import { Metadata } from 'next';
import { getBlogPosts } from '@/db/blog';
import BlogPage from '@/components/blogpage';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'A collection of my actions, thoughts, and reflections.',
};

export default async function Page() {
  const allBlogs = await getBlogPosts();

  return (
    <div className='antialiased max-w-2xl md:flex-row mx-4 mt-8 lg:mx-auto d-flex flex-column min-vh-100 mb-auto'>
      <BlogPage allBlogs={allBlogs} section="photography" />
    </div>
    
  )
}
