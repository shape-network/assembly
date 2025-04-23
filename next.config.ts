import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty');
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: 'oldschool.runescape.wiki',
      },
    ],
  },
};

export default nextConfig;
