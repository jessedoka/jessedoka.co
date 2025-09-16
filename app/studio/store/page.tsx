import { createSupabaseServer } from "@/lib/supabase/server";
import Image from "next/image";

// Helper function to format price from pence to pounds
function formatPrice(priceInPence: number): string {
    return `£${(priceInPence / 100).toFixed(2)}`;
}

export default async function Store() {
    const supabase = createSupabaseServer();

    const { data: packs } = await supabase.from("packs")
        .select("slug, title, cover_url, preview_urls, version, price")
        .eq("active", true)
        .order("created_at", { ascending: false });

    return (
        <section className="mx-auto max-w-4cl">
            <div className="flex flex-col space-y-4 text-center">
                <h1 className="font-medium text-4xl mb-8 tracking-tighter">My Store</h1>
            </div>

            {!packs?.length && (
                <p className="text-neutral-500">No packs yet. Check back soon.</p>
            )}

            <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
                {packs?.map((p) => (
                    <a
                        key={p.slug}
                        href={`/studio/store/${p.slug}`}
                        className="p-2 shadow hover:shadow-md transition"
                    >
                        <div className="relative">
                            <Image
                                src={p.cover_url}
                                alt={p.title}
                                width={500}
                                height={800}
                                sizes="(min-width: 768px) 50vw, 100vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105 mb-3 overflow-hidden rounded-md"
                                priority
                            />
                        </div>
                        <h3 className="text-xl font-semibold">{p.title}</h3>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-semibold text-green-600">
                                {formatPrice(p.price)}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
