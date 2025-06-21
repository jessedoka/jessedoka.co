
import { getSignedImageUrls } from '@/lib/listimages';
import GalleryGrid from './galleryGrid';

export default async function Gallery() {
    const urls = await getSignedImageUrls('raw/gallery');
    return <GalleryGrid images={urls} />;
}
