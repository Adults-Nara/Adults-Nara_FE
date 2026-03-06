import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // 썸네일 테스트용
      },
      {
        protocol: 'https',
        hostname: 'stream.asinna.store', // 백엔드 미디어 서버 (썸네일, 영상 스트리밍 등)
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
