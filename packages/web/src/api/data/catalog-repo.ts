/** Catalog read queries against MariaDB. Tenant-scoped on every query. */
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { rawQuery, mdb, schema as s } from "./mariadb";
import { env } from "./env";

const TENANT_SLUG = () => env("TENANT_SLUG") ?? "slst";
let tenantCache: { id: number; currency: string; vatRate: string } | null = null;

export async function currentTenant() {
  if (tenantCache) return tenantCache;
  const [t] = await mdb().select().from(s.tenants).where(eq(s.tenants.slug, TENANT_SLUG()));
  if (!t) throw new Error(`Tenant "${TENANT_SLUG()}" not found — run bun run mdb:seed`);
  tenantCache = { id: t.id, currency: t.currency, vatRate: t.vatRate };
  return tenantCache;
}

export async function listCategories() {
  const t = await currentTenant();
  const rows = await mdb()
    .select({
      id: s.categories.id,
      slug: s.categories.slug,
      nameEn: s.categories.nameEn,
      nameAr: s.categories.nameAr,
      blurbEn: s.categories.blurbEn,
      blurbAr: s.categories.blurbAr,
      image: s.categories.image,
      productCount: sql<number>`(select count(*) from products p where p.category_id = ${s.categories.id} and p.status = 'published')`,
    })
    .from(s.categories)
    .where(and(eq(s.categories.tenantId, t.id), eq(s.categories.active, true)))
    .orderBy(asc(s.categories.sort));
  return rows.map((r) => ({ ...r, productCount: Number(r.productCount) }));
}

async function hydrate(productIds: number[]) {
  if (!productIds.length) return [];
  const db = mdb();
  const t = await currentTenant();
  const rows = await db
    .select({
      id: s.products.id,
      sku: s.products.sku,
      nameEn: s.products.nameEn,
      nameAr: s.products.nameAr,
      image: s.products.image,
      isSample: s.products.isSample,
      brand: s.brands.name,
      categorySlug: s.categories.slug,
      categoryEn: s.categories.nameEn,
      categoryAr: s.categories.nameAr,
      onHand: s.inventory.onHandBase,
    })
    .from(s.products)
    .leftJoin(s.brands, eq(s.brands.id, s.products.brandId))
    .innerJoin(s.categories, eq(s.categories.id, s.products.categoryId))
    .leftJoin(s.inventory, eq(s.inventory.productId, s.products.id))
    .where(and(eq(s.products.tenantId, t.id), inArray(s.products.id, productIds)));
  const units = await db
    .select({
      productId: s.productUnits.productId,
      unit: s.productUnits.unit,
      toBase: s.productUnits.toBase,
      labelEn: s.productUnits.labelEn,
      labelAr: s.productUnits.labelAr,
      priceMinor: s.prices.amountMinor,
    })
    .from(s.productUnits)
    .leftJoin(s.prices, and(eq(s.prices.productUnitId, s.productUnits.id), eq(s.prices.minQty, 1)))
    .where(inArray(s.productUnits.productId, productIds))
    .orderBy(asc(s.productUnits.toBase));
  const byId = new Map(rows.map((r) => [r.id, { ...r, onHand: r.onHand ?? 0, units: [] as typeof units }]));
  for (const u of units) byId.get(u.productId)?.units.push(u);
  return productIds.map((id) => byId.get(id)).filter((x): x is NonNullable<typeof x> => !!x);
}

export async function featuredProducts(limit: number) {
  const t = await currentTenant();
  const ids = await mdb()
    .select({ id: s.products.id })
    .from(s.products)
    .where(and(eq(s.products.tenantId, t.id), eq(s.products.featured, true), eq(s.products.status, "published")))
    .orderBy(asc(s.products.id))
    .limit(limit);
  return { currency: t.currency, vatRate: Number(t.vatRate), items: await hydrate(ids.map((r) => r.id)) };
}

/** Light Arabic normalisation so أ/إ/آ→ا, ة→ه, ى→ي match each other. */
export function normalise(q: string) {
  return q
    .trim()
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ");
}

const NORM_SQL = (col: string) =>
  `replace(replace(replace(replace(replace(replace(lower(${col}),'أ','ا'),'إ','ا'),'آ','ا'),'ة','ه'),'ى','ي'),'ـ','')`;

export async function searchProducts(q: string, limit: number) {
  const t = await currentTenant();
  const term = normalise(q);
  if (!term) return { query: q, items: [], suggestions: [] as Awaited<ReturnType<typeof listCategories>> };
  const like = `%${term.replace(/[%_\\]/g, (m) => `\\${m}`)}%`;
  const rows = await rawQuery<{ id: number }>(
        `select id,
           (case when lower(sku) = ? then 100 when lower(sku) like ? then 60 else 0 end) +
           (case when ${NORM_SQL("name_en")} like ? then 30 else 0 end) +
           (case when ${NORM_SQL("name_ar")} like ? then 30 else 0 end) +
           (case when ${NORM_SQL("cast(aliases as char)")} like ? then 20 else 0 end) as score
         from products
         where tenant_id = ? and status = 'published'
         having score > 0
         order by score desc, id asc
         limit ?`,
        [term, like, like, like, like, t.id, limit],
      );
  const ids = rows.map((r) => Number(r.id));
  const items = await hydrate(ids);
  // Zero-result recovery: offer categories instead of a dead end.
  const suggestions = items.length ? [] : await listCategories();
  return { query: q, items, suggestions };
}
