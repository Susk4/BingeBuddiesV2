import type { NextConfig } from "next";

const normalizeProxyTarget = (raw: string): string => {
  return raw.replace(/\/$/, "");
};

/** External Hono process (local `pnpm dev:api`). Omit on Vercel for in-project `/api/hono`. */
const resolveExternalApiProxy = (): string | null => {
  const explicit = process.env.API_PROXY_TARGET?.trim();
  if (explicit === "" || explicit === "same-origin") {
    return null;
  }
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
  bundlePagesRouterDependencies: false,
  outputFileTracingIncludes: {
    "/api/hono/[[...path]]": [
      "../backend/drizzle/**/*",
      "../backend/dist/**/*",
    ],
  },
  serverExternalPackages: [
    "@binge-buddies/backend",
    "@libsql/client",
    "@libsql/client/http",
    "@libsql/hrana-client",
    "@libsql/core",
    "libsql",
    "drizzle-orm",
    "google-auth-library",
    "jsonwebtoken",
  ],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.extensionAlias = {
        ".js": [".ts", ".tsx", ".js"],
        ".jsx": [".tsx", ".jsx"],
      };

      const libsqlExternal = (
        { request }: { request?: string },
        callback: (err?: Error | null, result?: string) => void,
      ) => {
        if (
          request &&
          (request.startsWith("@libsql/") ||
            request === "libsql" ||
            request.startsWith("drizzle-orm"))
        ) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      };

      if (Array.isArray(config.externals)) {
        config.externals.push(libsqlExternal);
      } else if (typeof config.externals === "function") {
        const previous = config.externals;
        config.externals = (
          data: { request?: string },
          callback: (err?: Error | null, result?: string) => void,
        ) => {
          libsqlExternal(data, (err, result) => {
            if (result) {
              return callback(err, result);
            }
            return previous(data, callback);
          });
        };
      } else {
        config.externals = [libsqlExternal];
      }
    }
    return config;
  },

  async rewrites() {
    const proxy = resolveExternalApiProxy();
    if (proxy) {
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
    }

    return {
      afterFiles: [
        {
          source: "/auth/:path*",
          destination: "/api/hono/auth/:path*",
        },
        {
          source: "/api/:path*",
          destination: "/api/hono/api/:path*",
        },
        {
          source: "/health",
          destination: "/api/hono/health",
        },
      ],
    };
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
