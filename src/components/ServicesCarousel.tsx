import * as React from "react";
import { CaretLeft, CaretRight, type Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ServiceCarouselCard } from "@/components/ServiceCarouselCard";

export type ServiceItem = {
  icon: PhosphorIcon;
  title: string;
  desc: string;
  items: string[];
};

type Props = { items: ServiceItem[] };

export function ServicesCarousel({ items }: Props) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = React.useState(0);
  const [flipped, setFlipped] = React.useState<Record<number, boolean>>({});

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
      { root: track, threshold: [0.5, 0.75, 1] },
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
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIdx(Math.min(items.length - 1, active + 1));
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIdx(Math.max(0, active - 1));
    }
  };

  const toggleFlip = (idx: number) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
          const counter = String(i + 1).padStart(2, "0");
          return (
            <ServiceCarouselCard
              key={s.title}
              service={s}
              index={i}
              counter={counter}
              isActive={i === active}
              flipped={!!flipped[i]}
              onToggleFlip={() => toggleFlip(i)}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
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
          <CaretLeft size={20} weight="bold" />
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
          <CaretRight size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}

export default ServicesCarousel;
