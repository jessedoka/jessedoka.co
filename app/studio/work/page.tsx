import Image from 'next/image';

const works = [
    { name: 'Keswick', url: 'keswick', banner: 'https://img.jessedoka.co/raw/keswick/A7407626-w1920.webp'},
    { name: 'Wales', url: 'wales', banner: 'https://img.jessedoka.co/raw/wales/A7402585-w1920.webp'},
    { name: 'King Of The Ring', url: 'kingofthering', banner: 'https://img.jessedoka.co/raw/kingofthering/A7408567-w1920.webp'},
];

export default async function WorkPage() {

    return (
        <section>
            <div className="flex flex-col space-y-4 ">
                <div className="space-y-2 mb-20 text-center">
                    <h1 className="font-medium text-4xl mb-8 tracking-tighter">
                        My Work
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {works.map((work) => (
                    <div key={work.url} className="group relative">
                        <a href={`/studio/work/${work.url}`} className="block relative">
                            <Image
                                width={1920}
                                height={1080}
                                loading="lazy"
                                src={work.banner}
                                alt={work.name}
                                className="w-full h-auto object-cover rounded-sm transition-transform duration-300 group-hover:scale-105"
                            />
                            <h2 className="absolute inset-0 flex items-center justify-center text-white rounded-lg text-center font-medium text-2xl mb-8 tracking-tighter">
                                {work.name}
                            </h2>
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
}
