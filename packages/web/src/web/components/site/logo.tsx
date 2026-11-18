import { Link } from "wouter";
import { useLocale } from "../../i18n/locale";

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t, locale } = useLocale();
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={t.meta.company}>
      <img src="/brand/logo-cyan.png" alt="Super Link" width={520} height={377} className="h-10 w-auto md:h-11" />
      {!compact && (
        <span className="hidden border-s border-line ps-3 text-[0.7rem] font-semibold leading-tight text-ink-2 xl:block">
          {locale === "ar" ? "سوبر لينك لتجارة القرطاسية" : "Stationary Trading"}
          <br />
          {locale === "ar" ? "ذ.م.م · الإمارات" : "LLC · UAE"}
        </span>
      )}
    </Link>
  );
}
