import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type StickyStackItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  items: string[];
};

type Props = { items: StickyStackItem[] };

export function StickyCardStack({ items }: Props) {
  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const N = items.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = React.useState(0);
  const [inZone, setInZone] = React.useState(false);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive(idx);
    setInZone(v > 0.001 && v < 0.999);
  });

  if (reduced) {
    return (
      <div className="flex flex-col gap-8">
        {items.map((s, i) => (
          <CardVisual key={s.title} item={s} index={i} total={N} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${N * 100}vh` }}
      >
        {items.map((s, i) => (
          <StickyCard
            key={s.title}
            item={s}
            index={i}
            total={N}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Fixed counter + progress */}
      <AnimatePresence>
        {inZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-50 right-6 md:right-12 flex flex-col items-end gap-2 pointer-events-none"
            style={{ bottom: "max(24px, calc(env(safe-area-inset-bottom) + 16px))" }}
            aria-live="polite"
          >
            <div className="flex items-center gap-2 text-[14px]">
              <span
                className="text-primary font-semibold"
                style={{ letterSpacing: "0.05em" }}
              >
                {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground/50">—</span>
              <span
                className="text-foreground font-medium uppercase"
                style={{ letterSpacing: "0.1em" }}
              >
                {items[active].title}
              </span>
            </div>
            <div className="h-[2px] w-20 bg-border overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: progressWidth }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StickyCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: StickyStackItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;

  const scale = useTransform(scrollYProgress, [start, end], isLast ? [1, 1] : [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [start, end], isLast ? [1, 1] : [1, 0.5]);

  return (
    <div
      className="sticky top-0 w-full flex items-center justify-center px-6 md:px-20"
      style={{
        height: "90vh",
        zIndex: index + 1,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <motion.div style={{ scale, opacity }} className="w-full">
        <CardVisual item={item} index={index} total={total} />
      </motion.div>
    </div>
  );
}

function CardVisual({
  item,
  index,
  total,
}: {
  item: StickyStackItem;
  index: number;
  total: number;
}) {
  const Icon = item.icon;
  const counter = String(index + 1).padStart(2, "0");
  return (
    <div
      className="mx-auto bg-card border border-border rounded-3xl overflow-hidden"
      style={{ maxWidth: 1200, boxShadow: "var(--shadow-card)" }}
    >
      <div className="p-8 md:p-16">
        <div className="grid md:grid-cols-5 gap-10 md:gap-12">
          {/* Left column */}
          <div className="md:col-span-2">
            <div
              className="text-primary font-bold mb-8"
              style={{ fontSize: 14, letterSpacing: "0.1em", fontWeight: 700 }}
            >
              {counter}
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 mb-8">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h3
              className="text-foreground font-semibold"
              style={{ fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.15 }}
            >
              {item.title}
            </h3>
          </div>

          {/* Right column */}
          <div className="md:col-span-3">
            <p
              className="text-muted-foreground mb-8"
              style={{ fontSize: 17, lineHeight: 1.6 }}
            >
              {item.desc}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {item.items.map((it) => (
                <li
                  key={it}
                  className="flex items-center gap-3 text-foreground"
                  style={{ fontSize: 16, fontWeight: 500 }}
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <span className="sr-only">
        Card {index + 1} of {total}
      </span>
    </div>
  );
}

export default StickyCardStack;
