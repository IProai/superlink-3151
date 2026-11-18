import { useInViewOnce } from "../../hooks/use-in-view-once";
import { Link } from "wouter";
import { Search, LayoutList, RotateCcw, Zap } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { SectionHead } from "../site/reveal";

const ICONS = [Search, LayoutList, RotateCcw];

/** Scroll moment #2: the connector line draws across the three steps. */
export function Ordering() {
  const { t } = useLocale();
  const [lineRef, lineIn] = useInViewOnce<HTMLDivElement>("0px 0px -20% 0px");
  return (
    <section className="section-y relative overflow-hidden" aria-labelledby="ord-title">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <SectionHead
          eyebrow={t.ordering.eyebrow}
          title={t.ordering.title}
          action={
            <Link href="/quick-order" className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-600">
              <Zap className="size-4" /> {t.ordering.cta}
            </Link>
          }
        />
        <div className="relative mt-14">
          <div className="absolute inset-x-[16%] top-7 hidden h-px bg-line md:block" aria-hidden>
            <div
              ref={lineRef}
              className={`reveal-line h-full w-full origin-left bg-brand rtl:origin-right ${lineIn ? "is-in" : ""}`}
            />
          </div>
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {t.ordering.steps.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <li key={s.k} className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                  <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-brand-700 shadow-[var(--e-2)] ring-1 ring-line">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <div>
                    <p className="ltr-iso font-display text-sm font-bold text-brand-700">{s.k}</p>
                    <h3 className="mt-1 text-2xl font-bold text-ink">{s.title}</h3>
                    <p className="mt-2 text-ink-2 md:mx-auto md:max-w-xs">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
