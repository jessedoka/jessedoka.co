'use server'
import { cookies } from 'next/headers';
import { createClient } from '@/util/supabase/server';
// time since last update



// insert new blog slug into articles table
export async function insertBlogSlug(slug: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
        .from('article')
        .upsert([{ slug: slug }])
    // if not error.message is duplicate key, then log error
    if (error && error.message !== 'duplicate key value violates unique constraint "article_slug_key"') {
        console.log(error)
    }
    
    return data
}

// get blog view count
export async function getBlogViewCount(slug: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
        .from('article')
        .select('view_count')
        .eq('slug', slug)
    if (error) {
        console.log(error)
    }
    return data
}


// increment blog view count
export async function incrementBlogViewCount(slug: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
        .rpc('increment', { slug: slug })
    if (error) {
        console.log(error)
    }
    return data
}