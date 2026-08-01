import type { Client } from "@libsql/client";
import { createClient as createHttpClient } from "@libsql/client/http";

/** Turso / remote libsql over HTTP (bundled by Next.js API routes). */
export const createRemoteClient = (
  url: string,
  libsqlAuthToken: string,
): Client => {
  return createHttpClient({
    url,
    ...(libsqlAuthToken ? { authToken: libsqlAuthToken } : {}),
  });
};
