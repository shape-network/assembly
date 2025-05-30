import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty');
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: '*' }, // only way to render images from any domain
    ],
  },
};

export default nextConfig;
