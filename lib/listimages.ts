import { serverEnv } from './env.mjs';
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
                Bucket: serverEnv.R2_BUCKET!,
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


export async function getOptimizedImageUrls(basePath: string, userAgent?: string) {
    const keys = await listImages(basePath);
    
    const isMobile = userAgent ? /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) : false;

    const urls = await Promise.all(
        keys.map(async (key) => {
            const { dir, name } = path.parse(key);
            
            // Define variants in order of preference based on device type
            const variants = isMobile 
                ? [
                    `${dir}/${name}-w320.webp`,   // Small mobile first
                    `${dir}/${name}-w640.webp`,   // Medium mobile
                    `${dir}/${name}-w1280.webp`,  // Large mobile
                ]
                : [
                    `${dir}/${name}-w1280.webp`,  // High quality desktop first
                    `${dir}/${name}-w640.webp`,   // Medium desktop
                    `${dir}/${name}-w320.webp`,   // Small desktop
                ];

            for (const variantKey of variants) {
                try {
                    const variantUrl = await getSignedUrl(
                        r2, 
                        new GetObjectCommand({ Bucket: serverEnv.R2_BUCKET!, Key: variantKey }), 
                        { expiresIn: 3600 }
                    );
                    return { url: variantUrl, fallback: null };
                } catch (error) {
                    // Continue to next variant
                    continue;
                }
            }

            // If no variants exist, fall back to original
            try {
                const fallbackUrl = await getSignedUrl(
                    r2, 
                    new GetObjectCommand({ Bucket: serverEnv.R2_BUCKET!, Key: key }), 
                    { expiresIn: 3600 }
                );
                return { url: fallbackUrl, fallback: true };
            } catch (error) {
                throw new Error(`Failed to load image: ${key}`);
            }
        })
    );

    return urls;
}
