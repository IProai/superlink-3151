# Hostinger Deployment: SuperLink Commerce 2027

**Status:** I simulated this deployment locally. **Nobody has deployed to the real Hostinger account (u997446728) yet.** Every step marked *Verify in account* still needs evidence from the real account, as `07_HOSTINGER_ARCHITECTURE` requires.

## 1. Platform facts this design relies on

These come from Hostinger's own support docs, checked on 18 Nov 2026:

| Fact | Source | Design consequence |
|---|---|---|
| Business Web Hosting supports Node.js web apps | "How to add a Node.js web app in Hostinger" | Node.js was chosen over the doc-07 Laravel/PHP option (see `CHECKPOINT_01.md` §2) |
| Supported Node versions are 18.x, 20.x, 22.x and 24.x | same | Bundle is built for `>=18.18 <25` and tested on 18, 20, 22 and 24 |
| Code can come from a GitHub/GitLab repo or an uploaded archive (.zip/.tar.gz) | same | Recommended method: upload the prebuilt zip |
| Framework preset **Other** offers an optional build command and an **Entry file** | same | Entry file `server.mjs`, no build step |
| Bun is not available; only npm, yarn or pnpm | "Node.js limits for web and cloud plans" | Bun runs only at build time on our side. The uploaded bundle is plain Node |
| Requests time out after **120 s** | same | All long work (imports, sync, reconciliation) goes into cron batches |
| No permanent background workers, no inbound WebSockets, no custom ports, no Redis or Docker | same | DB-backed job table plus cron. The server listens only on `PORT` |
| Process limit is 120 NPROC and 60 entry processes, shared by every site on the plan | same | DB pool defaults to 5 connections. `www` and the apex domain each run their own process |
| Files under `hbuilds/` and `public_html/` are overwritten on every deploy | "How to add a Node.js web app" | Uploads, logs and secrets never live inside the build folder. Configuration goes in env vars |
| Each deploy is a new build folder; the last 2 successful builds are kept and a failed deploy leaves the live version in place | same | You can roll back by redeploying the previous zip |

## 2. What is in the bundle

`bun run build:hostinger` (run from `packages/web`, on your machine or in CI) produces `deploy/hostinger/superlink-hostinger.zip`, about 5 MB:

```
server.mjs                    single-file Node server, all dependencies inlined (~1 MB)
package.json                  zero dependencies; "start": "node server.mjs"; engines node >=18.18 <25
public/                       built storefront (Vite output, hashed assets, hero video + poster, images)
sql/0000_unusual_patch.sql    MariaDB schema (15 tables) — import FIRST
sql/seed/seed-sample-data.sql SAMPLE catalogue (1 tenant, 8 categories, 18 brands, 18 products) — optional, import SECOND
```

`server.mjs` handles all of the following:

- **Routing:** it serves `/api/*` (oRPC plus `/api/health` and `/api/health/db`) and the static files. Unknown `/api/*` paths get a JSON 404. Any other path falls back to `index.html` so SPA routes work.
- **Caching:** hashed `/assets/*` are cached as immutable for 1 year, media for 7 days, and HTML is not cached.
- **Headers:** it gzips text responses and sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy`.

## 3. First deployment, step by step

1. **Create the database** in hPanel under Databases → MySQL Databases. Give the database user only the privileges it needs on this one database. Write down the host (normally `localhost`), database name, user and password.
2. **Import the schema** in phpMyAdmin: select the database, open Import, choose `sql/0000_unusual_patch.sql`, use charset `utf8mb4`, then Go.
3. **(Optional) Import the sample data** the same way with `sql/seed/seed-sample-data.sql`.
   - Every product in this file is marked `is_sample=1`. **The prices, stock and SKUs are fictional.**
   - Don't import it into a production database that will hold real data.
4. **Create the web app:** Websites → Create site → Web App, then choose the domain.
   - Code source: **Upload your files**, then select `superlink-hostinger.zip`.
   - Framework preset: **Other** (or Hono, if it's offered).
   - Node version: **22.x** (20.x also works; 18.x is end-of-life upstream).
   - Build command: **None**. Entry file: **`server.mjs`**. Package manager: npm. Nothing gets installed.
5. **Set the environment variables** (section 4), then click **Deploy**.
6. **Run the smoke test:**
   - `https://<domain>/api/health` should return `{"status":"ok"}`.
   - `https://<domain>/api/health/db` should return `{"ok":true,"engine":"…MariaDB…"}`.
   - Open `/`, `/rfq` and switch to العربية.
   - Search for `toner` and for `دباسة`.

## 4. Environment variables

Set these in Hostinger under the Node.js dashboard → Environment Variables. **They never go into the zip.**

| Variable | Required | Default | Notes |
|---|---|---|---|
| `MARIADB_URL` | yes | none | `mysql://USER:PASSWORD@localhost:3306/DBNAME`. URL-encode special characters in the password (`@` becomes `%40`, `#` becomes `%23`). If it's missing, the site still runs and `/api/health/db` reports `MARIADB_URL is not set` |
| `TENANT_SLUG` | no | `slst` | Which tenant this deployment serves (multi-tenant platform) |
| `MARIADB_POOL` | no | `5` | Connection pool size. Keep it small because of the shared process limit |
| `PORT` | set by Hostinger | `3000` | Don't hard-code it. Hostinger doesn't allow custom ports |
| `PUBLIC_DIR` | no | `./public` | Only set this if static files are relocated |

