import { ListObjectsV2Command, GetObjectCommand, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const WIDTHS = [320, 640, 1280, 1920];
export const FORMATS = [
    { ext: "webp", opts: { quality: 80 } },
    { ext: "avif", opts: { quality: 60 } },
];

export async function* listObjects(s3, bucket, prefix = "") {
    let ContinuationToken;
    do {
        const { Contents, IsTruncated, NextContinuationToken } =
            await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken }));
        for (const obj of Contents ?? []) yield obj.Key;
        ContinuationToken = IsTruncated ? NextContinuationToken : undefined;
    } while (ContinuationToken);
}

export async function ensureVariants(s3, bucket, key) {
    if (/-w\d+\.(webp|avif)$/.test(key)) return;
    if (key.endsWith(".gitkeep")) return;
    if (key.includes("/variants/")) return;
    if (!/\.(jpe?g|png|gif|webp)$/i.test(key)) return;

    const keyParts = key.split("/");
    const filename = keyParts.pop();
    if (keyParts.length === 0) return;

    const directory = keyParts.join("/");
    const variantDir = `${directory}/variants`;
    const baseFilename = filename.replace(/\.[^.]+$/, "");

    const origObj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const origBuf = await origObj.Body.transformToByteArray();

    await Promise.all(
        WIDTHS.flatMap((width) =>
            FORMATS.map(async ({ ext: fmt, opts }) => {
                const outKey = `${variantDir}/${baseFilename}-w${width}.${fmt}`;
                try {
                    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: outKey }));
                    return;
                } catch (err) {
                    if (err?.name !== "NotFound" && err?.$metadata?.httpStatusCode !== 404) throw err;
                }
                const buffer = await sharp(origBuf).resize({ width }).toFormat(fmt, opts).toBuffer();
                await s3.send(new PutObjectCommand({
                    Bucket: bucket,
                    Key: outKey,
                    Body: buffer,
                    ContentType: `image/${fmt}`,
                    CacheControl: "public, max-age=31536000, immutable",
                }));
            })
        )
    );
}
