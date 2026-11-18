import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "../../i18n/dict";
import { useLocale } from "../../i18n/locale";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-mist pb-24 pt-16 md:pb-10">
      <div className="container-x grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <img src="/brand/logo-cyan.png" alt="Super Link" width={520} height={377} loading="lazy" className="h-14 w-auto" />
          <p className="mt-5 max-w-xs text-sm text-ink-2">{t.footer.tagline}</p>
        </div>
        <nav aria-label={t.footer.shop}>
          <p className="text-sm font-semibold text-ink">{t.footer.shop}</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-2">
            <li><Link href="/quick-order" className="hover:text-ink">{t.footer.links.quick}</Link></li>
            <li><Link href="/rfq" className="hover:text-ink">{t.footer.links.rfq}</Link></li>
            <li><a href="/#categories" className="hover:text-ink">{t.footer.links.cats}</a></li>
          </ul>
        </nav>
        <nav aria-label={t.footer.company}>
          <p className="text-sm font-semibold text-ink">{t.footer.company}</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-ink-2">
            <li><a href="/#company" className="hover:text-ink">{t.footer.links.about}</a></li>
            <li><a href="/#solutions" className="hover:text-ink">{t.footer.links.solutions}</a></li>
            <li><Link href="/shop" className="hover:text-ink">{t.footer.links.account}</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-sm font-semibold text-ink">{t.footer.contact}</p>
          <ul className="mt-4 grid gap-3 text-sm text-ink-2">
            {CONTACT.phones.map((p, i) => (
              <li key={p}>
                <a href={`tel:${CONTACT.tel[i]}`} className="inline-flex items-center gap-2 hover:text-ink">
                  <Phone className="size-4 text-brand-700" aria-hidden /> <span className="ltr-iso">{p}</span>
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-ink">
                <Mail className="size-4 text-brand-700" aria-hidden /> <span className="ltr-iso">{CONTACT.email}</span>
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-700" aria-hidden /> {t.footer.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-2 md:flex-row md:justify-between">
        <p>
          © <span className="ltr-iso">{year}</span> {t.meta.company}. {t.footer.rights}
        </p>
        <p>{t.footer.vatNote}</p>
      </div>
    </footer>
  );
}

/** Thumb-reach quick actions on phones (AT-04: quick order reachable immediately). */
export function MobileActions() {
  const { t } = useLocale();
  return (
    <div className="glass fixed inset-x-0 bottom-0 z-30 border-t border-line pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-3 gap-2 px-3 py-2.5">
        <Link href="/shop" className="grid h-11 place-items-center rounded-full border border-line bg-white text-sm font-semibold text-ink">{t.hero.shop.split(" ")[0]}</Link>
        <Link href="/quick-order" className="grid h-11 place-items-center rounded-full bg-brand text-sm font-semibold text-white">{t.nav.quickOrder}</Link>
        <Link href="/rfq" className="grid h-11 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{t.nav.rfq}</Link>
      </div>
    </div>
  );
}
