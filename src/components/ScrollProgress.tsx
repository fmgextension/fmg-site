import { useEffect, useRef } from "react";
import { getLenisInstance, subscribeScroll } from "@/lib/lenis-scroll";

/**
 * Thin page-scroll progress bar pinned to the bottom edge of the viewport.
 *
 * Informational, not decorative — so it updates with direct value writes and no
 * transition/easing (correct under reduced-motion too). The fill is driven by a
 * single rAF-throttled handler that scales a GPU-cheap transform; no per-frame
 * layout reads (scrollHeight is cached and refreshed on resize).
 *
 * Scroll source: when Lenis is running we read its smoothed `scroll`/`limit`
 * (so the bar tracks the eased position, same instance other components use);
 * otherwise — reduced-motion, where SmoothScroll never creates Lenis — we fall
 * back to native scrollY against the cached scrollHeight. We listen to both the
 * shared scroll subscription (fires via Lenis' notifyScroll) and the native
 * scroll event so either path keeps the bar live.
 */
export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fill = fillRef.current;
    if (!fill) return;

    let scrollHeight = document.documentElement.scrollHeight;
    let ticking = false;

    const apply = () => {
      ticking = false;
      const lenis = getLenisInstance();
      let p: number;
      if (lenis) {
        p = lenis.limit > 0 ? lenis.scroll / lenis.limit : 0;
      } else {
        const max = scrollHeight - window.innerHeight;
        p = max > 0 ? window.scrollY / max : 0;
      }
      p = Math.max(0, Math.min(1, p));
      fill.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    const onResize = () => {
      scrollHeight = document.documentElement.scrollHeight;
      onScroll();
    };

    const unsub = subscribeScroll(onScroll); // Lenis-driven (via notifyScroll) + initial fire
    window.addEventListener("scroll", onScroll, { passive: true }); // native / reduced-motion path
    window.addEventListener("resize", onResize);
    apply();

    return () => {
      unsub();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 2,
        zIndex: 2147483647,
        pointerEvents: "none",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        ref={fillRef}
        style={{
          height: "100%",
          width: "100%",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          backgroundColor: "hsl(var(--primary) / 0.9)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

export default ScrollProgress;
