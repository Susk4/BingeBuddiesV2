import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRemoteClient } from "./libsqlRemote.js";
import * as schema from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const runMigrations = async (db: LibSQLDatabase<typeof schema>) => {
  const migrationsFolder = resolveMigrationsFolder();
  if (migrationsFolder) {
    await migrate(db, { migrationsFolder });
  }
};

/** Remote DB only — safe for Vercel / Next API bundle. */
export const createDb = async (
  databaseUrl: string,
  libsqlAuthToken: string,
) => {
  const url = toLibsqlUrl(databaseUrl);
  if (/^file:/i.test(url)) {
    throw new Error(
      "File DATABASE_URL is not supported in the Vercel entry; use Turso (libsql://) or run `pnpm dev:api` for local file SQLite.",
    );
  }

  const client = createRemoteClient(url, libsqlAuthToken);
  const db = drizzle(client, { schema });
  await runMigrations(db);
  return db;
};

export type AppDatabase = Awaited<ReturnType<typeof createDb>>;
