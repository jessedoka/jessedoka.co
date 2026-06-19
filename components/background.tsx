"use client";
import { useEffect, useRef } from "react";
import type GlslCanvas from "glslCanvas";

const ZOOM_DEFAULT = 1.0;
const ZOOM_MIN = 1.0;
const ZOOM_MAX = 8.0;
const ZOOM_SPEED = 0.001;

export default function Background({width, height}: {width: number, height: number}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sandboxRef = useRef<GlslCanvas | null>(null);
    const zoomRef = useRef(ZOOM_DEFAULT);

    useEffect(() => {
        if (!canvasRef.current) return;

        let cancelled = false;

        (async () => {
            const { default: GlslCanvas } = await import("glslCanvas");
            if (cancelled) return;
            sandboxRef.current = new GlslCanvas(canvasRef.current!);
            sandboxRef.current.setUniform("u_zoom", zoomRef.current);
        })();

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            zoomRef.current = Math.min(
                ZOOM_MAX,
                Math.max(ZOOM_MIN, zoomRef.current + e.deltaY * ZOOM_SPEED)
            );
            sandboxRef.current?.setUniform("u_zoom", zoomRef.current);
        };

        const canvas = canvasRef.current;
        canvas.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            cancelled = true;
            canvas.removeEventListener("wheel", onWheel);
            sandboxRef.current?.destroy();
            sandboxRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full max-h-[12rem] overflow-hidden">
            <canvas
                className="w-full"
                data-fragment-url="worm.frag"
                width={width}
                height={height}
                ref={canvasRef}
            ></canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[10%] via-transparent via-[30%] to-white dark:to-[#111010] pointer-events-none" />
        </div>
    )
}
