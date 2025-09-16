"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function formatPrice(priceInPence: number): string {
    return `£${(priceInPence / 100).toFixed(2)}`;
}

export default function PackPage({ pack }: { pack: any }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    
    if (success) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-10">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-green-600">Payment Successful!</h1>
                    <p className="text-neutral-600 max-w-md mx-auto">
                        Thank you for your purchase! Your download link has been sent to your email address.
                        Check your inbox (and spam folder) for the download instructions.
                    </p>
                    <div className="pt-4">
                        <a 
                            href="/studio/store" 
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Back to Store
                        </a>
                    </div>
                </div>
            </main>
        );
    }
    
    if (canceled) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-10">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-yellow-600">Payment Canceled</h1>
                    <p className="text-neutral-600 max-w-md mx-auto">
                        Your payment was canceled. No charges have been made to your account.
                        You can try again anytime.
                    </p>
                    <div className="pt-4">
                        <button 
                            onClick={() => window.location.href = `/studio/store/${pack.slug}`}
                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }
    
    return (
        <section>
            <div className="flex flex-col md:flex-row gap-8 items-start mt-8">
                <div className="flex-1">
                    <Image
                        src={pack.cover_url}
                        alt={pack.title}
                        width={400}
                        height={400}
                        className="rounded-lg object-cover"
                    />
                    {/* Optionally, show preview images if available
                    {Array.isArray(pack.preview_urls) && pack.preview_urls.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {pack.preview_urls.map((url: string, i: number) => (
                                <Image
                                    key={i}
                                    src={url}
                                    alt={`Preview ${i + 1}`}
                                    width={400}
                                    height={250}
                                    className="rounded object-cover"
                                />
                            ))}
                        </div>
                    )} */}
                </div>
                <article className="flex-1 min-w-0 space-y-6">
                    <div className="space-y-3">
                        <h1 className="font-medium text-4xl tracking-tighter">
                            {pack.title}
                        </h1>
                        <span className="inline-block px-4 py-1 rounded-full bg-neutral-100 text-neutral-800 font-semibold text-sm shadow-sm border border-neutral-200">
                            {formatPrice(pack.price)}
                        </span>
                        <p className="prose prose-quoteless prose-neutral dark:prose-invert text-neutral-600">
                            {pack.description}
                        </p>
                    </div>

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setLoading(true);
                            const res = await fetch("/api/checkout", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ slug: pack.slug, email }),
                            });
                            const { url } = await res.json();
                            window.location.href = url;
                        }}
                        className="space-y-3"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded border px-3 py-2 text-black"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded bg-black text-white px-4 py-2 disabled:opacity-50"
                        >
                            {loading ? "Redirecting…" : `Buy`}
                        </button>
                    </form>
                </article>
            </div>
        </section>
    );
}