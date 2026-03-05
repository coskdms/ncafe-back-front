import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // ★ /api/* 요청: Next.js API Routes(BFF)가 처리 → JWT 주입 → Spring Boot
  // ★ /images/* 요청: 이미지는 Spring Boot 정적 리소스를 직접 프록시
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/images/:path*', // BFF proxy(route.ts)를 통해 런타임 환경변수 적용
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
