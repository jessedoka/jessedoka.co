import Image from 'next/image';
import fs from 'fs';
import path from 'path';

// dynamically generate a bento grid of all photos in /photos/*
export default function Archive() {
    // photos are contained in public/photos/*

    const photosDirectory = path.join(process.cwd(), 'public', 'photos','archive');
    const filenames = fs.readdirSync(photosDirectory);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {filenames.map((filename) => (
                <div key={filename} className="relative w-full h-full">
                    <Image
                        src={`/photos/archive/${filename}`}
                        alt={filename}
                        width={800}
                        height={800}
                        objectFit='cover'
                    />
                </div>
            ))}
        </div>
    );
}
