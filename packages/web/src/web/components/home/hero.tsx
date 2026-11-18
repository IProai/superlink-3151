import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, FileText, Zap } from "lucide-react";
import { useLocale } from "../../i18n/locale";
import { usePrefersReducedMotion } from "../../hooks/use-reduced-motion";
import { SearchBox } from "../site/search-box";

/** Native frame of the hero clip (1920×1080, 16:9). Every hero layer uses the same "cover" box so hotspot % = frame %. */
const FRAME = 16 / 9;
const coverBox: React.CSSProperties = {
  width: `max(100cqw, calc(100cqh * ${FRAME}))`,
  height: `max(100cqh, calc(100cqw / ${FRAME}))`,
  transform: "translate3d(calc(-50% + var(--hx, 0px)), calc(-50% + var(--hy, 0px)), 0) scale(var(--hs, 1))",
};
const parallax: React.CSSProperties = { transform: "translate3d(var(--hx, 0px), var(--hy, 0px), 0) scale(var(--hs, 1))" };
const COVER = "absolute left-1/2 top-1/2 [transition:transform_600ms_cubic-bezier(0.2,0.7,0.2,1)]";

/** Final-frame hotspots, in frame % (x from the inline-start edge — RTL media is mirrored, so the same numbers hold). */
const SPOTS = [
  { key: "filing", cat: "filing", x: 56, y: 37, side: "end" },
  { key: "writing", cat: "writing", x: 73.5, y: 44, side: "end" },
  { key: "desk", cat: "desk", x: 58, y: 63, side: "end" },
  { key: "toner", cat: "toner", x: 84, y: 31, side: "start" },
  { key: "paper", cat: "paper", x: 86, y: 49, side: "start" },
] as const;

/**
 * Video plays once and is then replaced by a static still of its final frame (no loop); plays only while visible;
 * mobile gets the 540p source. Reduced motion: no video — the still is shown and the hero is "landed" at once (AT-04).
 *
 * GPU safety: the <video> itself is never CSS-transformed (no mirroring, no parallax, no will-change). RTL uses
 * pre-mirrored encodes; the parallax layer only ever holds <img>s, and parallax is enabled only once the still is up.
 * `onLanded` fires just before the clip ends (drives headline accent + hotspots); `onStill` once the video is gone.
 */
