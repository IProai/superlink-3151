import { Link } from "wouter";
import { ArrowUpRight, Check } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { useCategories } from "../../queries/catalog";
import { SectionHead } from "../site/reveal";

export function TrustStrip() {
  const { t } = useLocale();
  return (
    <div className="border-y border-line bg-white">
      <ul className="container-x grid grid-cols-2 gap-x-6 gap-y-3 py-5 text-[0.8125rem] font-medium text-ink md:flex md:justify-between md:text-sm">
        {t.trust.map((x) => (
          <li key={x} className="flex items-start gap-2 md:items-center">
            <Check className="mt-0.5 size-4 shrink-0 text-brand md:mt-0" aria-hidden /> {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Categories() {
  const { t, locale } = useLocale();
  const q = useCategories();
  return (
    <section id="categories" className="section-y" aria-labelledby="cat-title">
      <div className="container-x">
        <SectionHead
          eyebrow={t.categories.eyebrow}
          title={t.categories.title}
          lede={t.categories.lede}
          action={
            <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
              {t.categories.all} <ArrowUpRight className="size-4 rtl:-scale-x-100" />
            </Link>
          }
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {q.isPending &&
            Array.from({ length: 8 }).map((_, i) => <li key={i} className="aspect-[4/5] animate-pulse rounded-[14px] bg-mist" />)}
          {q.isError && (
            <li className="col-span-full rounded-2xl border border-line p-6 text-sm text-ink-2">{t.featured.error}</li>
          )}
          {q.data?.map((c, i, all) => (
            <li key={c.slug} className={i === 0 ? "md:col-span-2 md:row-span-2" : i === all.length - 1 && (all.length + 3) % 4 === 3 ? "md:col-span-2" : ""}>
              <Link
                href={`/shop?cat=${c.slug}`}
                className="group relative block h-full overflow-hidden rounded-[14px] bg-mist"
              >
                <img
                  src={c.image ?? ""}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={960}
                  className={`size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${i === 0 ? "aspect-[4/5] md:aspect-auto" : i === all.length - 1 && (all.length + 3) % 4 === 3 ? "aspect-[4/5] md:aspect-[8.2/5]" : "aspect-[4/5]"}`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent p-4 pt-16 md:p-5 md:pt-20">
                  <h3 className={`font-bold text-white ${i === 0 ? "text-xl md:text-3xl" : "text-base md:text-lg"}`}>
                    {locale === "ar" ? c.nameAr : c.nameEn}
                  </h3>
                  {i === 0 && <p className="mt-1.5 hidden max-w-sm text-sm text-white/85 md:block">{locale === "ar" ? c.blurbAr : c.blurbEn}</p>}
                  <p className="mt-1 text-xs text-white/80">
                    {t.categories.items} · <span className="ltr-iso">{c.productCount}</span>
                  </p>
                </div>
                <span className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ArrowUpRight className="size-4 rtl:-scale-x-100" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
