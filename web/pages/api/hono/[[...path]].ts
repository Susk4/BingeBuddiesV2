import type { IncomingMessage, ServerResponse } from "node:http";
import type { NextApiRequest, NextApiResponse } from "next";
import { HONO_API_MOUNT } from "../../../src/lib/honoMount";

const stripMountPrefix = (req: IncomingMessage): void => {
  const raw = req.url ?? "/";
  const qIndex = raw.indexOf("?");
  const pathname = qIndex === -1 ? raw : raw.slice(0, qIndex);
  const search = qIndex === -1 ? "" : raw.slice(qIndex);

  if (!pathname.startsWith(HONO_API_MOUNT)) {
    return;
  }

  const rest = pathname.slice(HONO_API_MOUNT.length) || "/";
  req.url = `${rest}${search}`;
};

const appPromise = import("@binge-buddies/backend/vercel").then((m) =>
  m.getApp(),
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const app = await appPromise;
  stripMountPrefix(req);
  const { handle } = await import("@hono/node-server/vercel");
  const honoHandler = handle(app);
  return honoHandler(req, res as ServerResponse);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
