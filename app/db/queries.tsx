'use server'
import { cookies } from 'next/headers';
import { createClient } from '@/util/supabase/server';
// time since last update



// // insert new blog slug into analytics table
// export async function insertBlogSlug(slug: string) {
//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);
//     const { data, error } = await supabase
//         .from('analytics')
//         .upsert([{ slug: slug }])
//     // if not error.message is duplicate key, then log error
//     if (error && error.message !== 'duplicate key value violates unique constraint "analytics_slug_key"') {
//         console.log(error)
//     }
    
//     return data
// }

// get blog view count
// export async function getBlogViews(slug: string) {
//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);
//     const { data, error } = await supabase
//         .from('analytics')
//         .select('view_count')
//         .eq('slug', slug)
//     if (error) {
//         console.log(error)
//     }

//     if (data) {
//         return data[0].view_count
//     }
//     return data
// }


// // increment blog view count
// export async function incrementBlogViewCount(slug: string) {
//     const cookieStore = cookies();
//     const supabase = createClient(cookieStore);
//     const { data, error } = await supabase
//         .rpc('increment', { slug: slug })
//     if (error) {
//         console.log(error)
//     }
//     return data
// }