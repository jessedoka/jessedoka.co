'use client';

import FadeInImage from './fadeInImage';

export default function GalleryGrid({ images }: { images: string[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src, i) => (
                <FadeInImage key={i} src={src} alt={`Photo ${i + 1}`} />
            ))}
        </div>
    );
}