/**
 * Hostinger Business Web Hosting entry point (Node.js 18–24, no Bun at runtime).
 *
 * Bundled by `bun run build:hostinger` into deploy/hostinger/dist/server.mjs, a single
 * self-contained file with every dependency inlined. The built SPA sits next to it in
 * dist/public/. Hostinger's Node.js app manager starts it with `node server.mjs` (or `npm start`)
 * and provides PORT.
 *
 * Serves:
 *  - /api/*  → the same Hono + oRPC app used in development (src/api)
 *  - static  → dist/public with long-lived caching for hashed assets
 *  - SPA     → every other GET falls back to index.html (client-side routing)
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { compress } from "hono/compress";
import api from "../../src/api";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = process.env.PUBLIC_DIR ?? join(here, "public");
const PORT = Number(process.env.PORT ?? 3000);
const indexHtml = readFileSync(join(PUBLIC_DIR, "index.html"), "utf8");

const app = new Hono();

app.use("*", compress());

// Security headers. CSP is kept permissive enough for Google Fonts until fonts are self-hosted.
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
});

app.route("/", api);

const cacheFor = (path: string) =>
  path.startsWith("/assets/")
    ? "public, max-age=31536000, immutable"
    : /\.(webm|mp4|webp|jpg|jpeg|png|svg|woff2|ico)$/.test(path)
      ? "public, max-age=604800"
      : "public, max-age=0, must-revalidate";

app.use(
  "*",
  serveStatic({
    root: PUBLIC_DIR,
    onFound: (path, c) => {
      c.header("Cache-Control", cacheFor(path.slice(PUBLIC_DIR.length)));
    },
  }),
);

// Unknown API paths must 404 as JSON, not return the SPA shell.
app.all("/api/*", (c) => c.json({ error: "not_found" }, 404));

app.get("*", (c) => {
  c.header("Cache-Control", "no-cache");
  return c.html(indexHtml);
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`SuperLink Commerce listening on :${info.port} (node ${process.version})`);
});
