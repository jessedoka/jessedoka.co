
import { getOptimizedImageUrls } from '@/lib/listimages';
import WorkView from './workView';
import { headers } from 'next/headers';

export default async function Works({ name }: { name: string }) {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    
    const urls = await getOptimizedImageUrls(`raw/${name}`, userAgent);
    return <WorkView images={urls} />;
}
