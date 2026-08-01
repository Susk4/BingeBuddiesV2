import type { IncomingMessage, ServerResponse } from "node:http";
import { handle } from "@hono/node-server/vercel";
import type { Hono } from "hono";
import { getApp } from "../src/getApp.js";

let appPromise: Promise<Hono> | null = null;

const loadApp = (): Promise<Hono> => {
  if (!appPromise) {
    appPromise = getApp();
  }
  return appPromise;
};

const sendServiceUnavailable = (res: ServerResponse, err: unknown): void => {
  console.error("API failed to start (database or migrations):", err);
  res.statusCode = 503;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ ok: false, error: "database_unavailable" }));
};

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  let app: Hono;
  try {
    app = await loadApp();
  } catch (err) {
    sendServiceUnavailable(res, err);
    return;
  }
  const honoHandler = handle(app);
  return honoHandler(req, res);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
