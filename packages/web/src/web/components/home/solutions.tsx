import { Building2, GraduationCap, Landmark, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useLocale } from "../../i18n/locale";
import { SectionHead } from "../site/reveal";

export function Solutions() {
  const { t } = useLocale();
  const items = [
    { key: "office", icon: Building2, img: "/images/solutions/office.webp", ...t.solutions.office },
    { key: "school", icon: GraduationCap, img: "/images/solutions/school.webp", ...t.solutions.school },
    { key: "institution", icon: Landmark, img: "/images/solutions/institution.webp", ...t.solutions.institution },
  ];
  return (
    <section id="solutions" className="section-y bg-mist" aria-labelledby="sol-title">
      <div className="container-x">
        <SectionHead eyebrow={t.solutions.eyebrow} title={t.solutions.title} />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map(({ key, icon: Icon, img, title, body }) => (
            <article key={key} className="group flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[var(--e-1)] ring-1 ring-line">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={img} alt="" loading="lazy" decoding="async" width={1200} height={900} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 flex-1 text-ink-2">{body}</p>
                <Link href="/rfq" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
                  {t.solutions.cta} <ArrowRight className="size-4 rtl:-scale-x-100" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
