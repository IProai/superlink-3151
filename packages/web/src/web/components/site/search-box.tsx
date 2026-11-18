import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2, Search, ArrowUpRight } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { useSearch } from "../../queries/catalog";
import { useDebounced } from "../../hooks/use-debounced";
import { cn } from "../../lib/utils";

interface SearchBoxProps {
  size?: "lg" | "md";
  className?: string;
  focusOnMount?: boolean;
  onNavigate?: () => void;
}

/** Global catalog search — EN/AR, SKU, aliases; zero-result recovery via categories. */
export function SearchBox({ size = "md", className, focusOnMount, onNavigate }: SearchBoxProps) {
  const { t, locale, money } = useLocale();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const dq = useDebounced(q);
  const res = useSearch(dq);
  const [, navigate] = useLocation();
  const listId = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focusOnMount) input.current?.focus();
  }, [focusOnMount]);
  const items = res.data?.items ?? [];
  const showPanel = open && dq.trim().length >= 2;

  const go = (href: string) => {
    setOpen(false);
    onNavigate?.();
    navigate(href);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = items[active];
      go(it ? `/shop?sku=${encodeURIComponent(it.sku)}` : `/shop?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div
      ref={wrap}
      className={cn("relative", className)}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label className="sr-only" htmlFor={`${listId}-input`}>
        {t.hero.searchLabel}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-full border border-line bg-white shadow-[var(--e-2)] transition-shadow focus-within:border-brand focus-within:shadow-[var(--e-3)]",
          size === "lg" ? "h-14 ps-5 pe-2 md:h-16" : "h-11 ps-4 pe-1.5",
        )}
      >
        <Search className={cn("shrink-0 text-ink-2", size === "lg" ? "size-5" : "size-4")} aria-hidden />
        <input
          ref={input}
          id={`${listId}-input`}
          type="search"
          aria-label={t.hero.searchLabel}
          aria-controls={listId}
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={t.nav.searchPlaceholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-ink-2/70",
            size === "lg" ? "text-base md:text-lg" : "text-sm",
          )}
        />
        {res.isFetching && <Loader2 className="size-4 animate-spin text-brand" aria-label={t.search.searching} />}
        {size === "lg" && (
          <button
            type="button"
            onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)}
            className="hidden h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-flex md:h-12"
          >
            {t.nav.shop}
          </button>
        )}
      </div>

      {showPanel && (
        <div
          id={listId}
          aria-live="polite"
          className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-white text-start shadow-[var(--e-2)]"
        >
          {res.isError && <p className="p-4 text-sm text-danger">{t.search.error}</p>}
          {!res.isError && items.length > 0 && (
            <ul className="max-h-[60vh] overflow-auto py-1.5">
              {items.map((p, i) => {
                const u = p.units[0];
                return (
                  <li key={p.id} id={`${listId}-${i}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      aria-current={i === active ? "true" : undefined}
                      onClick={() => go(`/shop?sku=${encodeURIComponent(p.sku)}`)}
                      className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-start", i === active && "bg-brand-50")}
                    >
                      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-mist">
                        {p.image && <img src={p.image} alt="" className="size-full object-cover" loading="lazy" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{locale === "ar" ? p.nameAr : p.nameEn}</span>
                        <span className="ltr-iso block text-xs text-ink-2">
                          {p.sku} · {p.brand}
                        </span>
                      </span>
                      {u?.priceMinor != null && (
                        <span className="ltr-iso shrink-0 text-sm font-semibold text-ink">{money(u.priceMinor)}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {!res.isError && res.data && items.length === 0 && !res.isFetching && (
            <div className="p-4">
              <p className="text-sm text-ink">
                {t.search.noResults} <strong>“{dq}”</strong>
              </p>
              <p className="mt-1 text-xs text-ink-2">{t.search.tryCategory}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {res.data.suggestions.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/shop?cat=${c.slug}`}
                    onClick={() => onNavigate?.()}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-brand hover:text-brand-700"
                  >
                    {locale === "ar" ? c.nameAr : c.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => go(`/shop?q=${encodeURIComponent(q)}`)}
              className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-sm font-semibold text-brand-700 hover:bg-mist"
            >
              {t.search.viewAll}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
