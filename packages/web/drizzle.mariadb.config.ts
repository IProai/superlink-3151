import { defineConfig } from "drizzle-kit";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// drizzle-kit runs under node, so read MARIADB_URL from the single root .env if not already set.
if (!process.env.MARIADB_URL) {
  try {
    const env = readFileSync(resolve(process.cwd(), "../../.env"), "utf8");
    const m = env.match(/^MARIADB_URL=(.*)$/m);
    if (m) process.env.MARIADB_URL = m[1].trim();
  } catch {}
}

// MariaDB (primary DB, Hostinger). Separate from the template's drizzle.config.ts.
const u = new URL(process.env.MARIADB_URL ?? "mysql://localhost:3306/superlink");

export default defineConfig({
  dialect: "mysql",
  schema: "./src/api/data/schema.ts",
  out: "./drizzle-mariadb",
  dbCredentials: {
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
  },
});
