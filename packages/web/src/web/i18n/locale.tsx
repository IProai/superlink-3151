import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, type Dict, type Locale } from "./dict";

const KEY = "slst.locale";

function initialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const q = new URLSearchParams(window.location.search).get("lang");
  if (q === "ar" || q === "en") return q;
  const stored = window.localStorage.getItem(KEY);
  return stored === "ar" ? "ar" : "en";
}

interface LocaleCtx {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dict;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  /** Format minor units (fils) as a price, always with Western digits and LTR-safe. */
  money: (minor: number, currency?: string) => string;
}

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(KEY, locale);
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang") && url.searchParams.get("lang") !== locale) {
      url.searchParams.set("lang", locale);
      window.history.replaceState(null, "", url);
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(() => setLocaleState((l) => (l === "en" ? "ar" : "en")), []);

  const value = useMemo<LocaleCtx>(() => {
    const nf = new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-AE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return {
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      t: dictionaries[locale],
      setLocale,
      toggle,
      money: (minor, currency = "AED") => `${currency} ${nf.format(minor / 100)}`,
    };
  }, [locale, setLocale, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLocale must be used inside <LocaleProvider>");
  return v;
}
