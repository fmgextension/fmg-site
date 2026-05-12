import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  items: string[];
};

type Props = { items: ServiceItem[] };

export function ServicesCarousel({ items }: Props) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const e of entries) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          if (!best || e.intersectionRatio > best.ratio) {
            best = { idx, ratio: e.intersectionRatio };
          }
        }
        if (best && best.ratio > 0) setActive(best.idx);
      },
      { root: track, threshold: [0.5, 0.75, 1] }
    );
    cardRefs.current.forEach((c) => c && obs.observe(c));
    return () => obs.disconnect();
  }, [items.length]);

  const scrollToIdx = (idx: number) => {
    const card = cardRefs.current[idx];
    const track = trackRef.current;
    if (!card || !track) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); scrollToIdx(Math.min(items.length - 1, active + 1)); }
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIdx(Math.max(0, active - 1)); }
  };

  const atStart = active === 0;
  const atEnd = active === items.length - 1;

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="services-carousel-track no-scrollbar"
        role="region"
        aria-roledescription="carousel"
        aria-label="Services"
        tabIndex={0}
        onKeyDown={onKey}
      >
        {items.map((s, i) => {
          const Icon = s.icon;
          const counter = String(i + 1).padStart(2, "0");
          const isActive = i === active;
          return (
            <div
              key={s.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              data-idx={i}
              role="group"
              aria-label={`Service ${i + 1} of ${items.length}: ${s.title}`}
              className={`services-carousel-card ${isActive ? "is-active" : ""}`}
            >
              <div
                className="text-primary uppercase mb-6"
                style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}
              >
                {counter}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 mb-6">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3
                className="font-semibold text-foreground mb-4"
                style={{ fontSize: "clamp(22px, 2.4vw, 24px)", lineHeight: 1.15 }}
              >
                {s.title}
              </h3>
              <p
                className="text-muted-foreground mb-5"
                style={{ fontSize: 15, lineHeight: 1.5 }}
              >
                {s.desc}
              </p>
              <ul className="flex flex-col gap-2.5">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-3 text-foreground"
                    style={{ fontSize: 14, fontWeight: 500 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="services-carousel-controls">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Previous service"
          disabled={atStart}
          onClick={() => scrollToIdx(active - 1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="carousel-dots" role="tablist">
          {items.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`carousel-dot-hit ${i === active ? "is-active" : ""}`}
              aria-label={`Go to service ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => scrollToIdx(i)}
            >
              <span className="carousel-dot" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Next service"
          disabled={atEnd}
          onClick={() => scrollToIdx(active + 1)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ServicesCarousel;
