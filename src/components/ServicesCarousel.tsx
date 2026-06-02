import * as React from "react";
import { type Icon as PhosphorIcon } from "@phosphor-icons/react";
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

  // Derive the active card purely from the live scroll position of the track:
  // whichever card's center is nearest the track viewport center is active.
  // Reading from the scroll container (not a manually tracked index) keeps the
  // mobile dots from ever desyncing from the card actually in view.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const compute = () => {
      raf = 0;
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const scrollToIdx = (idx: number) => {
    const card = cardRefs.current[idx];
    const track = trackRef.current;
    if (!card || !track) return;
    // Cards snap to center (scroll-snap-align: center), so the target scroll
    // position must center the card in the track viewport — not left-align it.
    const target =
      card.offsetLeft - track.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    const max = track.scrollWidth - track.clientWidth;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: Math.max(0, Math.min(max, target)),
      behavior: reduced ? "auto" : "smooth",
    });
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
      </div>
    </div>
  );
}

export default ServicesCarousel;
