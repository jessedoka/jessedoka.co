import Image from "next/image";
export default function PhotographyPage(){
    return (
        <div className="relative w-full h-full">
            <div className="absolute inset-0">
                <div className="w-full max-h-[12rem] overflow-hidden">
                    <Image src="https://images.unsplash.com/photo-1716379668958-77c467e77fbd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="worm" width={1920} height={1080} />
                </div>
            </div>
            <div className="absolute bottom-[-14rem] left-4 z-10 ">
                <Image src="/icon.svg" alt="icon" width={120} height={120} />
            </div>
        </div>
    )
}