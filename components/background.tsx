"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
// @ts-ignore
import shader from "@/public/worm.frag";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function Background() {
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
    const onSaveShader = useCallback(
        (content: string) => {
            sandbox?.load(content);
        },
        [sandbox]
    );
    return (
        <div className="flex place-items-start w-full">
            <canvas
                className="glsl-canvas m-6"
                data-fragment-url="worm.frag"
                width="800"
                height="600"
                ref={canvas}
            ></canvas>
            <Editor className="grow h-screen" code={shader} onSave={onSaveShader} />
        </div>
    )
}