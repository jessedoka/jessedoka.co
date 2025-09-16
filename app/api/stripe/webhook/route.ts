import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";
import { Resend } from "resend";
import { serverEnv, publicEnv } from "@/lib/env.mjs";
import { nanoid } from "nanoid";

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });
const resend = new Resend(serverEnv.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: "No signature" }, { status: 400 });
        }

        
        let event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                serverEnv.STRIPE_WEBHOOK_SECRET
            );
        } catch (err: any) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            
            
            const slug = session.metadata?.slug;
            if (!slug) {
                return NextResponse.json({ error: "No slug" }, { status: 400 });
            }

            const admin = supabaseAdmin();

            
            const { data: pack } = await admin
                .from("packs")
                .select("id, title, r2_prefix, version")
                .eq("slug", slug)
                .single();

            if (!pack) {
                return NextResponse.json({ error: "Pack not found" }, { status: 404 });
            }

            
            const { data: order } = await admin
                .from("orders")
                .insert({
                    pack_id: pack.id,
                    email: session.customer_email!,
                    stripe_session_id: session.id,
                    amount: session.amount_total!,
                    currency: session.currency!,
                    status: "paid",
                })
                .select()
                .single();

            
            const downloadToken = nanoid(32);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); 

            
            await admin.from("downloads").insert({
                order_id: order.id,
                path: `${pack.r2_prefix}/dummy.zip`,
                token: downloadToken,
                expires_at: expiresAt.toISOString(),
                remaining: 5, 
            });

            
            const downloadUrl = `${publicEnv.NEXT_PUBLIC_SITE_URL}/download/${downloadToken}`;
            
            await resend.emails.send({
                from: "Jesse Doka <noreply@jessedoka.co>",
                to: [session.customer_email!],
                subject: `Your ${pack.title} download is ready!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333;">Thank you for your purchase!</h1>
                        <p>Your <strong>${pack.title}</strong> pack is ready for download.</p>
                        
                        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h2 style="margin-top: 0;">Download Instructions:</h2>
                            <p>Click the button below to download your pack:</p>
                            <a href="${downloadUrl}" 
                               style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 10px 0;">
                                Download ${pack.title}
                            </a>
                        </div>
                        
                        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #856404;">Important:</h3>
                            <ul style="color: #856404;">
                                <li>This download link expires in 7 days</li>
                                <li>You have 5 download attempts</li>
                                <li>Keep this email safe - you won't be able to download again without it</li>
                            </ul>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">
                            If you have any questions, please reply to this email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px;">
                            Jesse Doka Photography<br>
                            <a href="${publicEnv.NEXT_PUBLIC_SITE_URL}">${publicEnv.NEXT_PUBLIC_SITE_URL}</a>
                        </p>
                    </div>
                `,
            });
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}