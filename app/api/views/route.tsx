import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@/util/supabase/server';
import { cookies } from 'next/headers';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    if (req.method === 'POST') {
        // `increment_views` is the name we assigned to the function in Supabase, and page_slug is the argument we defined.
        await supabase.rpc('increment', { page_slug: req.body.slug })
        return res.status(200).send('Success')
    } else {
        return res.status(400).send('Invalid request method')
    }
}

export default handler