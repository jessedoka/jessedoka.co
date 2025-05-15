// lib/listImages.ts
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