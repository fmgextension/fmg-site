import { useReducedMotion } from "framer-motion";
import { HeroStatRoll } from "@/components/HeroStatRoll";
import { useViewportInView } from "@/hooks/useViewportInView";

const STATS = [
  { target: 25, suffix: "+", l: "Businesses Served" },
  { target: 500, suffix: "+", l: "Calls Handled Daily" },
  { target: 4.9, suffix: "★", decimals: 1 as const, l: "Average Review Score" },
];

type HeroStatsRowProps = {
  /** Hero scroll mode — stats wait for row visibility + opaque ancestors. */
  scrollControlled?: boolean;
};

export function HeroStatsRow({ scrollControlled = false }: HeroStatsRowProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useViewportInView({
    amount: 0.5,
    once: true,
    topInset: 72,
    bottomInset: 72,
    requireVisible: scrollControlled,
    disabled: !!reduced,
  });

  return (
    <div
      ref={ref}
      className="hero-stats-row grid grid-cols-3 gap-4 md:gap-6 max-w-md"
    >
      {STATS.map((s) => (
        <div key={s.l}>
          <HeroStatRoll
            target={s.target}
            suffix={s.suffix}
            decimals={"decimals" in s ? s.decimals : 0}
            className="text-2xl md:text-3xl font-bold"
            active={reduced ? true : inView}
          />
          <div
            className="text-[13px] md:text-xs text-muted-foreground mt-1 uppercase"
            style={{ fontWeight: 500, letterSpacing: "0.05em" }}
          >
            {s.l}
          </div>
        </div>
      ))}
    </div>
  );
}
