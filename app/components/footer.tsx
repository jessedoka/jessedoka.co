import Link from 'next/link';
import { SiGithub, SiLinkedin, SiGmail } from "react-icons/si";

export default function Footer() {
    return (
        <div className="prose mb-7">
            <hr />

            <footer className="flex justify-between items-center ">
                <span className='dark:text-neutral-200'>Jesse Doka</span>

                <div className="flex gap-4 ">
                    <Link href='https://github.com/jessedoka'>
                        <SiGithub className="w-4 h-4 fill-gray-400" />
                    </Link>

                    <Link href='https://www.linkedin.com/in/jesse-doka/'>
                        <SiLinkedin className="w-4 h-4 fill-gray-400" />
                    </Link>

                    <Link href='mailto:jdoka42@gmail.com'>
                        <SiGmail className="w-4 h-4 first:fill-gray-400" />
                    </Link>
                </div>

            </footer>
        </div>
    )
}