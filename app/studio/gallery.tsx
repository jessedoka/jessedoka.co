// app/gallery/page.tsx  – STAYS A SERVER COMPONENT
import path from 'node:path';
import { listImages } from '@/lib/listimages';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';
import GalleryGrid from './galleryGrid';   // <- client component (next step)

export default async function Gallery() { 
    const keys = await listImages('raw/gallery');

    const variantKeys = keys.map((key) => {
        const { dir, name } = path.parse(key);
        return `${dir}/${name}-w640.webp`;
    });

    // If you switched to a public-bucket domain you can skip getSignedUrl()
    const urls = await Promise.all(
        variantKeys.map((key) =>
            getSignedUrl(
                r2,
                new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }),
                { expiresIn: 60 * 60 },
            ),
        ),
    );

    return <GalleryGrid images={urls} />;
}
