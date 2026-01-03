import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',      // This is the key setting
  images: {
    unoptimized: true,   // Required if using next/image with static export
  },
};

export default nextConfig;
