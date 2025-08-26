import Gallery from './gallery'
import Image from 'next/image'

export default async function StudioPage() { 

	const works = [
		{ name: 'Keswick', url: 'keswick', banner: 'https://img.jessedoka.co/raw/keswick/A7407626-w1920.webp' },
	];

	return (
		<section>
			<div className="flex flex-col space-y-4 text-center">
				<h1 className="font-medium text-4xl mb-8 tracking-tighter">
					My Studio
				</h1>
			</div>


			<h2 className="font-medium text-2xl mb-8 tracking-tighter">
				Recent Works
			</h2>

			{works.map((work) => (
				<div key={work.url} className="group relative w-full max-h-[15rem] overflow-hidden flex justify-center items-center mb-10">
					<a href={`/studio/work/${work.url}`} className="block relative">
						<Image
							width={1920}
							height={0}
							loading="lazy"
							src={work.banner}
							alt={work.name}
							className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<h2 className="absolute inset-0 flex items-center justify-center text-white text-center font-medium text-2xl tracking-tighter">
							{work.name}
						</h2>
					</a>
				</div>
			))}

			<h2 className="font-medium text-2xl mb-8 tracking-tighter">
				Photographs
			</h2>

			<Gallery />
		</section>
	)
} 