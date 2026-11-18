import { Link } from "wouter";
import { useLocale } from "../../i18n/locale";
import { Nav } from "./nav";
import { Footer, MobileActions } from "./footer";

type Kind = "shop" | "quick" | "rfq";

export function PlaceholderPage({ kind }: { kind: Kind }) {
  const { t } = useLocale();
  const title = kind === "shop" ? t.placeholder.shopTitle : kind === "quick" ? t.placeholder.quickTitle : t.placeholder.rfqTitle;
  const body = kind === "shop" ? t.placeholder.shopBody : kind === "quick" ? t.placeholder.quickBody : t.placeholder.rfqBody;
  return (
    <>
      <Nav />
      <main id="main" className="container-x flex min-h-[70vh] flex-col items-start justify-center pb-24 pt-36">
        <span className="mb-5 inline-flex items-center rounded-full border border-warn/40 bg-warn/10 px-3 py-1 text-xs font-semibold text-ink">
          {t.placeholder.badge}
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{body}</p>
        <Link href="/" className="mt-10 inline-flex h-12 items-center rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-600">
          {t.placeholder.back}
        </Link>
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}
