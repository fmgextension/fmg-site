import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Full-bleed "scattered photo + giant type" section (Wolverine-style) on our
 * dark theme. Photos drift continuously at a steady medium pace; the sign of
 * the drift velocity flips to match the LAST scroll direction:
 *   - last scroll DOWN  -> photos drift UP (and keep drifting up when stopped)
 *   - last scroll UP    -> photos drift DOWN (and keep drifting down when stopped)
 *
 * Placement is a STRUCTURED anti-collision system (not hand-tuned coords):
 *   1. The section is an invisible 4x4 grid. Each photo owns one cell (no two
 *      share a cell) and gets a small random jitter inside it.
 *   2. The center 2x2 block is reserved for the headline; only 1-2 small photos
 *      intrude partway in from the edges so the type overlaps a box or two.
 *   3. A relaxation pass enforces a minimum gap between every pair of photos.
 *   4. Sizes stay varied and a few photos bleed off the left/right edges.
 *
 * Standalone preview component — NOT wired into the page order. Add a `src` to
 * any photo (one line each) to swap in a real image.
 */

type Photo = {
  /** Add a real image URL here later — one line per photo to go live. */
  src?: string;
  label: string;
  /** Base width in px (desktop) — scaled down responsively on smaller screens. */
  width: number;
  /** Base height in px (desktop). */
  height: number;
  /** Drift speed multiplier (relative depth). */
  speed: number;
  /** Assigned grid cell [col, row] in the 4x4 grid (perimeter photos). */
  cell?: [number, number];
  /** Fractional center {cx, cy} for the 1-2 photos that intrude into center. */
  intrude?: { cx: number; cy: number };
  /** Hang this photo off the given edge. */
  bleed?: "left" | "right";
};

// 12 perimeter cells of a 4x4 grid + 1 center intrusion = 13 photos
// (one per real image in public/scatter/).
const PHOTOS: Photo[] = [
  // Top row
  { label: "scatter-1", src: "/scatter/1981-digital-yqaskj8lQBE-unsplash.jpg", width: 200, height: 142, speed: 0.7, cell: [0, 0], bleed: "left" },
  { label: "scatter-2", src: "/scatter/carlos-muza-hpjSkU2UYSU-unsplash.jpg", width: 120, height: 80, speed: 1.5, cell: [1, 0] },
  { label: "scatter-3", src: "/scatter/luke-chesser-JKUTrJ4vK00-unsplash.jpg", width: 92, height: 92, speed: 1.3, cell: [2, 0] },
  { label: "scatter-4", src: "/scatter/pexels-asphotography-106344.jpg", width: 240, height: 150, speed: 0.55, cell: [3, 0], bleed: "right" },
  // Middle-left / middle-right (center columns reserved)
  { label: "scatter-5", src: "/scatter/pexels-dkomov-34804005.jpg", width: 148, height: 188, speed: 1.15, cell: [0, 1], bleed: "left" },
  { label: "scatter-6", src: "/scatter/pexels-negativespace-110078.jpg", width: 160, height: 200, speed: 0.95, cell: [3, 1], bleed: "right" },
  { label: "scatter-7", src: "/scatter/pexels-ninobur-17410721.jpg", width: 182, height: 122, speed: 0.8, cell: [0, 2] },
  { label: "scatter-8", src: "/scatter/pexels-ong-ng-c-d-567491655-20301626.jpg", width: 145, height: 175, speed: 1.25, cell: [3, 2], bleed: "right" },
  // Bottom row
  { label: "scatter-9", src: "/scatter/pexels-rdne-7947849.jpg", width: 112, height: 112, speed: 1.4, cell: [0, 3], bleed: "left" },
  { label: "scatter-10", src: "/scatter/pexels-shvetsa-4586709.jpg", width: 200, height: 130, speed: 0.65, cell: [1, 3] },
  { label: "scatter-11", src: "/scatter/raze-solar-Scaj0T40nFI-unsplash.jpg", width: 220, height: 142, speed: 1.0, cell: [2, 3] },
  { label: "scatter-12", src: "/scatter/rodrigo-rodrigues-wolf-r-t-5FRDoTNMvfI-unsplash.jpg", width: 172, height: 120, speed: 0.85, cell: [3, 3], bleed: "right" },
  // Center intrusion (small, partway in so the type overlaps it)
  { label: "scatter-13", src: "/scatter/stephen-phillips-hostreviews-co-uk-shr_Xn8S8QU-unsplash.jpg", width: 96, height: 96, speed: 1.1, intrude: { cx: 0.39, cy: 0.42 } },
  // Google Business Profile analytics screenshots (1400px-wide line graphs / breakdowns)
  { label: "scatter-14", src: "/scatter/gbp-interactions.png", width: 204, height: 85, speed: 0.9, cell: [1, 1] },
  { label: "scatter-15", src: "/scatter/profile-views.png", width: 188, height: 102, speed: 1.2, cell: [2, 1] },
  { label: "scatter-16", src: "/scatter/calls-growth.png", width: 200, height: 85, speed: 0.7, cell: [1, 2] },
  { label: "scatter-17", src: "/scatter/directions.png", width: 190, height: 81, speed: 1.1, cell: [2, 2] },
  { label: "scatter-18", src: "/scatter/website-clicks.png", width: 200, height: 83, speed: 0.6, intrude: { cx: 0.6, cy: 0.58 } },
];

