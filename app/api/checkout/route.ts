import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { publicEnv, serverEnv } from "@/lib/env.mjs";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

export async function POST(req: Request) {
    const supabase = createSupabaseServer();

    try {
        const { slug, email } = await req.json();

        const { data: pack, error } = await supabase
            .from("packs")
            .select("stripe_price_id, slug, title")
            .eq("slug", slug)
            .eq("active", true)
            .single();

        if (error || !pack) {
            return NextResponse.json({ error: "Pack not found" }, { status: 404 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: email,         
            line_items: [{ price: pack.stripe_price_id, quantity: 1 }],
            allow_promotion_codes: true,
            success_url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/store/${slug}?success=1`,
            cancel_url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/store/${slug}?canceled=1`,
            metadata: { slug },
        });

        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message ?? "Checkout failed" }, { status: 500 });
    }
}
