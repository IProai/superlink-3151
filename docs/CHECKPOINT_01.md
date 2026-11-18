# Checkpoint 01: Documentation reconciliation, architecture and status

**Date:** 18 Nov 2026 · **Scope:** first execution checkpoint (homepage, design system, Hostinger portability proof)

**Sources reconciled:**
- Docs 01, 02, 03, 04, 07, 09 and 12 (`/Attachments`)
- SLST Company Profile PDF
- The hero start and end frames (two PNGs)
- The build brief

---

## 1. Reconciliation: where the sources disagree or leave gaps

| # | Finding | Sources | Resolution used | Needs owner? |
|---|---|---|---|---|
| R1 | **The doc set is incomplete.** It is numbered 01–12 but 05, 06, 08, 10 and 11 were not supplied. Those are probably data model, integrations, security, QA and operations | file names | I took those topics from 01/02/07 (NFRs, security and job rules). Nothing was invented beyond them | Supply the missing docs if they exist |
| R2 | **Stack choice.** Doc 07 proposes Laravel/PHP (A), React plus a Laravel API (B), or Next.js (C). It says the stack must be "not yet validated" and chosen "based on proof". Node runtime availability is listed under "verify". The brief requires Runable as the build environment and portability to Hostinger | 07, brief | I chose **React/Vite SPA + Hono API on plain Node.js + MariaDB**. It is a variant of option B with a Node API instead of Laravel. Hostinger documents Node.js web apps on Business plans (Node 18/20/22/24, Hono listed as a backend preset). It runs as a single prebuilt file, proven locally on all four Node versions. See `HOSTINGER_DEPLOYMENT.md` | **Yes.** Confirm Node.js Web App exists on account u997446728 before Stage 2 relies on it |
| R3 | **"Use the provided hero video."** Only a **start frame and an end frame** (PNG) were supplied, not a video | brief, attachments | I generated an 8 s interpolation between the two supplied frames, with no logo in the frame, and encoded it as 1080p WebM/MP4, 540p MP4 and a poster. It can be swapped one-for-one in `public/videos`. Doc 04's pipeline names Gemini stills and Flow; I used a different video model | Approve the clip, or supply the final licensed video |
| R4 | **The roadmap says no coding before the roundtable.** Doc 12 says "review … before authorizing coding". Doc 09's Phase 00/01 gates come before Foundation | 09, 12, brief | The brief explicitly authorizes a first checkpoint. That checkpoint is a **prototype plus infrastructure proof**: Phases 02–03 with parts of 05–06. It is not a release | Treat this checkpoint as roundtable input |
| R5 | **There is no real catalog** (doc 12 "unresolved"; Phase 01) | 01, 09, 12 | 18 products marked `is_sample=1`, flagged "SAMPLE"/"Sample SKUs" in the UI. Prices are labelled indicative. All product imagery is AI-generated and not verified | **Yes.** Phase 01 data owner |
| R6 | **Verified imagery** is required for products (FR-002) | 02 | The imagery is generated placeholders, not verified product photos | Yes, before launch |
| R7 | **Mobile sticky actions** are "optional after usability testing" | 03 | Shipped as a mobile bottom bar (Shop, Quick Order and Quote) because AT-04 requires immediate access. It is easy to remove | Validate in usability test |
| R8 | **Scroll motion** is limited to "2–3 meaningful scroll moments" | 01, 04 | Small fade/rise reveals on section heads and cards. The single choreographed moment is the ordering-steps line. No scroll-jacking. Motion is off under reduced motion | — |
| R9 | **Brand claims**: "avoid invented brand claims" | 04 | Copy uses only facts from the company profile: vision and mission, values, partner brands, Dubai/Abu Dhabi and contact details. I removed a "thousands of products" claim and the hero stats count only what is shown. Partner brand names are text only, with no trademarks or logos | Confirm the brand list may be shown |
| R10 | **Company name spelling**: "Stationary" (the legal name in the profile) vs "stationery" (the product) | PDF | The legal entity keeps "Stationary Trading LLC". Product copy uses "stationery" | Confirm the legal name |
| R11 | **Data residency**: Hostinger servers and backups are in the USA | 07 | Documented and not resolved by code | **Yes.** Compliance reviewer |

## 2. Architecture

