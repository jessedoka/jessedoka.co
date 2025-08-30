import { serverEnv } from "../lib/env.mjs";
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
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

    const base = key.replace(/\.[^.]+$/, "");           // photo-1
    const ext = key.split(".").pop().toLowerCase();    // jpg / png …

    const origObj = await s3.send(new GetObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: key }));
    const origBuf = await origObj.Body.transformToByteArray();

    await Promise.all(WIDTHS.flatMap(width =>
        FORMATS.map(async ({ ext: fmt, opts }) => {
            const outKey = `${base}-w${width}.${fmt}`;
            // Skip if variant already exists
            try {
                await s3.send(new HeadObjectCommand({ Bucket: serverEnv.R2_BUCKET, Key: outKey }));
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
            console.log("✔︎ uploaded", outKey);
        })
    ));
}

for await (const key of listObjects(serverEnv.R2_BUCKET, "raw/")) {
    await ensureVariants(key);
}
console.log("All missing variants now exist in R2");
