import type { NextConfig } from "next";

const normalizeProxyTarget = (raw: string): string => {
  return raw.replace(/\/$/, "");
};

/** Local dev: proxy to `pnpm dev:api`. Production: set `API_PROXY_TARGET` to your API deployment URL. */
const resolveExternalApiProxy = (): string | null => {
  const explicit = process.env.API_PROXY_TARGET?.trim();
  if (explicit) {
    return normalizeProxyTarget(explicit);
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://127.0.0.1:4000";
  }
  return null;
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@binge-buddies/shared"],

  async rewrites() {
    const proxy = resolveExternalApiProxy();
    if (!proxy) {
      return [];
    }

    return [
      {
        source: "/auth/:path*",
        destination: `${proxy}/auth/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${proxy}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${proxy}/health`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "www.gravatar.com" },
    ],
  },
};

export default nextConfig;
