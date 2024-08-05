import Image from "next/image"

export default function PhotographyPage() {
    return (
        <div className="relative w-full h-full flex justify-center items-center">
            <Image src="/photos/field.jpg" alt="icon" width={500} height={500} />
        </div>
    )
}