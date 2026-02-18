"use client";
import { useEffect, useRef } from "react";
import type GlslCanvas from "glslCanvas";

export default function Background({width, height}: {width: number, height: number}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sandboxRef = useRef<GlslCanvas | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let cancelled = false;

        (async () => {
            const { default: GlslCanvas } = await import("glslCanvas");
            if (cancelled) return;
            sandboxRef.current = new GlslCanvas(canvasRef.current!);
        })();

        return () => {
            cancelled = true;
            sandboxRef.current?.destroy();
            sandboxRef.current = null;
        };
    }, []);

    return (
        <div className="w-full max-h-[10rem] overflow-hidden">
            <canvas
                className="w-full"
                data-fragment-url="worm.frag"
                width={width}
                height={height}
                ref={canvasRef}
            ></canvas>
        </div>
    )
}
