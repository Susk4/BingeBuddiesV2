import type { Client } from "@libsql/client";
import { createClient as createNodeClient } from "@libsql/client/node";

/** Local SQLite file — used only by `pnpm dev:api`, not imported from Next. */
export const createLocalFileClient = (url: string): Client => {
  return createNodeClient({ url });
};
