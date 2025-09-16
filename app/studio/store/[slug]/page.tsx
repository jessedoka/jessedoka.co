import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import PackPage from "./packPage"; 



export default async function Page({ params }: { params: { slug: string } }) {
    const supabase = createSupabaseServer();
    const { data: pack } = await supabase
        .from("packs")
        .select("slug,title,description,cover_url,preview_urls,version,price")
        .eq("slug", params.slug)
        .eq("active", true)
        .maybeSingle();

    if (!pack) return notFound();

    return (
        <div className="flex flex-col space-y-4 max-w-5xl mx-auto">
            <PackPage pack={pack} />
        </div>
    );
}