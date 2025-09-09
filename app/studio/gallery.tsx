
import { getOptimizedImageUrls } from '@/lib/listimages';
import GalleryGrid from './galleryGrid';
import { headers } from 'next/headers';

export default async function Gallery() {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    
    const urls = await getOptimizedImageUrls('raw/gallery', userAgent);
    return <GalleryGrid images={urls.map(url => url.url)} />;
}
