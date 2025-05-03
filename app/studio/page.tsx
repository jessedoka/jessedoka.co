import Background from "@/components/background";
import Image from "next/image";
import Link from "next/link";
import { Navbar, NavItem } from '@/components/nav';
import Footer from "@/components/footer";

const navItems: Record<string, NavItem> = {
	'/studio': { name: 'home' },
	'/studio/work': { name: 'work' },
	'/blog': { name: 'blog' },
	'/studio/photography': { name: 'photography' },
	'/studio/store': { name: 'store' },
	'/studio/gear': { name: 'gear' },
};

function studioPage() {

	return (
		<main className="antialiased max-w-6xl md:flex-row mx-4 lg:mx-auto flex-column min-vh-100 mb-auto p-8">
			<div className="flex min-w-0 flex-col px-2 md:px-0 mb-auto justify-center">
				<Navbar {...navItems} />
				<section>
					<div className="relative m-12">
						<div className="relative w-full max-h-[10rem] overflow-hidden flex justify-center items-center">
							{/* <Background width={800} height={600} /> */}
							<Image src="/background.jpg" alt="studio" width={800} height={600}/>
						</div>
					</div>
					<div className="flex flex-col space-y-4 ">
						<div className="space-y-2 mb-4 text-center">
							<div>
								<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">
									Hey there, I&apos;m <span className="text-neutral-800 dark:text-neutral-200 ">Jesse</span> <span className="hover:animate-pulse">👋</span> Welcome to my digital home 🏡
								</h1>
								<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">I love to build things and share my experiences.</h1>
							</div>
						</div>
					</div>

					<Gallery />
					
				</section>
			</div>
			<Footer />
		</main>
	);
}

{/* a new method which takes in a bunch of images and turns them into a grid of rectangles and squares this is just a quick gallery */ }

function Gallery() {
    const images = [
        "/background.jpg",
        "/background.jpg",
        "/background.jpg",
		"/background.jpg",
		"/background.jpg",
		"/background.jpg",
		"/background.jpg",
		"/background.jpg",
		"/background.jpg",
    ];

    // Calculate the number of columns to make the grid as square as possible
    const numColumns = Math.ceil(Math.sqrt(images.length));

    return (
        <div className={`grid grid-cols-${3} gap-4`}>
            {images.map((src, index) => (
                <div key={index} className="relative w-full h-64">
                    <Image src={src} alt={`studio-${index}`} width={800} height={600} className="object-cover w-full h-full" />
					<div className="absolute inset-0 bg-black opacity-50 hover:opacity-0 transition-opacity duration-300"></div>
                </div>
            ))}
        </div>
    );
}

export default studioPage;