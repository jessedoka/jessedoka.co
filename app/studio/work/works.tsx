import { getOptimizedImageUrls } from '@/lib/listimages';
import WorkView from './workView';
import { headers } from 'next/headers';
import { WORK_PATHS } from './constants';

export default async function Works({ name }: { name: string }) {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    
    const workPath = WORK_PATHS[name] || `raw/${name}`;
    
    const urls = await getOptimizedImageUrls(workPath, userAgent);
    return <WorkView images={urls} />;
}
