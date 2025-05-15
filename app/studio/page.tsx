import { Navbar, NavItem } from '@/components/nav'
import Footer from '@/components/footer'
import Image from 'next/image'
import Gallery from './gallery'

const navItems: Record<string, NavItem> = {
	'/studio': { name: 'home' },
	'/studio/work': { name: 'work' },
	'/blog': { name: 'blog' },
	'/studio/photography': { name: 'photography' },
	'/studio/store': { name: 'store' },
	'/studio/gear': { name: 'gear' },
}

export default async function StudioPage() { 

	return (
		<main className="antialiased max-w-6xl md:flex-row mx-4 lg:mx-auto flex-column min-vh-100 mb-auto p-8">
			<div className="flex min-w-0 flex-col px-2 md:px-0 mb-auto justify-center">
				<Navbar {...navItems} />
				<section>
					<div className="relative m-12">
						<div className="relative w-full max-h-[10rem] overflow-hidden flex justify-center items-center">
							<Image src="/background.jpg" alt="studio" width={800} height={600} />
						</div>
					</div>

					<div className="flex flex-col space-y-4 ">
						<div className="space-y-2 mb-4 text-center">
							<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">
								Hey there, I&apos;m <span className="text-neutral-800 dark:text-neutral-200">Jesse</span>{' '}
								<span className="hover:animate-pulse">👋</span> Welcome to my digital home 🏡
							</h1>
							<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">
								I love to build things and share my experiences.
							</h1>
						</div>
					</div>

					{/* pass the images down */}
					<Gallery />
				</section>
			</div>
			<Footer />
		</main>
	)
} 