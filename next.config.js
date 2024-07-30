const MillionLint = require('@million/lint');
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    reactStrictMode: true,
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            use: ['raw-loader', 'glslify-loader'],
        });

        return config;
    }
};
module.exports = nextConfig;