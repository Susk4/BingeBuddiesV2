import type { IncomingMessage, ServerResponse } from "node:http";
import { handle } from "@hono/node-server/vercel";
import { getApp } from "../src/getApp.js";

const appPromise = getApp();

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  const app = await appPromise;
  const honoHandler = handle(app);
  return honoHandler(req, res);
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
