import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product assets are already resized and compressed to WebP. Serving them
  // directly also keeps Vinext/Cloudflare previews and production consistent.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
