import { Link } from 'next-view-transitions';
import Image from "next/image";
import Background from "@/components/background";
import Footer from '@/components/footer';
import { getBlogPosts } from '@/db/blog';
import { WORKS } from '@/app/studio/work/constants';
import { formatShortDate } from '@/lib/utils';

export default async function Page() {

	const allBlogs = await getBlogPosts();

	const works = WORKS.filter((w) => w.featured);

	return (
		<main className="antialiased max-w-4xl md:flex-row mx-4 lg:mx-auto flex-column min-vh-100 mb-auto mt-8">
			<div className="flex-auto min-w-0 flex flex-col px-2 md:px-0 mb-auto">
				<section>
					<div className="relative w-full overflow-hidden">
						<Background width={800} height={600} />
					</div>
					<div className="flex flex-col space-y-4 mt-12">
						<div className="space-y-2 mb-4 text-center">
							<div>
								<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">
									<span className="text-neutral-800 dark:text-neutral-200 ">Jesse Doka</span>
								</h1>
								<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">Two spaces, one obsession: making things that <span className='italic'>last</span>.</h1>
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

						<h2 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
							Recent Works
						</h2>

						{works.map((work) => (
							<div key={work.url} className="group relative w-full max-h-[15rem] overflow-hidden flex justify-center items-center mb-10">
								<a href={`/studio/work/${work.url}`} className="block relative">
									<Image
										width={1920}
										height={1080}
										src={work.banner}
										alt={`${work.name} — featured studio piece`}
										priority
										className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<h2 className="absolute inset-0 flex items-center justify-center text-white text-center font-medium text-2xl tracking-tighter">
										{work.name}
									</h2>
								</a>
							</div>
						))}


						<h2 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
							Blog
						</h2>
						{allBlogs
							.sort((a, b) => {
								if (
									new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
								) {
									return -1;
								}
								return 1;
							})
							.slice(0, 5)
							.map((post) => (
								<Link
									key={post.slug}
									className="flex flex-col space-y-1 mb-4"
									href={`/blog/${post.slug}`}
								>
									<div className="w-full flex flex-col">
										<div className='flex flex-row space-x-2 justify-between'>
											<p className="min-w-0 text-neutral-800 dark:text-neutral-300 tracking-tight underline decoration-neutral-400 hover:decoration-neutral-500 hover:">
												{post.metadata.title}
											</p>
											<p className='flex-shrink-0 text-neutral-700 dark:text-neutral-300 text-sm'>
												{formatShortDate(post.metadata.publishedAt)}
											</p>
										</div>
									</div>
								</Link>
							))}
					</div>
				</section>
			</div>
			<Footer />
		</main>
	);
}
