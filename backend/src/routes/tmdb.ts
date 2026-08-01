import { Hono } from "hono";
import type { AppDatabase } from "../db/index.js";
import { requireAuth, type AuthVariables } from "../middleware/auth.js";
import * as data from "../services/data.js";
import {
  discoverMovies,
  fetchMovieById,
  fetchMovieGenres,
  fetchMovieWatchProviders,
  fetchPopularMovies,
  searchMovies,
} from "../services/tmdbMovies.js";

type AuthEnv = { Variables: AuthVariables };

export const createTmdbRoutes = (db: AppDatabase) => {
  const app = new Hono<AuthEnv>();
  app.use("*", requireAuth);

  app.get("/genres", async (c) => {
    return c.json(await fetchMovieGenres());
  });

  app.get("/providers", async (c) => {
    return c.json(await fetchMovieWatchProviders());
  });

  app.get("/movies/discover", async (c) => {
    try {
      const uid = c.get("auth").uid;
      const page = Number(c.req.query("page") ?? "1");
      const profile = await data.getUserProfile(db, uid);
      const filters = profile?.filters ?? {};
      const excludeIds = await data.getUsersMovieIds(db, uid);
      return c.json(await discoverMovies(page, filters, excludeIds));
    } catch (error) {
      console.error("discover failed:", error);
      const message =
        error instanceof Error ? error.message : "Discover failed";
      return c.json({ error: message }, 502);
    }
  });

  app.get("/movies/popular", async (c) => {
    const page = Number(c.req.query("page") ?? "1");
    return c.json(await fetchPopularMovies(page));
  });

  app.get("/movies/search", async (c) => {
    const query = c.req.query("query") ?? "";
    const page = Number(c.req.query("page") ?? "1");
    if (!query.trim()) {
      return c.json(await fetchPopularMovies(page));
    }
    return c.json(await searchMovies(query.trim(), page));
  });

  app.get("/movies/:id", async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isFinite(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }
    return c.json(await fetchMovieById(id));
  });

  return app;
}
