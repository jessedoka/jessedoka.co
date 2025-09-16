
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
    src: string | { url: string; fallback?: boolean | null };
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
    const [hasError, setHasError] = useState(false);
    
    
    const imageSrc = typeof src === 'string' ? src : src.url;
    const isFallback = typeof src === 'object' && src.fallback;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={loaded && { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative overflow-hidden shadow"
            style={{ aspectRatio: `${width} / ${height}` }} 
        >
            {hasError ? (
                <div className="flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
                    Image unavailable
                </div>
            ) : (
                <Image
                    src={imageSrc}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    alt={alt}
                    quality={isFallback ? 85 : 100}
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => setHasError(true)}
                    className="object-cover"
                    priority={false}
                />
            )}
        </motion.div>
    );
}
