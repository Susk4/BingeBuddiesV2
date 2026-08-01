import type { Hono } from "hono";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { createDb } from "./db/createDb.vercel.js";
let appPromise: Promise<Hono> | null = null;

/** Lazy singleton for local server and Vercel (migrations run on first use). */
export const getApp = (): Promise<Hono> => {
  if (!appPromise) {
    appPromise = (async () => {
      const db = await createDb(config.databaseUrl, config.libsqlAuthToken);
      return createApp(db);
    })();
  }
  return appPromise;
};
