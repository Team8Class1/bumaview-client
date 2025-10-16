import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
      {
        source: "/gemini-api/:path*",
        destination: `${process.env.NEXT_PUBLIC_GEMINI_API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
