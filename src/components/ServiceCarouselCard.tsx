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
  // Tilt + shine are enabled for every card independently. The hook still
  // gates internally on hover-capable pointers ((hover: hover)) and reduced
  // motion, so each card responds purely to its own pointer enter/move/leave —
  // not to whether it's the scroll-centered card. `isActive` only drives the
  // mobile dots and centered-card emphasis styling, never the tilt gate.
  const {
    ref: tiltRef,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    cardStyle,
    shineVars,
    reduced,
  } = useCardTilt({ maxTilt: 17, liftPx: 7, enabled: true });

  // Single source for each face's content — rendered once in the hidden in-flow
  // sizer (which establishes the card's height = the taller of the two faces)
  // and once in the real, visible flip face. Keeping them identical guarantees
  // the absolute faces always match the measured box.
  const frontContent = (
    <>
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
        className="card-flip-hint text-primary uppercase mt-6"
        style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em" }}
      >
        <span className="card-flip-hint-hover">Click for details</span>
        <span className="card-flip-hint-touch">Tap for details</span>
      </p>
    </>
  );

  const backContent = (
    <>
      {/* eyebrow + title + bullets as one block, vertically centered
          in the space above the pinned return hint so leftover space
          splits evenly top/bottom. Bullets keep natural tight spacing. */}
      <div className="flex flex-1 flex-col justify-center">
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
        <ul className="flex flex-col gap-2.5">
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
      <p
        className="card-flip-hint text-primary uppercase mt-6"
        style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em" }}
      >
        <span className="card-flip-hint-hover">Click to return</span>
        <span className="card-flip-hint-touch">Tap to return</span>
      </p>
    </>
  );

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
          {/* Sizer: in-flow, hidden. Both faces stacked in one grid cell so the
              card sizes to the taller face — and kept OUT of the 3D/flip layer so
              the flip's preserve-3d is never flattened (the old grid-on-preserve-3d
              was the source of the center seam). */}
          <div className="card-flip-sizer" aria-hidden="true">
            <div className="card-surface">{frontContent}</div>
            <div className="card-surface">{backContent}</div>
          </div>

          {/* Flip layer: absolute overlay on the sizer, owns the rotateY flip on
              its own transform context (separate from the tilt above). Faces are
              absolute + inset:0 so each is anchored and fills the box. */}
          <div
            className={`card-flip ${flipped ? "is-flipped" : ""} ${reduced ? "is-reduced" : ""}`}
          >
            <div className="card-flip-face card-flip-face-front card-surface">
              {frontContent}
            </div>
            <div className="card-flip-face card-flip-face-back card-surface">
              {backContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
