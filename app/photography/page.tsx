import Image from "next/image"

export default function PhotographyPage() {
    return (
        <div className="relative w-full h-full flex justify-center items-center p-6">
            <div className="">

                <Image src="/photos/field.jpg" alt="icon" width={800} height={800} />
            </div>
        </div>
    )
}