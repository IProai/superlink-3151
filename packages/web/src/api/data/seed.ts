/**
 * SAMPLE seed — catalog structure from the SLST company profile, but every SKU, price and
 * stock figure below is ILLUSTRATIVE (is_sample = 1). Replace via merchant catalog import.
 * Idempotent: re-running wipes and re-inserts tenant "slst" catalog rows.
 * Run: bun run mdb:seed
 */
import { eq } from "drizzle-orm";
import { mdb, getPool, schema as s } from "./mariadb";

type Unit = "each" | "pack" | "box" | "carton" | "ream";

const CATS = [
  ["paper", "Paper & Envelopes", "الورق والأظرف", "A4 copy, colour, roll & certificate paper, envelopes", "ورق تصوير A4، ورق ملون، رولات، شهادات وأظرف"],
  ["filing", "Filing & Storage", "الملفات والحفظ", "Box files, ring binders, folders, display books, trays", "ملفات صندوقية، ملفات حلقات، مجلدات، كتب عرض وصواني"],
  ["writing", "Writing Instruments", "أدوات الكتابة", "Pens, markers, highlighters & correction", "أقلام، ماركرات، أقلام تحديد ومصححات"],
  ["desk", "Desk Essentials", "مستلزمات المكتب", "Staplers, punches, tape, glue, scissors, sticky notes", "دباسات، خرامات، شريط لاصق، صمغ، مقصات وأوراق لاصقة"],
  ["machines", "Office Machines", "الأجهزة المكتبية", "Laminators, binders, shredders, calculators, label guns", "أجهزة تغليف، تجليد، فرامات، آلات حاسبة وملصقات"],
  ["toner", "Printer Supplies", "مستلزمات الطابعات", "HP, Canon & Brother toners, cartridges, ribbons", "أحبار HP وCanon وBrother، خراطيش وأشرطة"],
  ["school", "School & Art", "المدرسة والفنون", "Colours, sketch, geometry & classroom supplies", "ألوان، رسم، أدوات هندسية ومستلزمات الصف"],
  ["boards", "Boards & Presentation", "اللوحات والعرض", "Whiteboards, flip charts, markers, erasers, pins", "سبورات بيضاء، لوحات ورقية، ماركرات، مساحات ودبابيس"],
] as const;

const BRANDS = ["Double A", "Faber-Castell", "Cello", "HP", "Canon", "Brother", "Staedtler", "Pentel", "Kangaro", "MAX", "Rexel", "Durable", "Zebra", "Post-it", "Casio", "3M", "Olfa", "Epson"];

