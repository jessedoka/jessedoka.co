'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ProgressiveImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

export default function ProgressiveImage({
    src,
    alt,
    width = 500,
    height = 500,
    className = '',
    priority = false
}: ProgressiveImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (priority) return; // Skip intersection observer for priority images

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    useEffect(() => {
        if (!isInView) return;

        // Create a new image to preload
        const img = new window.Image();
        img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
        };
        img.src = src;
    }, [src, isInView]);

    return (
        <div ref={imgRef} className={`relative ${className}`}>
            {!isInView ? (
                // Placeholder while not in view
                <div 
                    className="bg-gray-200 animate-pulse"
                    style={{ width, height }}
                />
            ) : (
                <Image
                    src={imageSrc}
                    width={width}
                    height={height}
                    alt={alt}
                    className={`transition-opacity duration-300 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setIsLoaded(true)}
                    loading={priority ? 'eager' : 'lazy'}
                    quality={100}
                />
            )}
        </div>
    );
}
