import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // 모든 외부 이미지 허용 (개발 편의성)
  },
};

export default nextConfig;
