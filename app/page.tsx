import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from '@/components/ArrowIcon';
import Background  from "@/components/background";

const paths = [
    {
        title: "SWE",
        link: "/dev",
        description: "My journey as a Software Developer and Programmer.",
    },
    {
        title: "Photography",
        link: "/photography",
        description: "Whether it's traveling or capturing the moment, my photography reveals the beauty in every scene.",
    },
]

const store = [
    {
        title: "Wallpapers",
        link: "/wallpapers",
        description: "Download my wallpapers for Phone and Desktop.",
    },
]

export default function Page() {

    return (
        <div>
            <Image src="/icon.svg" alt="icon" width={120} height={120} />

            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Jesse Doka
            </h1>

            <div className="flex flex-col space-y-2">
                <h3 className=" text-neutral-400">Paths</h3>
                <div className="flex gap-4 justify-between relative">
                    {paths.map((path) => (
                        <div
                            key={path.title}
                            className="flex-grow flex-shrink-0 rounded border border-neutral-800 hover:bg-neutral-900 p-4 duration-500 transition-all cursor-pointer w-8"
                        >
                            <div className="flex flex-row space-x-2 items-center">
                                <Link
                                    href={path.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center space-x-2"
                                >
                                    {/* <SiGithub className="w-6 h-6" /> */}
                                    <p className="text font-medium">
                                        {path.title}
                                    </p>
                                </Link>
                                <div className="hover:animate-bounce">
                                    <ArrowIcon />
                                </div>
                            </div>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                {path.description}
                            </p>
                        </div>
                    ))}
                </div>

                <h3 className="text-neutral-400 mb-4">Store</h3>
                <div className="flex gap-4 justify-between relative">
                    {store.map((store) => (
                        <div
                            key={store.title}
                            className="flex-grow flex-shrink-0 rounded border border-neutral-800 hover:bg-neutral-900 p-4 duration-500 transition-all cursor-pointer w-8"
                        >
                            <div className="flex flex-row space-x-2 items-center">
                                <Link
                                    href={store.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center space-x-2"
                                >
                                    {/* <SiGithub className="w-6 h-6" /> */}
                                    <p className="text font-medium">
                                        {store.title}
                                    </p>
                                </Link>
                                <div className="hover:animate-bounce">
                                    <ArrowIcon />
                                </div>
                            </div>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                {store.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}