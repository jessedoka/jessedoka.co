/**
 * Set required env vars before any test imports (lib/env.mjs validates at import time).
 */
process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.example.com';
process.env.SITE_URL = process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
process.env.R2_ENDPOINT = process.env.R2_ENDPOINT ?? 'https://fake-r2.example.com';
process.env.R2_DOMAIN = process.env.R2_DOMAIN ?? 'https://fake-r2.example.com';
process.env.R2_BUCKET = process.env.R2_BUCKET ?? 'test-bucket';
process.env.R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? 'test-key';
process.env.R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? 'test-secret';

import '@testing-library/jest-dom/vitest';
