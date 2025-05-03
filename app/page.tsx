import Link from 'next/link';
import Image from "next/image";
import Background from "@/components/background";
import Footer from '@/components/footer';

export default async function Page() {
	return (
		<main className="antialiased max-w-4xl md:flex-row mx-4 lg:mx-auto flex-column min-vh-100 mb-auto mt-8">
			<div className="flex-auto min-w-0 flex flex-col px-2 md:px-0 mb-auto">
				<section>
					<div className="relative w-full h-full">
						<div className="absolute inset-0">
							<Background width={800} height={600} />
						</div>
						<div className="absolute bottom-[-14rem] left-4 z-10 ">
							<Image src="/icon.svg" alt="icon" width={120} height={120} />
						</div>
					</div>
					<div className="flex flex-col space-y-4 mt-[15rem]">
						<div className="space-y-2 mb-4 text-center">
							<div>
								<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">
									Hey there, I&apos;m <span className="text-neutral-800 dark:text-neutral-200 ">Jesse</span> <span className="hover:animate-pulse">👋</span> Welcome to my digital home 🏡
								</h1>
								<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">I love to build things and share my experiences.</h1>
							</div>
						</div>

						{/* two links studio and dev flex row */}
						<div className="flex flex-col md:flex-row md:space-y-0 justify-center">
							<Link
								href="/studio"
								className="rounded hover:dark:bg-neutral-900 hover:bg-neutral-200 p-4 duration-500 transition-all cursor-pointer flex flex-col items-center justify-center"
							>
								<p className="text font-medium">Studio</p>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">My creative space</p>
							</Link>
							<Link
								href="/dev"
								className="rounded hover:dark:bg-neutral-900 hover:bg-neutral-200 p-4 duration-500 transition-all cursor-pointer flex flex-col items-center justify-center"
							>
								<p className="text font-medium">Dev</p>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">My development space</p>
							</Link>
						</div>
					</div>
				</section>
			</div>
			<Footer />
		</main>
	);
}
