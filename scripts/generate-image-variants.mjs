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

function createProgressBar(total, prefixLabel = "") {
    const barWidth = 28;
    return {
        update(current, taskLabel = "") {
            const pct = total ? Math.min(1, current / total) : 0;
            const filled = Math.round(barWidth * pct);
            const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);
            const pctStr = (pct * 100).toFixed(0).padStart(3);
            const task = taskLabel.length > 48 ? "…" + taskLabel.slice(-47) : taskLabel;
            const line = `\r ${prefixLabel}[${bar}] ${pctStr}% (${current}/${total}) ${task}`;
            process.stdout.write(line.padEnd(process.stdout.columns || 80));
        },
        done() {
            process.stdout.write("\n");
        },
    };
}

async function ensureVariants(key) {
    // Skip if this key is already a variant
    if (/-w\d+\.(webp|avif)$/.test(key)) return;
    // Skip placeholder files like .gitkeep
    if (key.endsWith(".gitkeep")) return;
    // Skip files that are already in a variants folder
    if (key.includes("/variants/")) return;
    // Only process image files (jpg, jpeg, png, etc.)
    if (!/\.(jpe?g|png|gif|webp)$/i.test(key)) return;
    // Parse the key to extract directory and filename
    const keyParts = key.split("/");
    const filename = keyParts.pop();
    if (keyParts.length === 0) return;

    const directory = keyParts.join("/");
    const variantDir = `${directory}/variants`;
    const baseFilename = filename.replace(/\.[^.]+$/, "");

    // Download original image
    const origObj = await s3.send(new GetObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: key }));
    const origBuf = await origObj.Body.transformToByteArray();

    await Promise.all(
        WIDTHS.flatMap((width) =>
            FORMATS.map(async ({ ext: fmt, opts }) => {
                const outKey = `${variantDir}/${baseFilename}-w${width}.${fmt}`;
                try {
                    await s3.send(new HeadObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: outKey }));
                    return;
                } catch { }
                const buffer = await sharp(origBuf).resize({ width }).toFormat(fmt, opts).toBuffer();
                await s3.send(new PutObjectCommand({
                    Bucket: serverEnv.R2_BUCKET,
                    Key: outKey,
                    Body: buffer,
                    ContentType: `image/${fmt}`,
                    CacheControl: "public, max-age=31536000, immutable",
                }));
            })
        )
    );

}

const prefix = process.argv[2] || "assets/";

console.log(`Generating variants for prefix: ${prefix}`);
const keys = [];
for await (const key of listObjects(serverEnv.R2_BUCKET, prefix)) {
    keys.push(key);
}

const total = keys.length;
if (total === 0) {
    console.log(`No objects found under prefix: ${prefix}`);
    process.exit(0);
}

const bar = createProgressBar(total, "Variants ");
let current = 0;
for (const key of keys) {
    bar.update(current, key);
    await ensureVariants(key);
    current += 1;
}
bar.update(current, "Done");
bar.done();
console.log("All missing variants now exist in R2");
