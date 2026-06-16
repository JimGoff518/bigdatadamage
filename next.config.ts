import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube video thumbnails for VideoEmbed facades.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
  async redirects() {
    return [
      // Consolidated the older water-usage explainer into the 2026 projections
      // piece. 308 preserves inbound links and search equity from the old URL.
      {
        source: "/articles/how-much-water-do-data-centers-use",
        destination: "/articles/data-center-water-cooling-projections-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
