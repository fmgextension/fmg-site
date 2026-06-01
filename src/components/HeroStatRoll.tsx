import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type HeroStatRollProps = {
  target: number;
  suffix: string;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Parent row is in view (Lenis-synced visibility). */
  active?: boolean;
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function HeroStatRoll({
  target,
  suffix,
  decimals = 0,
  duration = 1500,
  className,
  active = false,
}: HeroStatRollProps) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (!active || hasAnimated.current) return;

    hasAnimated.current = true;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);
      const next = target * eased;
      setValue(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, decimals, duration, reduced, target]);

  return (
    <span className={className}>
      {decimals > 0 ? value.toFixed(decimals) : String(value)}
      {suffix}
    </span>
  );
}
