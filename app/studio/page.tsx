import { Navbar, NavItem } from '@/components/nav'
import Footer from '@/components/footer'
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
		<section>
			{/* <div className="relative m-12">
				<div className="relative w-full max-h-[10rem] overflow-hidden flex justify-center items-center">
					<Image src={urls[0]} alt="studio" width={800} height={600} />
				</div>
			</div> */}

			<div className="flex flex-col space-y-4 ">
				<div className="space-y-2 mb-20 text-center">
					<h1 className="text-4xl text-neutral-800 dark:text-neutral-400 font-medium">
						My Studio
					</h1>
				</div>
			</div>

			<Gallery />
		</section>
	)
} 