import { serverEnv } from "./env.mjs"
import { S3Client } from "@aws-sdk/client-s3"

export const r2 = new S3Client({
    region: "auto",
    endpoint: serverEnv.R2_ENDPOINT, 
    credentials: {
        accessKeyId: serverEnv.R2_ACCESS_KEY_ID!, 
        secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY!
    }
})