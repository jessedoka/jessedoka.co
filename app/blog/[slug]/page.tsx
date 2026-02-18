import { publicEnv } from '@/lib/env.mjs';
import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/mdx';

import { getBlogPosts } from '@/db/blog';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

export async function generateMetadata({
	params,
}:{
	params: { slug: string };
}): Promise<Metadata | undefined> {
	let posts = await getBlogPosts();
	let post = posts.find((post) => post.slug === params.slug);
	if (!post) {
		return;
	}  

	let {
		title,
		publishedAt: publishedTime,
		summary: description,
		image,
	} = post.metadata

	let NEXT_PUBLIC_SITE_URL = publicEnv.NEXT_PUBLIC_SITE_URL!; 
	let ogImage = image ? `${NEXT_PUBLIC_SITE_URL}${image}` : `${NEXT_PUBLIC_SITE_URL}/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			url: `${NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
			images: [
				{
					url: ogImage,
				},
			],
		},
	};
}


export default async function Blog({ params }: { params: { slug: string } }) {

	let posts = await getBlogPosts();
	let post = posts.find((post) => post.slug === params.slug);

	if (!post) {
		notFound();
	}

	const { metadata, content } = post;
	
	return (
		<section>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: metadata.title,
						datePublished: metadata.publishedAt,
						dateModified: metadata.publishedAt,
						description: metadata.summary,
						image: metadata.image
							? `process.env.SITE!${metadata.image}`
							: `process.env.SITE!/og?title=${metadata.title}`,
						url: `process.env.SITE!/blog/${post.slug}`,
						author: {
							'@type': 'Person',
							name: 'Jesse Doka',
						},
					}),
				}}
			/>
			<h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
				{metadata.title}
			</h1>
			<div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					{formatDate(metadata.publishedAt)}
				</p>
			</div>
			{/* image */}
			{metadata.image && (
				<div className="mb-8">
					<Image
						src={metadata.image}
						alt={metadata.title}
						width={1200}
						height={600}
						className="rounded-lg"
					/>
				</div>
			)}
			<article className="prose prose-quoteless prose-neutral dark:prose-invert">
				<CustomMDX source={content} />
			</article>
		</section>
	);
}