// Steady medium drift in px/second at speed = 1.
const BASE_SPEED = 87 * 2;

// Minimum gap (px) enforced between any two photo bounding boxes.
const MIN_GAP = 40;

type Box = { left: number; top: number; w: number; h: number };

function sizeScaleFor(width: number): number {
  if (width < 480) return 0.5;
  if (width < 768) return 0.64;
  if (width < 1024) return 0.82;
  return 1;
}

function computeLayout(
  W: number,
  H: number,
  scale: number,
  jitter: { jx: number; jy: number }[],
): Box[] {
  const cols = 4;
  const rows = 4;
  const cellW = W / cols;
  const cellH = H / rows;

  const boxes: Box[] = PHOTOS.map((p, i) => {
    const w = Math.round(p.width * scale);
    const h = Math.round(p.height * scale);
    const j = jitter[i] ?? { jx: 0, jy: 0 };

    let cx: number;
    let cy: number;
    if (p.intrude) {
      cx = p.intrude.cx * W + cellW * 0.1 * j.jx;
      cy = p.intrude.cy * H + cellH * 0.1 * j.jy;
    } else {
      const [col, row] = p.cell!;
      cx = col * cellW + cellW * (0.5 + 0.18 * j.jx);
      cy = row * cellH + cellH * (0.5 + 0.18 * j.jy);
    }

    let left = cx - w / 2;
    let top = cy - h / 2;

    if (p.bleed === "left") left = -w * 0.28 + cellW * 0.05 * (j.jx + 1);
    else if (p.bleed === "right") left = W - w * 0.72 - cellW * 0.05 * (j.jx + 1);

    return { left, top, w, h };
  });

  const clamp = (b: Box) => {
    b.left = Math.max(-b.w * 0.32, Math.min(W - b.w * 0.68, b.left));
    b.top = Math.max(0, Math.min(H - b.h, b.top));
  };

  // Relaxation: expand each box by MIN_GAP/2 and push overlapping pairs apart
  // along their axis of least penetration.
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 0; i < boxes.length; i++) {
      for (let k = i + 1; k < boxes.length; k++) {
        const a = boxes[i];
        const b = boxes[k];
        const m = MIN_GAP / 2;
        const ox =
          Math.min(a.left + a.w + m, b.left + b.w + m) -
          Math.max(a.left - m, b.left - m);
        const oy =
          Math.min(a.top + a.h + m, b.top + b.h + m) -
          Math.max(a.top - m, b.top - m);
        if (ox > 0 && oy > 0) {
          const acx = a.left + a.w / 2;
          const bcx = b.left + b.w / 2;
          const acy = a.top + a.h / 2;
          const bcy = b.top + b.h / 2;
          if (ox < oy) {
            const push = ox / 2;
            if (acx <= bcx) {
              a.left -= push;
              b.left += push;
            } else {
              a.left += push;
              b.left -= push;
            }
          } else {
            const push = oy / 2;
            if (acy <= bcy) {
              a.top -= push;
              b.top += push;
            } else {
              a.top += push;
              b.top -= push;
            }
          }
        }
      }
    }
    boxes.forEach(clamp);
  }

  return boxes;
}

