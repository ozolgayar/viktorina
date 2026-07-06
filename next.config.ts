import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Корректный root при нескольких lockfile в родительских папках
  outputFileTracingRoot: path.join(__dirname),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
