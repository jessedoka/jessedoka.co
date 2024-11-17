import Link from 'next/link';
import { getBlogPosts } from '@/db/blog';
import Image from "next/image";
import Background from "@/components/background";

const projects = [
	{
		repo: "Reacton",
		link: "https://github.com/jessedoka/reacton",
		description: "Reaction Tester built with React",
	},
	{
		repo: "InkByter",
		link: "https://github.com/jessedoka/InkByter",
		description: "Simple Text Editor made in C",
	},
	{
		repo: "LCT",
		link: "https://github.com/jessedoka/LCT",
		description: "A tool for building and managing sentiment analysis lexicons.",
	},
	{
		repo: "Rankhacker",
		link: "https://github.com/jessedoka/rankhacker",
		description: "A place where I put all the programming challenges I do",
	},
	{
		repo: "Sudoka",
		link: "https://github.com/jessedoka/sudoka",
		description: "A Sudoku game with REST API",
	},
	{
		repo: "Unkbot",
		link: "https://github.com/jessedoka/unkbot",
		description: "A Discord bot that just says unk",
	},
];

export default function Page() {
	let allBlogs = getBlogPosts();

	return (
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
				<div className="space-y-2 mb-4 ">
					<div>
						<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">
							Hey there, I&apos;m <span className="text-neutral-800 dark:text-neutral-200 ">Jesse</span> <span className="hover:animate-pulse">👋</span> Welcome to my digital home 🏡
						</h1>
						<h1 className="text-2xl text-neutral-800 dark:text-neutral-400 font-medium">I love to build things and share my experiences.</h1>
					</div>
				</div>
				<h1 className="text-neutral-800 dark:text-neutral-400 text-xl font-medium">
					My <a href="https://github.com/jessedoka" className='hover:text-orange-400 hover:underline duration-300 transition'>journey</a> has taken me through <Link href="/work" className='hover:text-orange-400 hover:underline duration-300 transition'>internships</Link> and projects where I have developed web applications, enhanced user interactions, and explored the realms of machine learning and predictive analytics.
				</h1>
				{/* projects */}
				<div className='space-y-8' id="projects">
					<h2 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
						Projects
					</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
						{projects.map((project) => (
							<Link
								href={project.link}
								target="_blank"
								rel="noreferrer"
								key={project.repo}
								className="rounded border border-neutral-300 dark:border-neutral-800 hover:dark:bg-neutral-900 hover:bg-neutral-200 p-4 duration-500 transition-all cursor-pointer"
							>
								<div className="flex flex-row space-x-2 items-center">

									{/* <SiGithub className="w-6 h-6" /> */}
									<p className="text font-medium">
										{project.repo}
									</p>
								</div>
								<p className="text-sm text-neutral-700 dark:text-neutral-300">
									{project.description}
								</p>
							</Link>
						))}
					</div>
				</div>
				{/* blog list */}
				<div className="flex flex-col space-y-4 pt-8">
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
										<p className="text-neutral-800 dark:text-neutral-300 tracking-tight underline decoration-neutral-400 hover:decoration-neutral-500 hover:">
											{post.metadata.title}
										</p>
										<p className='text-neutral-700 dark:text-neutral-300 text-sm'>
											{new Date(post.metadata.publishedAt).toLocaleDateString(
												'en-gb',
												{
													year: 'numeric',
													month: 'short',
													day: 'numeric',
												}
											)}
										</p>
									</div>
								</div>
							</Link>
						))}
				</div>
			</div>
		</section >
	);
}
