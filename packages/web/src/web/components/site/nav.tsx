import { useEffect, useState } from "react";
import { Link } from "wouter";
import { FileText, Menu, ShoppingBag, User, X, Zap, Search } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { cn } from "../../lib/utils";
import { Logo } from "./logo";
import { SearchBox } from "./search-box";

export function Nav() {
  const { t, toggle, locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links = [
    { href: "/shop", label: t.nav.shop },
    { href: "/#categories", label: t.nav.categories },
    { href: "/#solutions", label: t.nav.solutions },
    { href: "/#company", label: t.nav.about },
  ];

  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded bg-ink px-3 py-2 text-white focus:not-sr-only focus:fixed focus:start-3 focus:top-3">
        {t.nav.skip}
      </a>
      <header
        className={cn(
          "glass fixed inset-x-0 top-0 z-40 border-b transition-[border-color,box-shadow] duration-300",
          scrolled ? "border-line shadow-[var(--e-1)]" : "border-transparent",
        )}
      >
        <div className="container-x flex h-16 items-center gap-4 md:h-[4.5rem]">
          <Logo />
          <nav aria-label="Primary" className="ms-4 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-mist hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="ms-auto hidden w-full max-w-sm 2xl:block">
            <SearchBox />
          </div>

          <div className="ms-auto flex items-center gap-1.5 2xl:ms-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full text-ink hover:bg-mist 2xl:hidden"
              aria-label={t.hero.searchLabel}
              aria-expanded={searchOpen}
            >
              <Search className="size-5" />
            </button>
            <Link
              href="/quick-order"
              className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 text-sm font-semibold text-white transition-[background-color,box-shadow] hover:bg-brand-600 hover:shadow-[var(--e-3)] md:inline-flex"
            >
              <Zap className="size-4" aria-hidden /> {t.nav.quickOrder}
            </Link>
            <Link
              href="/rfq"
              className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-ink xl:inline-flex"
            >
              <FileText className="size-4" aria-hidden /> {t.nav.rfq}
            </Link>
            <LangSwitch locale={locale} label={t.nav.switchLabel} onToggle={toggle} />
            <Link href="/shop" aria-label={t.nav.account} className="hidden size-10 place-items-center rounded-full text-ink hover:bg-mist sm:grid">
              <User className="size-5" />
            </Link>
            <Link href="/shop" aria-label={`${t.nav.basket} (0)`} className="relative grid size-10 place-items-center rounded-full text-ink hover:bg-mist">
              <ShoppingBag className="size-5" />
              <span className="ltr-iso absolute end-1 top-1 grid size-4 place-items-center rounded-full bg-ink text-[0.6rem] font-bold text-white">0</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full text-ink hover:bg-mist lg:hidden"
              aria-label={t.nav.menu}
              aria-expanded={open}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="container-x pb-3 2xl:hidden">
            <SearchBox focusOnMount onNavigate={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      {open && (
        <dialog open className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 lg:hidden" aria-modal="true" aria-label={t.nav.menu}>
          <button type="button" aria-label={t.nav.close} className="absolute inset-0 bg-ink/30" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 end-0 flex w-[min(22rem,88vw)] flex-col bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo compact />
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-mist" aria-label={t.nav.close}>
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-8 flex flex-col">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-4 text-lg font-semibold text-ink">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto grid gap-2.5">
              <Link href="/quick-order" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white">
                <Zap className="size-4" /> {t.nav.quickOrder}
              </Link>
              <Link href="/rfq" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink font-semibold text-ink">
                <FileText className="size-4" /> {t.nav.rfq}
              </Link>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

/** Segmented EN | ع switch: both languages always visible in their own script, current one filled. */
function LangSwitch({ locale, label, onToggle }: { locale: "en" | "ar"; label: string; onToggle: () => void }) {
  const seg = "grid h-full min-w-8 place-items-center rounded-full px-2 transition-colors duration-200";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      dir="ltr"
      className="group inline-flex h-9 items-center rounded-full border border-line bg-white p-0.5 text-[0.8rem] font-semibold shadow-[var(--e-1)] outline-none transition-colors hover:border-ink/30 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
    >
      <span lang="en" aria-hidden className={cn(seg, "tracking-wide", locale === "en" ? "bg-ink text-white" : "text-ink-2 group-hover:text-ink")}>
        EN
      </span>
      <span lang="ar" aria-hidden className={cn(seg, "text-base font-bold leading-none", locale === "ar" ? "bg-ink text-white" : "text-ink-2 group-hover:text-ink")}>
        ع
      </span>
    </button>
  );
}
