/**
 * Build-time packager (runs locally / CI with Bun — Hostinger itself never needs Bun).
 * Produces deploy/hostinger/dist/:
 *   server.mjs     single-file Node bundle (all deps inlined)
 *   public/        built SPA (vite build output)
 *   package.json   `npm start` → node server.mjs, zero dependencies
 *   sql/           MariaDB schema migrations to import via phpMyAdmin
 * and deploy/hostinger/superlink-hostinger.zip ready to upload.
 */
import { $ } from "bun";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..", "..");
const out = join(import.meta.dir, "dist");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const res = await Bun.build({
  entrypoints: [join(import.meta.dir, "server.ts")],
  target: "node",
  format: "esm",
  outdir: out,
  naming: "server.mjs",
  minify: true,
  sourcemap: "none",
});
if (!res.success) {
  for (const l of res.logs) console.error(l);
  process.exit(1);
}

cpSync(join(root, "dist"), join(out, "public"), { recursive: true });
// sql/0000_*.sql = schema (import first), sql/seed/*.sql = SAMPLE catalogue data (optional, import second)
if (existsSync(join(root, "drizzle-mariadb"))) cpSync(join(root, "drizzle-mariadb"), join(out, "sql"), { recursive: true });
rmSync(join(out, "sql", "meta"), { recursive: true, force: true });
const guide = join(root, "..", "..", "docs", "HOSTINGER_DEPLOYMENT.md");
if (existsSync(guide)) cpSync(guide, join(out, "README_DEPLOY.md"));
const seedDir = join(import.meta.dir, "seed");
if (existsSync(seedDir)) cpSync(seedDir, join(out, "sql", "seed"), { recursive: true });

writeFileSync(
  join(out, "package.json"),
  JSON.stringify(
    {
      name: "superlink-commerce",
      private: true,
      type: "module",
      main: "server.mjs",
      engines: { node: ">=18.18 <25" },
      scripts: { start: "node server.mjs" },
    },
    null,
    2,
  ),
);

await $`cd ${out} && rm -f ../superlink-hostinger.zip && zip -qr ../superlink-hostinger.zip .`;
console.log("Hostinger bundle ready:", out);