```
Browser (EN/AR, RTL) ──HTTPS──▶ Hostinger Node.js Web App (one process, PORT from Hostinger)
                                 server.mjs  = Hono
                                   ├─ /api/rpc/*   oRPC typed procedures (catalog, system, …)
                                   ├─ /api/health, /api/health/db
                                   ├─ /api/cron/*  (Stage 2+, token-protected, bounded batches)
                                   └─ static SPA (public/) + SPA fallback, gzip, cache headers
                                         │ mysql2 pool (5)
                                         ▼
                                 Hostinger MariaDB (schema via phpMyAdmin SQL import)
```

- **Multi-tenant from day one.** Every business table carries `tenant_id`. The tenant is resolved from `TENANT_SLUG`; SLST is tenant #1. Theme tokens live in CSS variables (`design.md`) so a second tenant can re-skin without forking (Phase 11).
- **The server is authoritative (NFR-004).** The schema already models unit conversion to an inventory base unit, price lists with validity, immutable `quote_versions`, and `processed_events` (unique provider event id, for AT-05). Basket, order and quote logic arrive in Stage 2.
- **Search (FR-001).** Matches name, SKU, brand and category in EN and AR. Arabic is normalised (alef/ya/ta-marbuta/diacritics). Zero results return category suggestions.
- **No Runable runtime dependency.** Production uses only `server.mjs` and MariaDB. The template's Runable SQLite DB (`src/api/database`) is not used by any feature code. The "Made with Runable" badge only appears in the preview build and can be removed.
- **Schema (15 tables):**
  - Catalogue: `tenants`, `categories`, `brands`, `products`, `product_units`
  - Pricing and stock: `price_lists`, `prices`, `inventory`
  - Accounts: `companies`, `company_users`
  - Quotes and orders: `quotes`, `quote_versions`, `orders`
  - Integrity: `processed_events`, `audit_log`
- **Project layout (`packages/web`):**
  - `src/api/data/*`: MariaDB schema, pool, repositories, seed
  - `src/api/routes/*`: oRPC routers
  - `src/web/components/{site,home}`: UI
  - `src/web/i18n`: EN/AR dictionary and locale/RTL provider
  - `deploy/hostinger/*`: Node adapter, bundler and zip
  - `drizzle-mariadb/`: SQL migrations
  - Design system: `/design.md`

## 3. Checkpoint status: what was tested, mocked or not built

### Works, with tests run in this checkpoint
- **Homepage, all nine sections from the brief:**
  - Cinematic hero with Shop Products / Quick Order / Request Quote in the first viewport
  - Category discovery
  - Business solutions
  - 3-step intelligent-ordering intro
  - Featured products, which shows unit/pack conversion, stock badges and VAT labels
  - B2B benefits
  - Company info (profile facts)
  - CTA band and footer
- **EN ↔ AR switch with full RTL** (`dir="rtl"`, logical spacing, mirrored icons). Latin SKUs are isolated inside Arabic text. Arabic fonts are in use.
- **Responsive layouts.** Screenshots at 1440 px and 390 px, EN and AR. No horizontal overflow and no console errors.
- **Hero video:**
  - Plays only while visible.
  - Uses 1080p WebM on desktop and 540p MP4 on mobile.
  - Muted, with the poster always present.
  - **Reduced motion renders no video element, only the poster (AT-04, verified).**
- **Lab CLS** (dev server): 0.037 EN desktop, 0.018 AR desktop, 0 to 0.007 mobile.
- **Live search** against MariaDB (EN, AR and SKU), including zero-result suggestions.
- **Hostinger bundle:**
  - Runs on Node 18, 20, 22 and 24.
  - Fresh-database import of the schema and seed SQL works.
  - Health and DB health endpoints, search, SPA routes, gzip and security headers all checked.
- **Quality checks:** lint 0 errors, typecheck 3/3, production build OK. The main JS chunk is 178 kB gzip; the animation library was removed and secondary routes are lazy-loaded.

### Mocked or placeholder
- All product, category and solution imagery, and the hero video, are AI-generated.
- 18 SAMPLE SKUs. Their prices, tiers and stock are fictional.
- `/shop`, `/quick-order` and `/rfq` are labelled placeholder pages ("Stage 2 — not yet implemented"). The product cards' **Add** buttons route to the Quick Order placeholder.
- The basket badge is always 0. The account icon does nothing yet.
- Contact details come from the company profile and have not been re-verified.

