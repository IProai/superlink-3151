import { Users, BadgePercent, FileCheck2, Receipt, Boxes, Headphones } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { SectionHead } from "../site/reveal";

const ICONS = [Users, BadgePercent, FileCheck2, Receipt, Boxes, Headphones];

export function Benefits() {
  const { t } = useLocale();
  return (
    <section className="section-y" aria-labelledby="ben-title">
      <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead eyebrow={t.benefits.eyebrow} title={t.benefits.title} />
          <div className="mt-8 hidden overflow-hidden rounded-[22px] lg:block">
            <img src="/images/hero-end.jpg" alt="" loading="lazy" decoding="async" width={1920} height={1080} className="aspect-[4/3] w-full object-cover" />
          </div>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[22px] bg-line ring-1 ring-line sm:grid-cols-2">
          {t.benefits.items.map((b, i) => {
            const Icon = ICONS[i];
            return (
              <li key={b.title} className="bg-white p-6 md:p-8">
                <Icon className="size-6 text-brand" aria-hidden />
                <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal text-ink">{b.title}</h3>
                <p className="mt-2 text-ink-2">{b.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
