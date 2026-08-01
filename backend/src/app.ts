import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "./config.js";
import type { AppDatabase } from "./db/index.js";
import { createApiRoutes, createAuthRoutes } from "./routes/index.js";
import { createTmdbRoutes } from "./routes/tmdb.js";

export const createApp = (db: AppDatabase) => {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );

  app.get("/health", (c) => c.json({ ok: true }));

  app.route("/auth", createAuthRoutes(db));
  app.route("/api", createApiRoutes(db));
  app.route("/api/tmdb", createTmdbRoutes(db));

  return app;
};
