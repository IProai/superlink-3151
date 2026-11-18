/**
 * MariaDB client — the primary database (Hostinger in production, local MariaDB in dev).
 * Uses mysql2 (pure JS, runs on both Bun and Node 18–24). Lazy so the app boots even
 * when MARIADB_URL is missing; callers get a clear error instead of a crash on import.
 */
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { env } from "./env";

let instance: MySql2Database<typeof schema> | null = null;
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) return pool;
  const url = env("MARIADB_URL");
  if (!url) throw new Error("MARIADB_URL is not set");
  pool = mysql.createPool({
    uri: url,
    // Hostinger Business: keep well under the 60 entry-process / per-user connection limits.
    connectionLimit: Number(env("MARIADB_POOL") ?? 5),
    waitForConnections: true,
    charset: "utf8mb4",
    timezone: "Z",
  });
  return pool;
}

export function mdb(): MySql2Database<typeof schema> {
  if (!instance) instance = drizzle(getPool(), { schema, mode: "default" });
  return instance;
}

/** Raw parameterised query (typed minimally so it compiles in every workspace package). */
export async function rawQuery<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const p = getPool() as unknown as { query(sql: string, params?: unknown[]): Promise<[unknown, unknown]> };
  const [rows] = await p.query(sql, params);
  return rows as T[];
}

export { schema };
