import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
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
        protocol: 'http',
        hostname: 'k.kakaocdn.net', // 카카오 프로필
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
