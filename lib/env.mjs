import { z } from "zod";

const RawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL, // fallback


    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_DOMAIN: process.env.R2_DOMAIN, // public-ish host but still treat as server config
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
});

const clientSchema = z.object({
    NEXT_PUBLIC_SITE_URL: z.string().url(),
});

// Validate once, at import time
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

export const serverEnv = serverParsed.data;   // import ONLY in server code
export const publicEnv = clientParsed.data;   // safe for client code
export const env = { ...serverParsed.data, ...clientParsed.data }; // convenience
