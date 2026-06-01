import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useViewportInView } from "@/hooks/useViewportInView";

const TOTAL = 2419072;

const CHANNELS = [
  { name: "Paid Search", pct: 86, value: 742180 },
  { name: "Local SEO", pct: 71, value: 531940 },
  { name: "Paid Social", pct: 64, value: 418220 },
  { name: "Email", pct: 48, value: 312650 },
  { name: "AI Receptionist", pct: 40, value: 261400 },
  { name: "Referral", pct: 22, value: 152682 },
] as const;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function RevenueBars() {
  const reduced = useReducedMotion();
  const { ref, inView } = useViewportInView<HTMLDivElement>({
    amount: 0.4,
    once: true,
    topInset: 80,
    bottomInset: 80,
    disabled: !!reduced,
  });
  const active = reduced ? true : inView;

  const [total, setTotal] = useState(reduced ? TOTAL : 0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (reduced) {
      setTotal(TOTAL);
      return;
    }
    if (!active || hasRun.current) return;

    hasRun.current = true;
    let raf = 0;
    const start = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setTotal(Math.round(TOTAL * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return (
    <div ref={ref} className="mx-auto w-full" style={{ maxWidth: 760 }}>
      <div
        className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm"
        style={{ padding: "clamp(24px, 4vw, 44px)", boxShadow: "var(--shadow-card)" }}
      >
        {/* Total */}
        <div className="text-center mb-8 md:mb-10 pb-8 border-b border-border">
          <div
            className="font-bold tabular-nums"
            style={{ fontSize: "clamp(38px, 8vw, 66px)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            {usd.format(total)}
          </div>
          <div
            className="text-xs md:text-sm text-muted-foreground mt-3 uppercase"
            style={{ letterSpacing: "0.08em", fontWeight: 500 }}
          >
            Tracked revenue across all channels.
          </div>
        </div>

        {/* Channel rows */}
        <div className="flex flex-col gap-4 md:gap-5">
          {CHANNELS.map((c, i) => (
            <div key={c.name} className="flex items-center gap-3 md:gap-5">
              <div
                className="shrink-0 text-foreground/90"
                style={{ width: "clamp(98px, 24%, 156px)", fontSize: 14, fontWeight: 500 }}
              >
                {c.name}
              </div>

              <div
                className="relative flex-1 overflow-hidden"
                style={{ height: 8, borderRadius: 999, backgroundColor: "hsl(var(--foreground) / 0.06)" }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{
                    width: active ? `${c.pct}%` : "0%",
                    borderRadius: 999,
                    backgroundColor: "hsl(var(--primary))",
                    boxShadow: "0 0 12px hsl(var(--primary) / 0.45)",
                    transition: reduced ? "none" : "width 1.2s cubic-bezier(0.6, 0, 0.2, 1)",
                    transitionDelay: reduced ? "0s" : `${i * 0.12}s`,
                  }}
                />
              </div>

              <div
                className="shrink-0 text-right font-semibold tabular-nums"
                style={{ width: "clamp(90px, 22%, 132px)", fontSize: 14 }}
              >
                {usd.format(c.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RevenueBars;