export function ResultsScatter() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const offsets = useRef<number[]>(PHOTOS.map(() => 0));
  const directionRef = useRef<-1 | 1>(-1); // default: as if last scroll was down
  const jitterRef = useRef<{ jx: number; jy: number }[]>([]);
  const layoutRef = useRef<Box[]>([]);
  const [layout, setLayout] = useState<Box[] | null>(null);

  // Structured placement — computed from the measured container, recomputed on
  // resize. Runs client-side only (avoids SSR/hydration mismatch).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    if (jitterRef.current.length === 0) {
      jitterRef.current = PHOTOS.map(() => ({
        jx: Math.random() * 2 - 1,
        jy: Math.random() * 2 - 1,
      }));
    }

    const recompute = () => {
      const W = section.clientWidth || window.innerWidth;
      const H = section.clientHeight || window.innerHeight * 1.4;
      const scale = sizeScaleFor(window.innerWidth);
      const next = computeLayout(W, H, scale, jitterRef.current);
      layoutRef.current = next;
      setLayout(next);
    };

    recompute();
    window.addEventListener("resize", recompute, { passive: true });
    return () => window.removeEventListener("resize", recompute);
  }, []);

  // Continuous directional drift loop.
  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    let lastY = window.scrollY || window.pageYOffset || 0;
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      if (y > lastY + 0.4) directionRef.current = -1; // scrolling down -> drift up
      else if (y < lastY - 0.4) directionRef.current = 1; // scrolling up -> drift down
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const H = section.clientHeight || 1;
      const dir = directionRef.current;
      const boxes = layoutRef.current;

      for (let i = 0; i < PHOTOS.length; i++) {
        const el = photoRefs.current[i];
        const box = boxes[i];
        if (!el || !box) continue;
        const h = el.offsetHeight;
        const baseTop = box.top;
        let off = offsets.current[i] + dir * BASE_SPEED * PHOTOS[i].speed * dt;

        // Wrap around the section so the field never empties.
        const span = H + h;
        if (baseTop + off > H) off -= span;
        else if (baseTop + off < -h) off += span;

        offsets.current[i] = off;
        el.style.transform = `translate3d(0, ${off}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      data-crossfade
      className="relative w-full results-section"
      style={{ minHeight: "250vh", backgroundColor: "hsl(var(--background))" }}
      aria-label="Results"
    >
      <style>{`@media (min-width: 768px) { .results-section { min-height: 300vh !important; } }`}</style>
      {/* Scattered photo field (behind the type) */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {(layout ?? []).map((box, i) => {
          const p = PHOTOS[i];
          return (
            <div
              key={p.label}
              ref={(el) => {
                photoRefs.current[i] = el;
              }}
              className="absolute"
              style={{
                left: box.left,
                top: box.top,
                width: box.w,
                height: box.h,
                willChange: "transform",
                transform: "translate3d(0,0,0)",
              }}
            >
              <img
                src={p.src}
                alt=""
                aria-hidden="true"
                className="block h-full w-full rounded-lg object-cover object-center"
                style={{ border: "1px solid hsl(244 33% 96% / 0.1)" }}
                loading="lazy"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* Giant type — anchored, sits ON TOP; photos pass behind the letters */}
      <div
        className="pointer-events-none sticky flex items-center justify-center px-6"
        style={{ top: 0, height: "100vh", zIndex: 10 }}
      >
        <h2
          className="text-center"
          style={{
            color: "#F4F7FB",
            fontWeight: 700,
            fontSize: "clamp(40px, 10vw, 220px)",
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            textWrap: "balance",
          }}
        >
          <span style={{ color: "hsl(var(--primary))" }}>Results</span>,
          <br />
          on the record.
        </h2>
      </div>
    </section>
  );
}
