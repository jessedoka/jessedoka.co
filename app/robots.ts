export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: 'process.env.SITE!/sitemap.xml',
    host: 'process.env.SITE!',
  };
}
