import * as React from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useCardTilt } from "@/hooks/useCardTilt";

type InteractiveCardProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  showArrow?: boolean;
};

export function InteractiveCard({
  children,
  className,
  href,
  showArrow = true,
}: InteractiveCardProps) {
  const Comp: React.ElementType = href ? "a" : "div";
  const linkProps = href
    ? { href, ...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
    : {};

  const {
    ref: tiltRef,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    cardStyle,
    shineVars,
  } = useCardTilt({ maxTilt: 17, liftPx: 7, enabled: true });

  return (
    <Comp
      {...linkProps}
      ref={tiltRef}
      style={{ ...cardStyle, ...shineVars }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "interactive-card card-tilt-host group relative block h-full overflow-visible border border-border transition-colors duration-300 ease-out",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-[40%] h-[40%] opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-100 z-[1]"
        style={{
          background:
            "radial-gradient(circle at top left, hsl(var(--primary) / 0.15), transparent 70%)",
        }}
      />

      {showArrow && (
        <span
          aria-hidden
          className="ic-arrow pointer-events-none absolute top-5 right-5 text-[hsl(var(--primary))] opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 z-[3]"
        >
          <ArrowUpRight size={16} weight="bold" />
        </span>
      )}

      <span className="relative z-[2] block">{children}</span>

      <span
        aria-hidden
        className="ic-accent pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-[hsl(var(--primary))] transition-transform duration-[400ms] ease-out group-hover:scale-x-100 z-[3]"
      />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .interactive-card .ic-arrow { transform: none !important; transition: opacity 300ms ease-out !important; }
          .interactive-card .ic-accent { transform: scaleX(1) !important; opacity: 0; transition: opacity 300ms ease-out !important; }
          .interactive-card:hover .ic-accent { opacity: 1; }
        }
      `}</style>
    </Comp>
  );
}

export default InteractiveCard;
