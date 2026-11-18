import { Link } from "wouter";
import { Phone, FileText } from "lucide-react";
import { BRANDS, CONTACT } from "../../i18n/dict";
import { useLocale } from "../../i18n/locale";
import { SectionHead } from "../site/reveal";

export function Company() {
  const { t } = useLocale();
  return (
    <section id="company" className="section-y border-t border-line" aria-labelledby="co-title">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHead eyebrow={t.company.eyebrow} title={t.company.title} />
            <p className="mt-6 text-lg text-ink-2">{t.company.body}</p>
            <div className="mt-8">
              <p className="text-sm font-semibold text-ink">{t.company.valuesLabel}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.company.values.map((v) => (
                  <li key={v} className="rounded-full bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4 self-end">
            {[
              [t.company.missionLabel, t.company.mission],
              [t.company.visionLabel, t.company.vision],
            ].map(([k, v]) => (
              <figure key={k} className="rounded-[22px] border border-line p-6 md:p-8">
                <figcaption className="eyebrow">{k}</figcaption>
                <blockquote className="mt-3 font-display text-xl font-semibold leading-snug text-ink md:text-2xl">{v}</blockquote>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-24">
          <p className="text-sm font-semibold text-ink">{t.company.brandsLabel}</p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-4" dir="ltr">
            {BRANDS.map((b) => (
              <li key={b} className="font-display text-lg font-semibold text-ink/45 transition-colors hover:text-ink md:text-xl">
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-2">{t.company.brandsNote}</p>
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  const { t } = useLocale();
  return (
    <section className="container-x pb-[clamp(4rem,9vw,8rem)]">
      <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-12 text-white md:px-14 md:py-16">
        <div className="absolute -end-24 -top-24 size-80 rounded-full bg-brand/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 start-1/3 size-72 rounded-full bg-brand/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-white">{t.cta.title}</h2>
            <p className="mt-4 text-white/75">{t.cta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/rfq" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-600">
              <FileText className="size-4" /> {t.cta.primary}
            </Link>
            <a href={`tel:${CONTACT.tel[0]}`} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-6 font-semibold text-white hover:border-white">
              <Phone className="size-4" /> <span className="ltr-iso">{CONTACT.phones[0]}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
