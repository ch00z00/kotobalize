import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kotobalize.s3.ap-northeast-1.amazonaws.com',
        port: '',
        pathname: '/avatars/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // TODO:一時的な対処
  },
};

export default nextConfig;
