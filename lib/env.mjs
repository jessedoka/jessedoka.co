import { z } from "zod";

const RawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL, 

    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_DOMAIN: process.env.R2_DOMAIN, 
    R2_BUCKET: process.env.R2_BUCKET,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
};

const serverSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']),
    R2_ENDPOINT: z.string().url(),
    R2_DOMAIN: z.string().url(),
    R2_BUCKET: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
});

const clientSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});


const serverParsed = serverSchema.safeParse(RawEnv);
if (!serverParsed.success) {
    console.error('Invalid server env:', serverParsed.error.flatten().fieldErrors);
    throw new Error('Invalid server environment variables');
}

const clientParsed = clientSchema.safeParse(RawEnv);
if (!clientParsed.success) {
    console.error('Invalid client env:', clientParsed.error.flatten().fieldErrors);
    throw new Error('Invalid client environment variables');
}

export const serverEnv = serverParsed.data;   
export const publicEnv = clientParsed.data;   
export const env = { ...serverParsed.data, ...clientParsed.data }; 
