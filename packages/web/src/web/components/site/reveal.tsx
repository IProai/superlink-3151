import { cn } from "../../lib/utils";
import { useInViewOnce } from "../../hooks/use-in-view-once";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section";
}

/**
 * Scroll reveal (fade + 22px rise, 550ms). CSS transition driven by IntersectionObserver,
 * so no animation runtime ships. Static under reduced motion via the .reveal media query.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const [ref, seen] = useInViewOnce<HTMLElement>();
  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn("reveal", seen && "is-in", className)}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "start",
  action,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "start" | "center";
  action?: React.ReactNode;
}) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      }
    >
      <div className={align === "center" ? "" : "max-w-2xl"}>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold text-ink">{title}</h2>
        {lede && <p className="mt-4 text-lg text-ink-2">{lede}</p>}
      </div>
      {action}
    </Reveal>
  );
}
