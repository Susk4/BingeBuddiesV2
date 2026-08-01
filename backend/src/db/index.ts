import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalFileClient } from "./libsqlLocal.js";
import { createRemoteClient } from "./libsqlRemote.js";
import * as schema from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Local path or `file:` / `libsql:` URL for @libsql/client. */
export const toLibsqlUrl = (databaseUrl: string): string => {
  if (/^(file:|libsql:|https?:)/i.test(databaseUrl)) {
    return databaseUrl;
  }
  return `file:${path.resolve(databaseUrl)}`;
};

const resolveMigrationsFolder = (): string | null => {
  const candidates = [
    path.join(__dirname, "../../drizzle"),
    path.join(process.cwd(), "backend/drizzle"),
    path.join(process.cwd(), "../backend/drizzle"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
};

export const createDb = async (
  databaseUrl: string,
  libsqlAuthToken: string,
) => {
  const url = toLibsqlUrl(databaseUrl);

  if (/^file:/i.test(url)) {
    const filePath = url.replace(/^file:/i, "");
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const client = /^file:/i.test(url)
    ? createLocalFileClient(url)
    : createRemoteClient(url, libsqlAuthToken);

  const db = drizzle(client, { schema });

  if (/^file:/i.test(url)) {
    await client.execute("PRAGMA journal_mode = WAL");
    await client.execute("PRAGMA foreign_keys = ON");
    await client.execute("PRAGMA busy_timeout = 60000");
  }

  await runMigrations(db);

  return db;
};

const runMigrations = async (db: LibSQLDatabase<typeof schema>) => {
  const migrationsFolder = resolveMigrationsFolder();
  if (migrationsFolder) {
    await migrate(db, { migrationsFolder });
  }
};

export type AppDatabase = Awaited<ReturnType<typeof createDb>>;
