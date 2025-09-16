import { serverEnv } from "./env.mjs"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const r2 = new S3Client({
    region: "auto",
    endpoint: serverEnv.R2_ENDPOINT, 
    credentials: {
        accessKeyId: serverEnv.R2_ACCESS_KEY_ID!, 
        secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY!
    }
})

export async function getR2SignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: serverEnv.R2_BUCKET!,
        Key: key,
    });
    
    return await getSignedUrl(r2, command, { expiresIn });
}