// sku, cat, brand, nameEn, nameAr, aliases, image, featured, units [unit, toBase, priceFils]
const PRODUCTS: [string, string, string, string, string, string[], string | null, boolean, [Unit, number, number][]][] = [
  ["SL-PAP-A4-80", "paper", "Double A", "A4 Copy Paper 80gsm", "ورق تصوير A4 80 جم", ["a4", "copy paper", "printer paper", "ورق", "ورق تصوير", "a4 paper"], "/images/products/paper.webp", true, [["ream", 1, 1650], ["carton", 5, 7900]]],
  ["SL-PAP-A3-80", "paper", "Double A", "A3 Copy Paper 80gsm", "ورق تصوير A3 80 جم", ["a3", "copy paper", "ورق a3"], null, false, [["ream", 1, 3200], ["carton", 5, 15500]]],
  ["SL-FIL-BOX-FS", "filing", "Durable", "Box File, Foolscap", "ملف صندوقي فولسكاب", ["box file", "lever arch", "ملف", "ملف بوكس"], "/images/products/boxfile.webp", true, [["each", 1, 650], ["box", 10, 6000]]],
  ["SL-FIL-RB-A4", "filing", "Rexel", "Ring Binder A4, 2-Ring", "ملف حلقات A4 حلقتين", ["ring binder", "binder", "ملف حلقات"], null, false, [["each", 1, 750], ["box", 10, 7000]]],
  ["SL-FIL-LF-A4", "filing", "Durable", "L-Folder A4, Clear (12)", "ملف L شفاف A4 (12)", ["l folder", "clear folder", "ملف شفاف"], null, false, [["pack", 1, 900], ["carton", 20, 16500]]],
  ["SL-WRI-BP-BL", "writing", "Faber-Castell", "Ballpoint Pen 1.0mm, Blue", "قلم حبر جاف 1.0 مم أزرق", ["pen", "ball pen", "biro", "قلم", "قلم أزرق"], "/images/products/pens.webp", true, [["each", 1, 150], ["box", 50, 6500]]],
  ["SL-WRI-HL-6", "writing", "Staedtler", "Highlighter Set, 6 Colours", "طقم أقلام تحديد 6 ألوان", ["highlighter", "marker", "قلم تحديد", "هايلايتر"], "/images/products/markers.webp", true, [["pack", 1, 1800], ["box", 10, 16500]]],
  ["SL-WRI-CT-5", "writing", "Pentel", "Correction Tape 5mm", "شريط تصحيح 5 مم", ["correction", "tipex", "white out", "مصحح", "كوريكشن"], null, false, [["each", 1, 450], ["box", 12, 4900]]],
  ["SL-DSK-STP-HD", "desk", "Kangaro", "Heavy-Duty Stapler, 100 Sheets", "دباسة ثقيلة 100 ورقة", ["stapler", "دباسة", "كبس"], "/images/products/stapler.webp", true, [["each", 1, 8500]]],
  ["SL-DSK-NTS-76", "desk", "Post-it", "Sticky Notes 76×76, 5 Pads", "أوراق لاصقة 76×76 (5 دفاتر)", ["sticky notes", "post it", "memo", "ورق لاصق", "بوست ات"], "/images/products/notes.webp", true, [["pack", 1, 2200], ["box", 12, 24500]]],
  ["SL-DSK-STA-26", "desk", "MAX", "Staples 26/6 (1000)", "دبابيس دباسة 26/6 (1000)", ["staples", "pins", "دبابيس"], null, false, [["box", 1, 300], ["carton", 20, 5200]]],
  ["SL-MAC-LAM-A3", "machines", "Rexel", "A3 Laminator, Hot & Cold", "جهاز تغليف A3 ساخن وبارد", ["laminator", "laminating", "تغليف", "لامينيتر"], "/images/products/laminator.webp", true, [["each", 1, 39500]]],
  ["SL-MAC-CAL-12", "machines", "Casio", "Desktop Calculator, 12-Digit", "آلة حاسبة مكتبية 12 خانة", ["calculator", "آلة حاسبة", "حاسبة"], null, false, [["each", 1, 6500]]],
  ["SL-TON-HP-85A", "toner", "HP", "HP 85A Black Toner (CE285A)", "حبر HP 85A أسود (CE285A)", ["toner", "hp 85a", "ce285a", "حبر", "تونر"], "/images/products/toner.webp", true, [["each", 1, 28500]]],
  ["SL-TON-CN-737", "toner", "Canon", "Canon 737 Black Toner", "حبر كانون 737 أسود", ["toner", "canon 737", "حبر كانون"], null, false, [["each", 1, 31000]]],
  ["SL-BRD-WB-90", "boards", "Durable", "Magnetic Whiteboard 90×120", "سبورة بيضاء مغناطيسية 90×120", ["whiteboard", "board", "سبورة", "وايت بورد"], null, false, [["each", 1, 27500]]],
  ["SL-BRD-WBM-4", "boards", "Pentel", "Whiteboard Markers, 4 Colours", "ماركر سبورة 4 ألوان", ["whiteboard marker", "wb marker", "ماركر سبورة"], null, false, [["pack", 1, 1400], ["box", 12, 15000]]],
  ["SL-SCH-CP-24", "school", "Faber-Castell", "Colour Pencils, 24", "أقلام تلوين 24 لون", ["colour pencils", "color pencils", "crayons", "ألوان خشبية", "أقلام تلوين"], null, false, [["pack", 1, 2400], ["box", 12, 26500]]],
];