### Not implemented (do **not** treat as done)
Basket and server-side pricing (FR-004), quick order (FR-005 / AT-01), RFQ and quotes (FR-006 / AT-02), auth and company accounts (FR-007 / AT-03, NFR-003 MFA), checkout and payments (FR-011 / AT-05), order admin, merchant console (FR-012/013), CMS (FR-017), audit writes (FR-018), analytics, every P1 and P2 item, and **any real Hostinger deployment**.

## 4. P0 / P1 / P2 tracker

| Req | Item | Pri | Status |
|---|---|---|---|
| FR-001 | Search (EN/AR aliases, zero results) | P0 | **Partial.** API and live homepage search work. Results page not built |
| FR-002 | Category and product pages | P0 | Not started (Stage 2) |
| FR-003 | Units each/pack/box/carton | P0 | **Schema and display only.** No conversion logic in the basket yet |
| FR-004 | Basket and server recalculation | P0 | Not started (Stage 2) |
| FR-005 | Quick order by SKU | P0 | Placeholder (Stage 2) |
| FR-006 | RFQ lifecycle, immutable versions | P0 | Schema only (Stage 2–3) |
| FR-007 | Company users and roles | P0 | Schema only (Stage 3) |
| FR-008 | Tier and negotiated prices | P1 (basic P0) | Basic price list plus tiers in the seed |
| FR-009 | CSV/XLSX import order | P1 | — |
| FR-010 | Saved lists, reorder | P1 | — |
| FR-011 | Checkout, payment, VAT | P0 | Blocked on the payment and shipping provider decision |
| FR-012 | Merchant guided import | P0 | — (Stage 4) |
| FR-013 | Merchant dashboards | P0 | — (Stage 4) |
| FR-014 | Arabic RTL and localized errors | P0 | **Done for the homepage.** Continues every stage |
| FR-015 | Channel integrations | P1 | — (needs channel decisions) |
| FR-016 | Intent-to-basket | P2 | — |
| FR-017 | CMS hero, categories, SEO | P0 | — (Stage 4). The homepage content is currently in the code dictionary |
| FR-018 | Audit log | P0 | Table only |
| NFR-001 | CWV p75 | — | Lab CLS OK. LCP/INP need measuring on the real domain |
| NFR-002 | WCAG 2.2 AA | — | Semantics, focus, skip link, reduced motion and contrast tokens are in place. A formal audit is pending |
| NFR-006 | No unsupported Hostinger dependency | — | **Met locally.** Needs the in-account proof |

## 5. Next stages

1. **Stage 2: Storefront core.** Category and search-results pages with filters, product detail page with units and specs, a persistent basket priced on the server (VAT 5%, unit conversion, stock warnings), Quick Order with multi-row SKU entry and paste (AT-01 test), and RFQ submission.
2. **Stage 3: Accounts and quotes.** Session auth (argon2, httpOnly cookies, CSRF), company users, roles and addresses, company-scoped queries (AT-03 test), the quote review → version → expiry → accept → convert flow (AT-02 test), and the audit log.
3. **Stage 4: Merchant console.** Guided catalogue import (map → validate → preview → publish), quote, order and stock inboxes, CMS blocks, and MFA for staff.
4. **Stage 5: Checkout and integrations.** The chosen payment gateway with a signed, idempotent webhook (AT-05 test), shipping, and the cron job runner.
5. **Stage 6: P1, then P2.** Spreadsheet import, saved lists and reorder, advanced approvals, channel adapters, intent-to-basket and replenishment.

Each stage ends with tests, screenshots, an updated tracker and a new zip.

## 6. Decisions needed from the owner
1. Confirm a **Node.js Web App** can be created on account u997446728, then run the in-account proof checklist (`HOSTINGER_DEPLOYMENT.md` §9). Optionally give me a staging subdomain.
2. **Payment provider** for the UAE: candidates are Network International/N-Genius, Telr, Stripe, Checkout.com and PayTabs. Also decide whether B2B on-account/invoice terms are needed.
3. **Shipping and delivery**: own fleet or courier, delivery zones and fees.
4. **Real catalogue**: SKUs, Arabic names, units and conversions, price lists, stock source, product photos. Appoint a data owner.
5. **Legal copy**: VAT TRN, terms, returns and privacy policy; compliance review of US data residency.
6. **Hero video**: approve the generated clip or supply a licensed final; confirm the partner-brand list may be displayed.
7. **Missing docs 05, 06, 08, 10 and 11**, if they exist.
