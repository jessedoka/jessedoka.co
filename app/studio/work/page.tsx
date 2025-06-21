import { Navbar, NavItem } from '@/components/nav'

// create a list of objects with the work names and urls for the work pages
const works = [
    { name: 'King Of The Ring', url: 'kingofthering', banner: 'https://img.jessedoka.co/raw/kingofthering/A7408268-w640.webp'},
    { name: 'Wales', url: 'wales', banner: 'https://img.jessedoka.co/raw/wales/A7402039-w640.webp'},
];

const navItems: Record<string, NavItem> = {
    '/studio': { name: 'home' },
    '/studio/work': { name: 'work' },
    '/blog': { name: 'blog' },
    '/studio/photography': { name: 'photography' },
    '/studio/store': { name: 'store' },
    '/studio/gear': { name: 'gear' },
}

export default async function WorkPage() {

    return (
        <section>
            <div className="flex flex-col space-y-4 ">
                <div className="space-y-2 mb-20 text-center">
                    <h1 className="text-4xl text-neutral-800 dark:text-neutral-400 font-medium">
                        My Work
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {works.map((work) => (
                    <div key={work.url} className="group relative">
                        <a href={`/studio/work/${work.url}`}>
                            <img
                                src={work.banner}
                                alt={work.name}
                                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                            />
                            <h2 className="mt-2 text-lg font-semibold text-center">{work.name}</h2>
                        </a>
                    </div>
                ))}
            </div>
        </section>
    )
} 
