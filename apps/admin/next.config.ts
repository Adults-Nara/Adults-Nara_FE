import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // 썸네일 테스트용
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
