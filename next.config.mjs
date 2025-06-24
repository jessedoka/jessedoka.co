import MillionLint from "@million/lint";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**',                         
      },
      {
        protocol: 'https',
        hostname: 'img.jessedoka.co',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
};

export default MillionLint.next({ rsc: true })(nextConfig);
