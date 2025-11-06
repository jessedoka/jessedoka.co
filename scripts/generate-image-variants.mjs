#!/usr/bin/env node
// Load environment variables
// You can run this script with: 
//   NODE_ENV=development node scripts/generate-image-variants.mjs
// Or source your .env.local file first

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Try to load .env.local if it exists (simple manual loader)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
} catch (e) {
    // .env.local doesn't exist or can't be read, that's okay
}

// Dynamic import after env vars are loaded
const { serverEnv } = await import("../lib/env.mjs");
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const WIDTHS = [320, 640, 1280, 1920];
const FORMATS = [
    { ext: "webp", opts: { quality: 80 } },
    { ext: "avif", opts: { quality: 60 } },
];

const s3 = new S3Client({
    region: "auto",
    endpoint: serverEnv.R2_ENDPOINT,
    credentials: {
        accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
        secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
    },
});

async function* listObjects(bucket, prefix = "") {
    let ContinuationToken;
    do {
        const { Contents, IsTruncated, NextContinuationToken } =
            await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken }));
        for (const obj of Contents ?? []) yield obj.Key;
        ContinuationToken = IsTruncated ? NextContinuationToken : undefined;
    } while (ContinuationToken);
}

async function ensureVariants(key) {
    // Skip if this key is already a variant
    if (/-w\d+\.(webp|avif)$/.test(key)) return;
    
    // Skip placeholder files like .gitkeep
    if (key.endsWith('.gitkeep')) return;
    
    // Skip files that are already in a variants folder
    if (key.includes('/variants/')) return;
    
    // Only process image files (jpg, jpeg, png, etc.)
    if (!/\.(jpe?g|png|gif|webp)$/i.test(key)) {
        console.log(`⏭️  skipping non-image: ${key}`);
        return;
    }

    // Parse the key to extract directory and filename
    const keyParts = key.split('/');
    const filename = keyParts.pop(); // e.g., "example.jpg"
    
    // If no directory (just filename), skip or handle differently
    if (keyParts.length === 0) {
        console.log(`⏭️  skipping root-level file: ${key}`);
        return;
    }
    
    const directory = keyParts.join('/'); // e.g., "assets/portfolio/landscapes/keswick"
    
    // Create variant folder name inside the directory
    // e.g., "assets/portfolio/landscapes/keswick" -> "assets/portfolio/landscapes/keswick/variants"
    const variantDir = `${directory}/variants`;
    
    // Get base filename without extension (e.g., "example" from "example.jpg")
    const baseFilename = filename.replace(/\.[^.]+$/, "");
    
    console.log(`Processing: ${key} -> variants in ${variantDir}/`);
    
    // Download original image
    const origObj = await s3.send(new GetObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: key }));
    const origBuf = await origObj.Body.transformToByteArray();

    await Promise.all(WIDTHS.flatMap(width =>
        FORMATS.map(async ({ ext: fmt, opts }) => {
            // Create variant key in the variants subfolder
            // e.g., "assets/portfolio/landscapes/keswick/variants/example-w320.webp"
            const outKey = `${variantDir}/${baseFilename}-w${width}.${fmt}`;
            
            // Skip if variant already exists
            try {
                await s3.send(new HeadObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: outKey }));
                console.log(`  ✓ exists: ${outKey}`);
                return; // exists → skip
            } catch { }

            const buffer = await sharp(origBuf).resize({ width }).toFormat(fmt, opts).toBuffer();
            await s3.send(new PutObjectCommand({
                Bucket: serverEnv.R2_BUCKET,
                Key: outKey,
                Body: buffer,
                ContentType: `image/${fmt}`,
                CacheControl: "public, max-age=31536000, immutable",
            }));
            console.log(`✔︎ uploaded: ${outKey}`);
        })
    ));
}

// Allow prefix to be passed as command line argument or use default
const prefix = process.argv[2] || "assets/";

console.log(`Generating variants for prefix: ${prefix}`);
for await (const key of listObjects(serverEnv.R2_BUCKET, prefix)) {
    await ensureVariants(key);
}
console.log("All missing variants now exist in R2");