function HeroMedia({ onLanded, onStill }: { onLanded: () => void; onStill: () => void }) {
  const reduced = usePrefersReducedMotion();
  const { dir } = useLocale();
  const rtl = dir === "rtl";
  const ref = useRef<HTMLVideoElement>(null);
  const [small, setSmall] = useState(() => window.matchMedia("(max-width: 767.98px)").matches);
  // near: start fetching the end still; ended: clip finished (or failed); stillReady: still decoded → drop the video.
  const [near, setNear] = useState(false);
  const [ended, setEnded] = useState(false);
  const [stillReady, setStillReady] = useState(false);
  const cbs = useRef({ onLanded, onStill });
  cbs.current = { onLanded, onStill };

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767.98px)");
    const on = () => setSmall(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const showVideo = !reduced && !(ended && stillReady);
  const showStill = reduced || near || ended;

  useEffect(() => {
    if (reduced) cbs.current.onLanded();
  }, [reduced]);
  useEffect(() => {
    if (!showVideo) cbs.current.onStill();
  }, [showVideo]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !showVideo) return;
    const play = () => {
      if (!v.ended) v.play().catch(() => {});
    };
    const land = () => {
      setNear(true);
      setEnded(true);
      cbs.current.onLanded();
    };
    const onTime = () => {
      if (!v.duration) return;
      if (v.currentTime >= v.duration - 2.5) setNear(true);
      // Land slightly before the last frame so the accent finishes with the camera move.
      if (v.currentTime >= v.duration - 0.6) cbs.current.onLanded();
    };
    v.addEventListener("ended", land);
    v.addEventListener("error", land);
    v.addEventListener("timeupdate", onTime);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) play();
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    const vis = () => (document.hidden ? v.pause() : play());
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      v.removeEventListener("ended", land);
      v.removeEventListener("error", land);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [showVideo, small, rtl]);

  const poster = small ? "/images/hero-poster-sm.jpg" : "/images/hero-poster.jpg";
  const still = small ? "/images/hero-end-sm.jpg" : "/images/hero-end.jpg";
  const sfx = rtl ? "-rtl" : "";
  // Images are mirrored with CSS in RTL (safe for <img>); the video uses pre-flipped files instead.
  const img = "absolute inset-0 size-full object-cover rtl:-scale-x-100";

  return (
    <div className="absolute inset-x-0 top-0 -z-10 h-[86vw] overflow-hidden bg-mist md:inset-0 md:h-auto" aria-hidden>
      {/* object-cover (centred) on an inset-0 box == the centred cover box the hotspots use; only the parallax transform is shared. */}
      <div className="absolute inset-0 [transition:transform_600ms_cubic-bezier(0.2,0.7,0.2,1)]" style={parallax}>
        {!reduced && !stillReady && <img src={poster} alt="" fetchPriority="high" decoding="async" className={img} />}
        {showStill && (
          <img
            src={still}
            alt=""
            decoding="async"
            fetchPriority={reduced ? "high" : "low"}
            className={img}
            onLoad={() => setStillReady(true)}
            onError={() => setStillReady(true)}
          />
        )}
      </div>
      {showVideo && (
        <video
          key={`${small ? "sm" : "lg"}-${dir}`}
          ref={ref}
          className="absolute inset-0 size-full object-cover"
          muted
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
        >
          {small ? (
            <source src={`/videos/hero-540${sfx}.mp4`} type="video/mp4" />
          ) : (
            <>
              <source src={`/videos/hero-1080${sfx}.webm`} type="video/webm" />
              <source src={`/videos/hero-1080${sfx}.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      )}
      {/* Legibility scrim — follows reading direction */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.9)_34%,rgb(255_255_255/0.35)_62%,rgb(255_255_255/0)_85%)] rtl:bg-[linear-gradient(to_left,rgb(255_255_255/0.97)_0%,rgb(255_255_255/0.9)_34%,rgb(255_255_255/0.35)_62%,rgb(255_255_255/0)_85%)] max-md:bg-[linear-gradient(to_bottom,rgb(255_255_255/0)_0%,rgb(255_255_255/0)_50%,rgb(255_255_255/0.85)_80%,#fff_100%)] max-md:rtl:bg-[linear-gradient(to_bottom,rgb(255_255_255/0)_0%,rgb(255_255_255/0)_50%,rgb(255_255_255/0.85)_80%,#fff_100%)]" />
      <div className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-b from-transparent to-white md:block" />
    </div>
  );
}

/** Shoppable dots on the final frame. Desktop (xl+) only — on smaller screens the copy covers most of the desk. */
function HeroSpots({ on }: { on: boolean }) {
  const { t } = useLocale();
  // Mounted only once the clip has landed and web fonts are settled, so late text reflow can never shift the dots (CLS).
  const [fonts, setFonts] = useState(false);
  useEffect(() => {
    let live = true;
    document.fonts.ready.then(() => live && setFonts(true));
    return () => {
      live = false;
    };
  }, []);
  if (!on || !fonts) return null;
  return (
    <nav
      className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden [container-type:size] xl:block"
      aria-label={t.hero.spotsLabel}
    >
      <div className={COVER} style={coverBox}>
        {SPOTS.map((s, i) => (
          <Link
            key={s.key}
            href={`/shop?cat=${s.cat}`}
            className="hero-spot group pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none rtl:translate-x-1/2"
            style={{ insetInlineStart: `${s.x}%`, top: `${s.y}%`, animationDelay: `${120 + i * 110}ms` }}
          >
            <span className="relative grid size-8 place-items-center rounded-full bg-white/85 shadow-[0_2px_10px_rgb(11_31_42/0.18)] ring-1 ring-white backdrop-blur transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-brand-700">
              <span className="hero-spot-pulse absolute inset-0 rounded-full bg-brand/35" aria-hidden />
              <span className="relative size-2.5 rounded-full bg-brand-600" aria-hidden />
            </span>
            <span
              className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-ink invisible opacity-0 shadow-[var(--e-3)] transition-[opacity,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 ${
                s.side === "end" ? "start-full ms-2.5" : "end-full me-2.5"
              }`}
            >
              {t.hero.spots[s.key]}{" "}
              <span className="text-brand-700">
                {t.hero.spotShop}
                <ArrowRight className="ms-0.5 inline size-3.5 rtl:-scale-x-100" aria-hidden />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

/**
 * Subtle pointer parallax on the hero still + hotspots (≤ 8px). Desktop fine-pointer only; off under reduced motion.
 * Only enabled once the video has been swapped for the still, so a playing <video> is never transformed.
 */
function useHeroParallax(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !enabled) return;
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    let active = false;
    // The 3% zoom (hides edges while shifting) only eases in while the pointer is over the hero, so the
    // video → still swap itself is pixel-identical.
    const apply = () => {
      raf = 0;
      el.style.setProperty("--hx", `${(-nx * 8).toFixed(2)}px`);
      el.style.setProperty("--hy", `${(-ny * 6).toFixed(2)}px`);
      el.style.setProperty("--hs", active ? "1.03" : "1");
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      active = true;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const leave = () => {
      nx = 0;
      ny = 0;
      active = false;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      for (const k of ["--hx", "--hy", "--hs"]) el.style.removeProperty(k);
    };
  }, [ref, reduced, enabled]);
}

export function Hero() {
  const { t } = useLocale();
  const [landed, setLanded] = useState(false);
  const [still, setStill] = useState(false);
  const land = useCallback(() => setLanded(true), []);
  const toStill = useCallback(() => setStill(true), []);
  const section = useRef<HTMLElement>(null);
  useHeroParallax(section, still);
  return (
    <section
      ref={section}
      data-landed={landed || undefined}
      className="relative isolate flex min-h-[min(100svh,58rem)] items-center pt-16 md:pt-[4.5rem]"
      aria-labelledby="hero-title"
    >
      <HeroMedia onLanded={land} onStill={toStill} />
      <div className="container-x pb-16 pt-[66vw] md:pb-24 md:pt-16">
        <div className="max-w-[40rem]">
          <p className="hero-eyebrow eyebrow inline-flex items-center gap-2 rounded-full bg-white/80 py-1.5 pe-3.5 ps-2.5 shadow-[var(--e-1)] backdrop-blur">
            <span className="hero-dot size-1.5 rounded-full bg-brand" aria-hidden />
            {t.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-rise mt-5 text-[clamp(2.4rem,5.6vw,4.75rem)] font-bold text-ink">
            {t.hero.title1} {t.hero.title2}
            <span className="hero-accent text-brand-600">{t.hero.title3}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-2 md:text-lg">{t.hero.lede}</p>

          <div className="mt-8 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap">
            <Link
              href="/shop"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {t.hero.shop}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href="/quick-order"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition-[background-color,box-shadow] hover:bg-brand-600 hover:shadow-[var(--e-3)]"
            >
              <Zap className="size-4" aria-hidden /> {t.hero.quickOrder}
            </Link>
            <Link
              href="/rfq"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/90 px-6 py-3.5 font-semibold text-ink backdrop-blur transition-colors hover:border-ink"
            >
              <FileText className="size-4" aria-hidden /> {t.hero.rfq}
            </Link>
          </div>

          <SearchBox size="lg" className="mt-8 max-w-xl" />
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2">
            <span>{t.hero.popular}</span>
            {t.hero.popularTerms.map((p) => (
              <Link key={p} href={`/shop?q=${encodeURIComponent(p)}`} className="font-medium text-ink underline decoration-brand/50 underline-offset-4 hover:decoration-brand">
                {p}
              </Link>
            ))}
          </p>

          <dl className="mt-10 flex gap-8 border-t border-ink/10 pt-6 md:gap-12">
            {[
              ["24+", t.hero.stat1],
              ["8", t.hero.stat2],
              ["EN · ع", t.hero.stat3],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="ltr-iso font-display text-3xl font-bold text-ink">{n}</dd>
                <dd className="text-xs text-ink-2 md:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {/* After the copy in DOM order so CTAs + search come first for keyboard users. */}
      <HeroSpots on={landed} />
    </section>
  );
}
