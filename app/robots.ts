import { publicEnv } from "@/lib/env.mjs";

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${publicEnv.NEXT_PUBLIC_SITE_URL!}/sitemap.xml`,
    host: `${publicEnv.NEXT_PUBLIC_SITE_URL!}`,
  };
}
