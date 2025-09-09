'use client';

import Image from 'next/image';

export default function WorkView({ images }: { images: (string | { url: string; fallback?: boolean | null })[] }) {
    const width = 500; // Default width for aspect ratio
    const height = 500; // Default height for aspect ratio
    
    return (
        <div
            className="grid gap-4 overflow-auto h-[635px]"
            style={{
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE and Edge
                WebkitOverflowScrolling: 'touch',
            }}
        >
            {/* Hide scrollbar for Webkit browsers */}
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            {images.map((src, i) => {
                const imageSrc = typeof src === 'string' ? src : src.url;
                const isFallback = typeof src === 'object' && src.fallback;
                
                return (
                    <div key={i}>
                        <Image
                            src={imageSrc}
                            width={width}
                            height={height}
                            style={{ objectFit: 'cover' }}
                            alt={`Work ${i + 1}`}
                            quality={isFallback ? 85 : 100}
                            loading="lazy"
                            className="object-cover w-full h-auto"
                            sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 500px"
                            onError={(e) => {
                                console.warn(`Failed to load image: ${imageSrc}`);
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}