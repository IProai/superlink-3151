import { Link } from "wouter";
import { Plus, FileText, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { useFeatured } from "../../queries/catalog";
import { Reveal, SectionHead } from "../site/reveal";

/** Scroll moment #3: product cards stagger in (prices themselves never animate). */
export function Featured() {
  const { t, locale, money } = useLocale();
  const q = useFeatured(8);
  return (
    <section id="featured" className="section-y bg-mist" aria-labelledby="feat-title">
      <div className="container-x">
        <SectionHead
          eyebrow={t.featured.eyebrow}
          title={t.featured.title}
          action={
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-warn/10 px-3 py-1.5 text-xs font-semibold text-warn">
              <AlertTriangle className="size-3.5" aria-hidden /> {t.featured.sample}
            </span>
          }
        />
        {q.isError ? (
          <div className="mt-12 flex items-center justify-between gap-4 rounded-2xl border border-line bg-white p-6">
            <p className="text-ink-2">{t.featured.error}</p>
            <button type="button" onClick={() => q.refetch()} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
              {t.featured.retry}
            </button>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {q.isPending &&
              Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="h-[22rem] animate-pulse rounded-[14px] bg-white" />
              ))}
            {q.data?.items.map((p, i) => {
              const first = p.units[0];
              const bulk = p.units.length > 1 ? p.units[p.units.length - 1] : null;
              const low = p.onHand < 60;
              return (
                <Reveal as="li" key={p.id} delay={(i % 4) * 0.06} className="h-full">
                  <article className="group flex h-full flex-col rounded-[14px] bg-white p-3 ring-1 ring-line transition-shadow hover:shadow-[var(--e-2)] md:p-4">
                    <div className="relative aspect-square overflow-hidden rounded-[10px] bg-mist">
                      {p.image && (
                        <img src={p.image} alt="" loading="lazy" decoding="async" width={800} height={800} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                      )}
                      <span className={`absolute start-2 top-2 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${low ? "bg-warn/15 text-warn" : "bg-success/10 text-success"}`}>
                        {low ? t.search.lowStock : t.search.inStock}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-medium text-ink-2">{p.brand}</p>
                    <h3 className="mt-0.5 line-clamp-2 min-h-[2.6em] font-sans text-sm font-semibold leading-snug tracking-normal text-ink md:text-base">
                      {locale === "ar" ? p.nameAr : p.nameEn}
                    </h3>
                    <p className="ltr-iso mt-1 text-start text-[0.7rem] text-ink-2">SKU {p.sku}</p>
                    <div className="mt-auto pt-3">
                      {first?.priceMinor != null && (
                        <p className="text-ink">
                          <span className="ltr-iso text-lg font-bold">{money(first.priceMinor)}</span>
                          <span className="ms-1 text-xs text-ink-2">/ {locale === "ar" ? first.labelAr : first.labelEn}</span>
                        </p>
                      )}
                      {bulk?.priceMinor != null && (
                        <p className="mt-0.5 text-xs text-ink-2">
                          {locale === "ar" ? bulk.labelAr : bulk.labelEn}: <span className="ltr-iso font-semibold text-ink">{money(bulk.priceMinor)}</span>{" "}
                          <span className="ltr-iso">(= {bulk.toBase} × {locale === "ar" ? first.labelAr : first.labelEn})</span>
                        </p>
                      )}
                      <p className="mt-0.5 text-[0.68rem] text-ink-2">{t.featured.exVat}</p>
                      <div className="mt-3 flex gap-2">
                        <Link
                          href="/quick-order"
                          className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-ink text-xs font-semibold text-white hover:bg-brand-700 md:text-sm"
                        >
                          <Plus className="size-3.5" aria-hidden /> {t.featured.add}
                        </Link>
                        <Link
                          href="/rfq"
                          aria-label={`${t.featured.quote}: ${locale === "ar" ? p.nameAr : p.nameEn}`}
                          className="grid size-9 place-items-center rounded-full border border-line text-ink hover:border-ink"
                        >
                          <FileText className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}
        <div className="mt-10 text-center">
          <Link href="/shop" className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline">
            {t.featured.viewAll} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}
