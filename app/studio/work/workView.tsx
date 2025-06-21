'use client';

import Image from 'next/image';

export default function WorkView({ images }: { images: string[] }) {
    const width = 500; // Default width for aspect ratio
    const height = 500; // Default height for aspect ratio
    return (
        <div
            className="grid gap-4 overflow-auto h-[600px]"
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
            {images.map((src, i) => (
                <div
                    key={i}
                >
                    <Image
                        src={src}
                        width={width}
                        height={height}
                        style={{ objectFit: 'cover' }}
                        alt={`Work ${i + 1}`}
                        quality={100}
                        loading="lazy"
                        className="object-cover w-full h-auto"
                    />
                </div>
            ))}
        </div>
    );
}