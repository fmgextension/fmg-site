import * as React from "react";
import { type Icon as PhosphorIcon } from "@phosphor-icons/react";
import { useCardTilt } from "@/hooks/useCardTilt";
import type { ServiceItem } from "@/components/ServicesCarousel";

type ServiceCarouselCardProps = {
  service: ServiceItem;
  index: number;
  counter: string;
  isActive: boolean;
  flipped: boolean;
  onToggleFlip: () => void;
  cardRef: (el: HTMLDivElement | null) => void;
};

export function ServiceCarouselCard({
  service,
  index,
  counter,
  isActive,
  flipped,
  onToggleFlip,
  cardRef,
}: ServiceCarouselCardProps) {
  const Icon = service.icon;
  const {
    ref: tiltRef,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    cardStyle,
    shineVars,
    reduced,
  } = useCardTilt({ maxTilt: 17, liftPx: 7, enabled: isActive });

  return (
    <div ref={cardRef} data-idx={index} className="services-carousel-perspective">
      <div
        role="group"
        aria-label={`Service ${index + 1}: ${service.title}${flipped ? ", showing details" : ""}`}
        className={`services-carousel-card ${isActive ? "is-active" : ""}`}
      >
        <div
          ref={tiltRef}
          className="card-tilt-host"
          style={{ ...cardStyle, ...shineVars }}
          onPointerEnter={onPointerEnter}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFlip();
          }}
        >
          <div
            className={`card-flip-inner ${flipped ? "is-flipped" : ""} ${reduced ? "is-reduced" : ""}`}
          >
            <div className="card-flip-face card-flip-face-front card-surface">
              <div
                className="text-primary uppercase mb-6"
                style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}
              >
                {counter}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 mb-6">
                <Icon size={24} weight="bold" className="text-primary" />
              </div>
              <h3
                className="font-semibold text-foreground mb-4"
                style={{ fontSize: "clamp(22px, 2.4vw, 24px)", lineHeight: 1.15 }}
              >
                {service.title}
              </h3>
              <p
                className="text-muted-foreground flex-1"
                style={{ fontSize: 15, lineHeight: 1.5 }}
              >
                {service.desc}
              </p>
              <p
                className="text-xs text-muted-foreground mt-6 uppercase tracking-wider"
                style={{ fontWeight: 500 }}
              >
                {flipped ? "Tap to return" : "Tap for details"}
              </p>
            </div>

            <div className="card-flip-face card-flip-face-back card-surface">
              <div
                className="text-primary uppercase mb-4"
                style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}
              >
                How it works
              </div>
              <h3
                className="font-semibold text-foreground mb-5"
                style={{ fontSize: 20, lineHeight: 1.15 }}
              >
                {service.title}
              </h3>
              <ul className="flex flex-col gap-2.5 flex-1">
                {service.items.map((it) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
