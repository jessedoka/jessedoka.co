import Image from 'next/image'

export default async function StudioPage() { 
	return (
		<section className='antialiased max-w-4xl md:flex-row lg:mx-auto flex-column min-vh-100 mb-auto px-2 sm:px-4 md:p-8'>
			<div className="flex flex-col space-y-4 text-center">
				<h1 className="font-medium text-4xl mb-8 tracking-tighter">
					My Gear
				</h1>
			</div>

			{/* First item: image right, text left */}
			<div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 space-y-4 md:space-y-0 mt-8">
				<div className="flex-1 text-left">
					<h2 className="text-2xl font-semibold mb-2">Apple iPhone 16 Pro</h2>
					<p className="text-gray-300">
						The camera that’s always with me, relying on for spur-of-the-moment snaps 
						when lugging a big camera isn’t practical. 
					</p>
					<p className="text-gray-300 mt-2">
						Despite its slim profile, it boasts a serious triple-lens setup: a high-resolution 48MP main camera
						and a new 48MP ultra-wide camera, plus a 12MP 5× telephoto lens that lets me zoom in on distant scenes 
						without losing detail. 
					</p>
					<p className="text-gray-300 mt-2">
						All these options but I always go for the main sensor. The main sensor is larger than previous gen which helps 
						it capture more light for sharper, better, low-light photos while also snapping vivid, crisp images with ease. 

					</p>
					<p className="text-gray-300 mt-2">
						Whether I’m capturing a golden sunset during an evening walk or a funny moment with friends, 
						this phone makes it easy to get great photos on the fly.
					</p>
				</div>
				<Image
					width={1920}
					loading="lazy"
					src="/phone.jpg"
					alt="Phone"
					className="w-80 h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
				/>
			</div>

			{/* Second item: image left, text right */}
			<div className="flex flex-col md:flex-row-reverse items-center md:items-start md:space-x-0 md:space-x-reverse md:space-x-8 space-y-4 md:space-y-0 mt-8">
				<div className="flex-1 text-left">
					<h2 className="text-2xl font-semibold mb-2">Sony A7 IV with 28–70mm Kit Lens</h2>
					<p className="text-gray-300">
						When it’s time for serious shooting like travel adventures, planned photo walks 
						or important events, I reach for my Sony A7 IV. This full-frame mirrorless camera 
						is a dependable workhorse that delivers a big step up in image quality and control. 
					</p>
					<p className="text-gray-300 mt-2">
						I typically use the camera with Sony’s 28–70mm f/3.5-5.6 OSS kit lens, not the best but it covers everything 
						from wide-angle landscapes at 28 mm to portrait-style shots at 70 mm. This lens is an all-purpose 
						champ, it’s not the fastest aperture-wise, but it’s lightweight and versatile. 
					</p>
					<p className="text-gray-300 mt-2">
						The A7 IV is a bit larger to carry around, but for trips and occasions where I want the best shots 
						and the flexibility of interchangeable lenses, it’s absolutely worth it. It’s my go-to for capturing memories 
						with superb clarity, from sweeping vacation vistas to candid moments at family events, the Sony A7 IV has me covered.
					</p>
				</div>
				<Image
					width={1920}
					loading="lazy"
					src="/camera.jpg"
					alt="Main Camera"
					className="w-80 h-auto object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
		</section>
	)
}