async function main() {
  const db = mdb();
  let [tenant] = await db.select().from(s.tenants).where(eq(s.tenants.slug, "slst"));
  if (!tenant) {
    await db.insert(s.tenants).values({ slug: "slst", name: "Super Link Stationary Trading LLC" });
    [tenant] = await db.select().from(s.tenants).where(eq(s.tenants.slug, "slst"));
  }
  const t = tenant.id;
  const pool = getPool();
  // wipe catalog for tenant (sample only)
  await pool.query("DELETE p FROM prices p JOIN price_lists l ON l.id=p.price_list_id WHERE l.tenant_id=?", [t]);
  await pool.query("DELETE u FROM product_units u JOIN products p ON p.id=u.product_id WHERE p.tenant_id=?", [t]);
  await pool.query("DELETE i FROM inventory i JOIN products p ON p.id=i.product_id WHERE p.tenant_id=?", [t]);
  for (const tbl of ["products", "categories", "brands", "price_lists"]) await pool.query(`DELETE FROM ${tbl} WHERE tenant_id=?`, [t]);

  await db.insert(s.categories).values(
    CATS.map(([slug, nameEn, nameAr, blurbEn, blurbAr], i) => ({ tenantId: t, slug, nameEn, nameAr, blurbEn, blurbAr, image: `/images/cat/${slug}.webp`, sort: i })),
  );
  await db.insert(s.brands).values(BRANDS.map((name) => ({ tenantId: t, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") })));
  await db.insert(s.priceLists).values({ tenantId: t, code: "STD", name: "Standard (SAMPLE)", isDefault: true });

  const cats = Object.fromEntries((await db.select().from(s.categories).where(eq(s.categories.tenantId, t))).map((c) => [c.slug, c.id]));
  const brands = Object.fromEntries((await db.select().from(s.brands).where(eq(s.brands.tenantId, t))).map((b) => [b.name, b.id]));
  const [pl] = await db.select().from(s.priceLists).where(eq(s.priceLists.tenantId, t));

  for (const [sku, cat, brand, nameEn, nameAr, aliases, image, featured, units] of PRODUCTS) {
    const [res] = await db.insert(s.products).values({
      tenantId: t, sku, categoryId: cats[cat], brandId: brands[brand], nameEn, nameAr, aliases, image, featured,
      baseUnit: units[0][0], status: "published", isSample: true,
    }).$returningId();
    await db.insert(s.inventory).values({ productId: res.id, onHandBase: 40 + ((sku.length * 37) % 400) });
    for (const [unit, toBase, price] of units) {
      const L: Record<Unit, [string, string]> = {
        each: ["Each", "قطعة"], pack: ["Pack", "عبوة"], box: [`Box of ${toBase}`, `علبة ${toBase}`],
        carton: [`Carton of ${toBase}`, `كرتونة ${toBase}`], ream: ["Ream (500 sheets)", "رزمة (500 ورقة)"],
      };
      const [u] = await db.insert(s.productUnits).values({ productId: res.id, unit, toBase, labelEn: L[unit][0], labelAr: L[unit][1] }).$returningId();
      await db.insert(s.prices).values({ priceListId: pl.id, productUnitId: u.id, amountMinor: price });
    }
  }
  await db.insert(s.auditLog).values({ tenantId: t, actor: "system:seed", action: "catalog.seed_sample", entity: "catalog", data: { products: PRODUCTS.length } });
  console.log(`Seeded tenant ${t}: ${CATS.length} categories, ${BRANDS.length} brands, ${PRODUCTS.length} SAMPLE products`);
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
