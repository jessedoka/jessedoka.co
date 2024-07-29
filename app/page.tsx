import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <Image src="/icon.svg" alt="icon" width={120} height={120} />
            <h1>dev</h1>
            
            <Link href="/dev">
                <p>Developer</p>
            </Link>





        </div>
    );
}