import Link from 'next/link';
import { getBlogPosts } from '@/app/db/blog';
import { Suspense } from 'react';

const projects = [
	{
		repo: "reacton",
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
		repo: "Robucks",
		link: "https://github.com/jessedoka/robucks",
		description: "Blockchain made using python",
	},
	{
		repo: "Unkbot",
		link: "https://github.com/jessedoka/unkbot",
		description: "A Discord bot that just says unk",
	}, 
];

function ArrowIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
				fill="currentColor"
			/>
		</svg>
	);
}

export default function Page() {
	let allBlogs = getBlogPosts();

	return (
		<section>
			<div className="flex flex-col">
				<div className="flex flex-col sm:flex-row justify-between">
					<div className="flex flex-col space-y-4">
						<div className="flex flex-col space-y-2">
							<h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
								Hey, I&apos;m <span className="text-primary-600 dark:text-primary-500">Jesse</span>.
							</h1>
							<p className="text-neutral-700 dark:text-neutral-300">
								I&apos;m a student studying at <a className="px" href="https://www.ncl.ac.uk/">Newcastle University</a> and I&apos;m currently in my &nbsp;
								<span className="text-[#de8315] "> 
									3rd &nbsp;
								</span>
								year of my Computer Science degree. I have a great intrest in full-stack development and machine learning and I&apos;m always looking for new opportunities to learn and grow. 
							</p>
						</div>
						{/* projects */}
						<div>
							<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
								Projects
							</h2>
							<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
								{projects.map((project) => (
									<div
										key={project.repo}
										className="rounded-lg p-6 "
									>
										<div className="flex flex-row space-x-2 items-center">
											<a
												href={project.link}
												target="_blank"
												rel="noreferrer"
												className="flex items-center space-x-2"
											>
												{/* <SiGithub className="w-6 h-6" /> */}
												<p className="text font-medium">
													{project.repo}
												</p>
											</a>
											<div className="hover:animate-bounce">
												<ArrowIcon />
											</div>
										</div>
										<p className="text-sm text-neutral-700 dark:text-neutral-300">
											{project.description}
										</p>
									</div>
								))}
							</div>
						</div>
						{/* blog list */}
						<div className="flex flex-col space-y-4">
							<h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
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
				</div>
			</div>
		</section>
	);
}
