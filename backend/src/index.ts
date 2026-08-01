import { serve } from "@hono/node-server";
import { config } from "./config.js";
import { createDb } from "./db/index.js";
import { createApp } from "./app.js";

const db = await createDb(config.databaseUrl, config.libsqlAuthToken);
const app = createApp(db);

serve({ fetch: app.fetch, port: config.port }, (info) => {
  console.log(`Binge Buddies API (Hono) http://localhost:${info.port}`);
});
