import Image from "next/image"


export default function PhotographyPage() {
    return (
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="p-6">
                <div className="relative w-full h-full flex justify-center items-center mb-4">
                    <Image src="/photos/field.jpg" alt="icon" width={800} height={800} />
                </div>
                <div className="flex items-center justify-center text-zinc-700">
                    ISO: 100 | f/5.6 | 1/125
                </div>
            </div>

            <p className="text-center border border-neutral-800 p-2 rounded-xl bg-neutral-900 text-neutral-300">I am a passionate hobbyist photographer with a love for street and nature photography. My lens captures the raw beauty of urban life and the serene essence of the natural world, bringing you candid moments from bustling streets and tranquil scenes from untouched landscapes. Through my photography, I aim to tell stories and evoke emotions, inviting you to see the world through my eyes. Whether it’s the vibrant energy of city life or the peaceful solitude of nature, each photo reflects my journey and perspective. Join me in exploring these moments and finding the magic in everyday scenes. Feel free to browse, share your thoughts, and connect with me on this photographic adventure.</p>
            
        </div>
    )
}