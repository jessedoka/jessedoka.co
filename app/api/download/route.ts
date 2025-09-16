import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getR2SignedUrl } from "@/lib/r2";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const token = formData.get("token") as string;

        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 400 });
        }

        const supabase = createSupabaseServer();

        const { data: download, error: downloadError } = await supabase
            .from("downloads")
            .select(`
                *,
                orders!inner(
                    *,
                    packs!inner(title, slug)
                )
            `)
            .eq("token", token)
            .single();

        if (downloadError || !download) {
            return NextResponse.json({ error: "Invalid download token" }, { status: 404 });
        }

        const now = new Date();
        const expiresAt = new Date(download.expires_at);
        
        if (now > expiresAt) {
            return NextResponse.json({ error: "Download link has expired" }, { status: 410 });
        }

        if (download.remaining <= 0) {
            return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
        }

        const { error: updateError } = await supabase
            .from("downloads")
            .update({ remaining: download.remaining - 1 })
            .eq("id", download.id);


        try {
            const signedUrl = await getR2SignedUrl(download.path);
            
            return NextResponse.json({ downloadUrl: signedUrl });
        } catch (r2Error) {
            return NextResponse.json({ error: "Failed to generate download link" + r2Error }, { status: 500 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message + error }, { status: 500 });
    }
}
