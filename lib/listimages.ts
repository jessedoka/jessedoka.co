// lib/listImages.ts
import path from 'node:path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2 } from "./r2";

export async function listImages(prefix: string): Promise<string[]> {
    const allKeys: string[] = [];
    let ContinuationToken: string | undefined;

    do {
        const response = await r2.send(
            new ListObjectsV2Command({
                Bucket: process.env.R2_BUCKET!,
                Prefix: prefix,
                ContinuationToken,
            })
        );

        const keys = (response.Contents || []).map(obj => obj.Key!).filter(Boolean);
        allKeys.push(...keys);

        ContinuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // 🔍 Filter to include only original JPG/PNG/etc, and exclude generated variants
    const isOriginalImage = (key: string) =>
        /\.(jpe?g|png)$/i.test(key) && !/-w\d+\.(webp|avif)$/i.test(key);

    const filtered = allKeys.filter(isOriginalImage);

    return filtered;
  }

export async function getSignedImageUrls(basePath: string, variantCallback?: (key: string) => string) {
    const keys = await listImages(basePath);

    const transform = variantCallback ?? ((key: string) => {
        const { dir, name } = path.parse(key);
        return `${dir}/${name}-w640.webp`;
    });
    const variantKeys = keys.map(transform);

    return Promise.all(
        variantKeys.map(key =>
            getSignedUrl(r2, new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }), { expiresIn: 3600 })
        )
    );
}
