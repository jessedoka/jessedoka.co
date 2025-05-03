import Link from 'next/link';
import { SiGithub, SiLinkedin, SiGmail, SiBluesky } from "react-icons/si";

export default function Footer() {
    return (
        <div className="prose mb-7 max-w-none mx-auto px-4 lg:px-0">

            <footer className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-200">
                <span className='dark:text-neutral-200'>Jesse Doka</span>
                <div className="flex gap-4 ">
                    <Link href='https://bsky.app/profile/jessedoka.co'>
                        <SiBluesky className="w-4 h-4 fill-gray-400" />
                    </Link>
                    <Link href='https://github.com/jessedoka'>
                        <SiGithub className="w-4 h-4 fill-gray-400" />
                    </Link>

                    <Link href='https://www.linkedin.com/in/jesse-doka/'>
                        <SiLinkedin className="w-4 h-4 fill-gray-400" />
                    </Link>

                    <Link href='mailto:jcsscdoka@gmail.com'>
                        <SiGmail className="w-4 h-4 first:fill-gray-400" />
                    </Link>
                </div>

            </footer>
        </div>
    )
}