#!/usr/bin/env node

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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
            if (!process.env[key]) process.env[key] = value;
        }
    });
} catch {
    // .env.local doesn't exist or can't be read, that's okay
}

const { serverEnv } = await import("../lib/env.mjs");
import { S3Client } from "@aws-sdk/client-s3";
import { listObjects, ensureVariants } from "../lib/image-variants.mjs";

const s3 = new S3Client({
    region: "auto",
    endpoint: serverEnv.R2_ENDPOINT,
    credentials: {
        accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
        secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
    },
});

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

const prefix = process.argv[2] || "assets/";

console.log(`Generating variants for prefix: ${prefix}`);
const keys = [];
for await (const key of listObjects(s3, serverEnv.R2_BUCKET, prefix)) {
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
    await ensureVariants(s3, serverEnv.R2_BUCKET, key);
    current += 1;
}
bar.update(current, "Done");
bar.done();
console.log("All missing variants now exist in R2");
