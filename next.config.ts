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
      // The standalone /water-impact page was folded into /locations. 308 keeps
      // any inbound links and search equity pointed at the live content.
      {
        source: "/water-impact",
        destination: "/locations",
        permanent: true,
      },
    ];
  },
  // Baseline security headers (GEO audit 2026-06-25 — was HSTS-only).
  // CSP allows inline styles/scripts because Next.js injects inline runtime;
  // tighten to nonces later if desired. HSTS omits `preload` deliberately —
  // do not preload until every subdomain is HTTPS.
  //
  // The map (MapLibre GL + CARTO Positron basemap) needs three allowances:
  //   - connect-src: fetch the CARTO basemap style/tiles/glyphs/sprite (our own
  //     water GeoJSON is same-origin, covered by 'self').
  //   - worker-src blob:: MapLibre spins up web workers from blob: URLs.
  //   - 'unsafe-eval' in DEV only: React's dev-mode debugging uses eval(); it is
  //     never added in production (React doesn't use eval there).
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "worker-src 'self' blob:",
      "connect-src 'self' https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com https://*.cartocdn.com",
      "font-src 'self'",
      "frame-src https://www.youtube-nocookie.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
