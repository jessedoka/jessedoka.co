"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
// @ts-ignore
import shader from "@/public/worm.frag";

// const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function Background({width, height}: {width: number, height: number}) {
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [sandbox, setSandbox] = useState<any | null>(null);
    useEffect(() => {
        (async () => {
            if (canvas.current) {
                // also cannot be loaded via server side since it requires 'window'
                // @ts-ignore
                const { default: GlslCanvas } = await import("glslCanvas");
                const sandbox = new GlslCanvas(canvas.current);
                setSandbox(sandbox);
            }
        })();
    }, [canvas]);
    
    return (
        <div className="w-full max-h-[10rem] overflow-hidden">
            <canvas
                className="w-full"
                data-fragment-url="worm.frag"
                width={width}
                height={height}
                ref={canvas}
            ></canvas>
        </div>
    )
}
