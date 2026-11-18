/**
 * MariaDB schema (primary production database on Hostinger).
 * mysql-core dialect — apply with `bun run mdb:push` from packages/web.
 * Every tenant-owned row carries tenant_id; company-owned rows carry company_id (AT-03 isolation).
 */
import {
  mysqlTable,
  varchar,
  int,
  bigint,
  decimal,
  boolean,
  timestamp,
  json,
  text,
  mysqlEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

const id = () => bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey();
const fk = (name: string) => bigint(name, { mode: "number", unsigned: true });
const created = () => timestamp("created_at").defaultNow().notNull();
const updated = () => timestamp("updated_at").defaultNow().onUpdateNow().notNull();

export const tenants = mysqlTable("tenants", {
  id: id(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 191 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("AED"),
  vatRate: decimal("vat_rate", { precision: 5, scale: 4 }).notNull().default("0.0500"),
  createdAt: created(),
});

export const categories = mysqlTable(
  "categories",
  {
    id: id(),
    tenantId: fk("tenant_id").notNull(),
    parentId: fk("parent_id"),
    slug: varchar("slug", { length: 96 }).notNull(),
    nameEn: varchar("name_en", { length: 191 }).notNull(),
    nameAr: varchar("name_ar", { length: 191 }).notNull(),
    blurbEn: varchar("blurb_en", { length: 255 }),
    blurbAr: varchar("blurb_ar", { length: 255 }),
    image: varchar("image", { length: 255 }),
    sort: int("sort").notNull().default(0),
    active: boolean("active").notNull().default(true),
  },
  (t) => [uniqueIndex("cat_tenant_slug").on(t.tenantId, t.slug)],
);

export const brands = mysqlTable(
  "brands",
  {
    id: id(),
    tenantId: fk("tenant_id").notNull(),
    slug: varchar("slug", { length: 96 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
  },
  (t) => [uniqueIndex("brand_tenant_slug").on(t.tenantId, t.slug)],
);

export const products = mysqlTable(
  "products",
  {
    id: id(),
    tenantId: fk("tenant_id").notNull(),
    sku: varchar("sku", { length: 64 }).notNull(),
    categoryId: fk("category_id").notNull(),
    brandId: fk("brand_id"),
    nameEn: varchar("name_en", { length: 255 }).notNull(),
    nameAr: varchar("name_ar", { length: 255 }).notNull(),
    descEn: text("desc_en"),
    descAr: text("desc_ar"),
    /** Search aliases in both languages, e.g. ["a4","copy paper","ورق تصوير"] */
    aliases: json("aliases").$type<string[]>().notNull(),
    baseUnit: mysqlEnum("base_unit", ["each", "pack", "box", "carton", "ream"]).notNull().default("each"),
    image: varchar("image", { length: 255 }),
    featured: boolean("featured").notNull().default(false),
    status: mysqlEnum("status", ["draft", "published", "archived"]).notNull().default("draft"),
    isSample: boolean("is_sample").notNull().default(false),
    createdAt: created(),
    updatedAt: updated(),
  },
  (t) => [uniqueIndex("prod_tenant_sku").on(t.tenantId, t.sku), index("prod_cat").on(t.categoryId)],
);

/** Sellable units with explicit conversion to the base unit (e.g. carton = 5 reams). */
export const productUnits = mysqlTable(
  "product_units",
  {
    id: id(),
    productId: fk("product_id").notNull(),
    unit: mysqlEnum("unit", ["each", "pack", "box", "carton", "ream"]).notNull(),
    toBase: int("to_base").notNull(),
    labelEn: varchar("label_en", { length: 96 }).notNull(),
    labelAr: varchar("label_ar", { length: 96 }).notNull(),
    minQty: int("min_qty").notNull().default(1),
  },
  (t) => [uniqueIndex("unit_prod_unit").on(t.productId, t.unit)],
);

export const priceLists = mysqlTable("price_lists", {
  id: id(),
  tenantId: fk("tenant_id").notNull(),
  code: varchar("code", { length: 64 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
});

/** Prices are stored in fils (minor units, integer) per sellable unit, VAT-exclusive. */
export const prices = mysqlTable(
  "prices",
  {
    id: id(),
    priceListId: fk("price_list_id").notNull(),
    productUnitId: fk("product_unit_id").notNull(),
    minQty: int("min_qty").notNull().default(1),
    amountMinor: int("amount_minor").notNull(),
  },
  (t) => [uniqueIndex("price_tier").on(t.priceListId, t.productUnitId, t.minQty)],
);

export const inventory = mysqlTable("inventory", {
  productId: fk("product_id").primaryKey(),
  onHandBase: int("on_hand_base").notNull().default(0),
  updatedAt: updated(),
});

export const companies = mysqlTable("companies", {
  id: id(),
  tenantId: fk("tenant_id").notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  trn: varchar("trn", { length: 32 }),
  priceListId: fk("price_list_id"),
  createdAt: created(),
});

export const companyUsers = mysqlTable(
  "company_users",
  {
    id: id(),
    companyId: fk("company_id").notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    role: mysqlEnum("role", ["owner", "buyer", "approver", "viewer"]).notNull().default("buyer"),
    passwordHash: varchar("password_hash", { length: 255 }),
    createdAt: created(),
  },
  (t) => [uniqueIndex("cu_email").on(t.email)],
);

export const quotes = mysqlTable("quotes", {
  id: id(),
  tenantId: fk("tenant_id").notNull(),
  companyId: fk("company_id"),
  number: varchar("number", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["requested", "in_review", "priced", "accepted", "expired", "converted", "rejected"])
    .notNull()
    .default("requested"),
  contactEmail: varchar("contact_email", { length: 191 }).notNull(),
  currentVersion: int("current_version").notNull().default(1),
  createdAt: created(),
  updatedAt: updated(),
});

/** Immutable — a re-price inserts a new version, never updates an old one. */
export const quoteVersions = mysqlTable(
  "quote_versions",
  {
    id: id(),
    quoteId: fk("quote_id").notNull(),
    version: int("version").notNull(),
    lines: json("lines").notNull(),
    subtotalMinor: int("subtotal_minor"),
    vatMinor: int("vat_minor"),
    totalMinor: int("total_minor"),
    expiresAt: timestamp("expires_at"),
    createdAt: created(),
  },
  (t) => [uniqueIndex("qv_quote_version").on(t.quoteId, t.version)],
);

export const orders = mysqlTable("orders", {
  id: id(),
  tenantId: fk("tenant_id").notNull(),
  companyId: fk("company_id"),
  number: varchar("number", { length: 32 }).notNull().unique(),
  status: mysqlEnum("status", ["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"])
    .notNull()
    .default("pending_payment"),
  lines: json("lines").notNull(),
  subtotalMinor: int("subtotal_minor").notNull(),
  vatMinor: int("vat_minor").notNull(),
  totalMinor: int("total_minor").notNull(),
  sourceQuoteId: fk("source_quote_id"),
  createdAt: created(),
});

/** Webhook / job idempotency (AT-05). */
export const processedEvents = mysqlTable("processed_events", {
  eventKey: varchar("event_key", { length: 191 }).primaryKey(),
  source: varchar("source", { length: 64 }).notNull(),
  processedAt: created(),
});

export const auditLog = mysqlTable(
  "audit_log",
  {
    id: id(),
    tenantId: fk("tenant_id").notNull(),
    actor: varchar("actor", { length: 191 }).notNull(),
    action: varchar("action", { length: 96 }).notNull(),
    entity: varchar("entity", { length: 64 }).notNull(),
    entityId: varchar("entity_id", { length: 64 }),
    data: json("data"),
    createdAt: created(),
  },
  (t) => [index("audit_tenant_time").on(t.tenantId, t.createdAt)],
);
