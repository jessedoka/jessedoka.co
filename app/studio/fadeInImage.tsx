// app/gallery/FadeInImage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
};

export default function FadeInImage({
    src,
    alt,
    width = 350,
    height = 500,
}: Props) {
    const [loaded, setLoaded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={loaded && { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden shadow"
            style={{ aspectRatio: `${width} / ${height}` }} // keeps layout stable
        >
            <Image
                src={src}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                alt={alt}
                quality={100}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className="object-cover"
            />
        </motion.div>
    );
}
