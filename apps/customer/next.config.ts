import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@farsamo/core"],
  serverExternalPackages: ["mongodb", "cloudinary"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