These will be added in later stages and are not used yet: `SESSION_SECRET`, `CRON_TOKEN`, payment and shipping keys, SMTP settings.

## 5. Updating and rolling back

- **Update:** rebuild, upload the new zip and deploy. A failed deploy leaves the current version live.
- **Rollback:** redeploy the previous zip; keep the last 3 release zips with their checksums. Hostinger itself keeps the last two successful builds.
- **Schema changes:**
  - Each release ships with forward-only SQL files `sql/000N_*.sql`. Import the new ones in phpMyAdmin **before** deploying the code that needs them.
  - Migrations must be additive, i.e. backwards-compatible for one release, so that a code rollback doesn't need a DB rollback.

**Alternative: GitHub deploy.** This is possible, but Hostinger would run `npm install` plus a build. The repo is a Bun/Turborepo monorepo, and Bun is unavailable on Hostinger. To use GitHub, add a CI step (GitHub Actions) that runs `build:hostinger` and pushes the `dist/` contents to a `deploy` branch, then point Hostinger at that branch with Build command None and Entry file `server.mjs`. This hasn't been set up yet.

## 6. Background jobs (plan; not implemented yet)

- **Jobs live in the DB:** a `jobs` table with `status`, `attempts`, `run_after`, `locked_until` and `last_error`, plus a dead-letter state.
- **Hostinger cron calls the app over HTTPS:** `wget -qO- "https://<domain>/api/cron/tick?token=$CRON_TOKEN"` every 5 minutes, or whatever granularity the account allows (*Verify in account*).
- **Each tick stays well under the 120 s limit:** it claims a bounded batch, finishes in under 60 s, is idempotent and returns a summary.
- **Jobs planned this way:** catalogue import validation, stock and price sync, quote-expiry sweep, webhook retries, channel reconciliation, email outbox.
- **Payment webhooks** are verified by signature and deduplicated by provider event id (unique key) so that **AT-05** holds.

## 7. Backups and restore

- Hostinger takes daily backups (USA, Arizona). *Verify in account* that they include the databases, how long they're kept, and how a restore works.
- **Before launch:** do a restore drill into a scratch database and record the time taken and any data loss window. This is the recovery proof `01_MASTER_BLUEPRINT` requires.
- **Before risky releases:** run a manual phpMyAdmin export.
- **Data residency:** the servers and backups are in the USA. UAE personal-data handling needs review by counsel (doc 07, Compliance).

## 8. Performance notes for production

- **Fonts:** they currently load from Google Fonts. Before launch, self-host them in `public/fonts`, with Arabic and Latin subsets and `font-display: swap`, to cut a third-party round trip from the LCP path.
- **CDN:** turn on the Hostinger CDN for `/assets/*`, `/videos/*` and `/images/*`. Those are already sent with long-lived cache headers.
- **Hero video:** the source chosen depends on screen size (1080p WebM on desktop, 540p MP4 on mobile). It plays only while visible, and users with reduced motion get the poster only.
- **JS:** the main chunk is about 178 kB gzip; secondary routes are lazy-loaded.
- **Measure p75 vitals on the real domain.** All numbers so far are lab measurements on a dev server.

## 9. Verify in the actual account (open checklist)

Each item needs evidence such as a screenshot or log, per `07_HOSTINGER_ARCHITECTURE` → Deployment proof:

- [ ] Node.js Web App creation is available on account u997446728, and Node 22.x appears in the list
- [ ] Zip upload with preset Other, Build None and Entry `server.mjs` deploys and `/api/health` responds
- [ ] MariaDB: version, number of databases, size quota, `localhost` connectivity from the Node app
- [ ] phpMyAdmin imports the schema and seed (utf8mb4, Arabic stays intact)
- [ ] Cron: minimum interval, HTTPS `wget`/`curl` allowed, run log
- [ ] Outbound HTTPS from Node (needed for payment, shipping and channel APIs)
- [ ] Inbound signed webhook reaches `/api/*` (needs the payment provider decision)
- [ ] SSL on the apex and `www` domains; check process usage with both running
- [ ] Protected upload storage outside the build folder (persistent path for imports and documents)
- [ ] Backup → restore drill; rollback by redeploying the previous zip
- [ ] Concurrent load benchmark within 2 CPU / 3 GB / 120 NPROC

## 10. What I verified locally

- **Node versions:** I ran the bundle on Node 18.20.8, 20.20.2, 22.23.5 and 24.22.3 (and 26) against MariaDB 11.8.
- **Import path:** I imported schema and seed through the CLI into a **fresh** database, which is equivalent to phpMyAdmin's import, and then ran:
  - `system.health` → db ok
  - `catalog.search` with "toner" → `SL-TON-HP-85A`
  - `catalog.search` with "دباسة" → `SL-DSK-STP-HD`
  - the `/quick-order` SPA route → 200
  - gzip on assets and the security headers were present
- **No DB configured:** without `MARIADB_URL` the server still starts and reports the problem cleanly.
