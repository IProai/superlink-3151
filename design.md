# SuperLink Commerce 2027 — Design System

Premium, light, cinematic B2B stationery commerce for **Super Link Stationary Trading LLC (SLST)** — tenant #1 of a reusable multi-tenant platform. Web first (desktop / tablet / mobile), bilingual English + Arabic (full RTL). The job: let an office manager, school buyer or procurement officer find, build and reorder a stationery basket — or request a quote — in the fewest possible steps.

Principles: **clarity over decoration, speed over spectacle, B2B-first defaults.** One cinematic moment (the hero video), then calm, dense, scannable commerce.

## Brand & Colors

Web tokens live in `packages/web/src/web/styles.css` (`:root`). Light theme only for v1.

| Token | Value | Use |
|-------|-------|-----|
| `--brand` / primary | `#08ABCC` | Primary CTAs, active states, focus ring, links |
| `--brand-600` | `#0790AD` | Hover / pressed primary; cyan text on white (AA for ≥18px bold) |
| `--brand-700` | `#066F86` | Cyan text at body size (AA 5.6:1 on white) |
| `--brand-50` | `#E8F8FB` | Tinted surfaces, chips, selected rows |
| `--ink` / foreground | `#0B1F2A` | Headlines, body text (16.9:1 on white) |
| `--ink-2` / muted-fg | `#4A5D68` | Secondary text (6.6:1) |
| `--line` / border | `#E3EAEE` | Hairlines, card borders |
| `--paper` / background | `#FFFFFF` | Page |
| `--mist` / secondary | `#F4F8FA` | Alternate section band |
| `--success` | `#0F9D58` | In stock, valid rows |
| `--warn` | `#B76E00` | Low stock, quote expiring |
| `--danger` | `#C62828` | Invalid SKU, errors |

Rules: cyan is an *accent*, not a fill for whole sections. Never use cyan text below 18px unless `--brand-700`. No purple, no gradients-on-white clichés; the only gradient is a white→transparent scrim over the hero video for legibility.

## Typography

- **Display (Latin):** *Bricolage Grotesque* 600/700 — headlines, section titles, big numbers.
- **Body / UI (Latin):** *Figtree* 400/500/600 — everything else.
- **Arabic (display + body):** *IBM Plex Sans Arabic* 400/500/600/700 — swapped in via `:lang(ar)`.
- Loaded from Google Fonts with `display=swap` + preconnect (move to `public/fonts/` self-hosted before production on Hostinger to drop the third-party request).
- Scale (clamp, fluid): display `clamp(2.4rem, 5.6vw, 4.75rem)` / h2 `clamp(1.75rem, 3.2vw, 2.75rem)` / h3 `1.25rem` / body `1rem` (16px) / small `0.875rem` / micro `0.75rem` uppercase tracking `0.12em` for eyebrow labels (Latin only — Arabic eyebrows are never uppercased or letter-spaced).
- Line height: headings 1.05–1.15 (Arabic 1.3), body 1.6 (Arabic 1.8).
- SKUs, prices, quantities: `font-variant-numeric: tabular-nums`, wrapped in `dir="ltr"` (`.ltr-iso`) inside Arabic text.

## Space, Radius, Elevation

- 4px base grid. Section padding block: `clamp(4rem, 9vw, 8rem)`. Container max 1320px, gutter `clamp(1rem, 4vw, 2.5rem)`.
- Radii: `--r-sm 8px` (inputs, chips) · `--r-md 14px` (cards) · `--r-lg 22px` (feature panels) · `--r-pill 999px` (CTAs, toggles).
- Elevation: `--e-1 0 1px 2px rgb(11 31 42 / .06)` · `--e-2 0 8px 24px -8px rgb(11 31 42 / .14)` · `--e-3 0 24px 60px -20px rgb(8 171 204 / .35)` (cyan glow, primary CTA hover only).
- Glass nav: `rgb(255 255 255 / .78)` + `backdrop-filter: blur(14px) saturate(1.4)` + bottom hairline.

## Motion

- **One** hero video (muted, no audio, loop, `playsinline`), played only while on screen (IntersectionObserver), 540p source < 768px, 1080p above. Poster image is the LCP element.
- `prefers-reduced-motion: reduce` → no video at all, static poster, no reveals (AT-04).
- Max **3 scroll moments**: (1) section-title reveal, (2) 3-step ordering line draw, (3) featured product stagger. 400–600ms, `cubic-bezier(.2,.7,.2,1)`, translate ≤ 24px.
- Never animate prices, totals, basket or checkout. No forced intro, no scroll-jacking.

## RTL Rules

- `<html lang dir>` set by `LocaleProvider`; persisted in `localStorage` (`slst.locale`) and overridable with `?lang=ar|en`.
- Use logical properties only (`ms-/me-/ps-/pe-/start-/end-`, `text-start`). Directional icons (arrows, chevrons) flip with `rtl:-scale-x-100`.
- Numbers stay Western Arabic digits (UAE commerce convention); SKUs/prices isolated LTR.
- Every UI string comes from the dictionary (`src/web/i18n/`); missing AR keys fall back to EN and are flagged in dev.

## Pages

- **Home** (`pages/index.tsx`) — glass nav · cinematic hero + 3 CTAs (Shop Products, Quick Order, Request Quote) + search · trust strip · categories · business solutions (office / school / institutional) · intelligent ordering 3 steps (Find → Build → Reorder/Quote) · featured products (live from MariaDB) · B2B benefits · company (mission, values, brands as text) · CTA band · footer.
- **Shop / Quick Order / RFQ** (`pages/shop.tsx`, `quick-order.tsx`, `rfq.tsx`) — stage-2 placeholders, clearly labelled.

## Architecture

- Frontend: Vite + React + Wouter + Tailwind 4, TanStack Query over the typed oRPC client.
- API: Hono + oRPC. **Primary data = MariaDB** via `drizzle-orm/mysql2` (`src/api/data/`), never the template Turso client.
- Production: single Node.js app on Hostinger Business (`deploy/hostinger/`), see `docs/HOSTINGER_DEPLOYMENT.md`.
