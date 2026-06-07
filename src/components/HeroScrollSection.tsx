import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "@/lib/lenis-scroll";
import { ensureVideoPlays, hasUserGesture, onFirstGesture } from "@/lib/ensureVideoPlays";

const HERO_VIDEO_SRC = "/blue%20fiber%20optic%20cables.mp4";

const FMG_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160"><text x="50%" y="58%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,system-ui,sans-serif" font-size="128" font-weight="800" letter-spacing="-0.08em" fill="white">FMG</text></svg>',
)}")`;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Clock-based fade driven by rAF writing inline opacity (+ optional translateY).
 * The hero wordmark and hint live inside the GSAP-pinned subtree, which
 * ScrollTrigger removes + re-inserts dozens of times while the page settles. That
 * churn RESTARTS CSS @keyframes animations and SNAPS CSS transitions to their end
 * (= a pop). Inline styles persist across re-insertion and this timeline is clock-
 * based, so the fade runs exactly once, smoothly, no matter the churn. `driftPx` is
 * only written when nonzero, so callers whose element owns `transform` for layout
 * (the translateX-centered hint) keep it untouched.
 */
function rafFade(
  el: HTMLElement,
  opts: { from: number; to: number; durationMs: number; driftPx?: number; onDone?: () => void },
): () => void {
  const { from, to, durationMs, driftPx = 0, onDone } = opts;
  let raf = 0;
  let start = 0;
  const step = (now: number) => {
    if (!start) start = now;
    const p = Math.min(1, (now - start) / durationMs);
    const e = easeOutCubic(p);
    el.style.opacity = String(from + (to - from) * e);
    if (driftPx) el.style.transform = `translateY(${(driftPx * (1 - e)).toFixed(2)}px)`;
    if (p < 1) raf = requestAnimationFrame(step);
    else onDone?.();
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

type HeroScrollSectionProps = {
  active: boolean;
  children: ReactNode;
};

export function HeroScrollSection({ active, children }: HeroScrollSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const maskVideoRef = useRef<HTMLVideoElement>(null);
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const maskFadeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  // LPM "scroll" hint — only shown if the hero clip is still gesture-gated (frozen)
  // shortly after mount; dismissed for good on the first gesture or once it plays.
  const [hintMounted, setHintMounted] = useState(false);
  const hintElRef = useRef<HTMLDivElement>(null);
  const hintFadeCancelRef = useRef<(() => void) | null>(null);
  const hintDoneRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    const outer = outerRef.current;
    const pin = pinRef.current;
    const maskWrap = maskWrapRef.current;
    const content = contentRef.current;
    const black = blackRef.current;

    if (!outer || !pin || !maskWrap || !content || !black) return;

    const ctx = gsap.context(() => {
      gsap.set(content, { opacity: 0, y: 48 });
      gsap.set(black, { opacity: 0 });
      gsap.set(maskWrap, { scale: 1, opacity: 1, transformOrigin: "center center" });

      // One-time gentle load fade-in of the hero splash (wordmark + content),
      // independent of the scrubbed scroll timeline below.
      gsap.fromTo(
        pin,
        { opacity: 0 },
        { opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.05 },
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: "+=90%",
          pin,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        maskWrap,
        { scale: 6, opacity: 0, ease: "power2.out", duration: 0.4 },
        0,
      );
      tl.to(content, { opacity: 1, y: 0, ease: "power2.out", duration: 0.25 }, 0.25);
    }, outer);

    scheduleScrollRefresh();

    return () => {
      ctx.revert();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const mask = maskVideoRef.current;
    if (!mask) return;

    const section = pinRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void mask.play().catch(() => {});
        } else {
          mask.pause();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [active]);

  // Guarantee the mask clip starts (incl. iOS Low Power Mode). The observer above
  // still owns pause-on-exit / resume-on-enter — this only handles the start.
  useEffect(() => {
    if (!active) return;
    const mask = maskVideoRef.current;
    if (!mask) return;
    return ensureVideoPlays(mask);
  }, [active]);

  // One-time wordmark load fade-in (opacity 0->1 + 6px upward drift), driven by rAF
  // so the GSAP pin's remove/re-insert churn can't restart or snap it. The element
  // paints hidden via CSS (no FOUC); reduced-motion just shows it.
  useEffect(() => {
    if (!active) return;
    const fade = maskFadeRef.current;
    if (!fade) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fade.style.opacity = "1";
      fade.style.transform = "none";
      return;
    }
    return rafFade(fade, { from: 0, to: 1, durationMs: 800, driftPx: 6 });
  }, [active]);

  // Show the "scroll" hint ONLY when autoplay is gesture-gated (iOS Low Power Mode):
  // the hero clip is still paused ~600ms after mount AND no user gesture has happened.
  // Normal autoplay plays well within that grace window, so the hint never mounts —
  // no flash on load. Dismissed permanently on the first gesture (the same backstop
  // that wakes the videos) or once the clip actually starts playing.
  useEffect(() => {
    if (!active || hintDoneRef.current) return;
    const mask = maskVideoRef.current;
    if (!mask) return;

    const dismiss = () => {
      if (hintDoneRef.current) return;
      hintDoneRef.current = true;
      hintFadeCancelRef.current?.(); // stop any in-progress fade-in
      const el = hintElRef.current;
      if (!el) {
        setHintMounted(false);
        return;
      }
      const cur = parseFloat(getComputedStyle(el).opacity) || 0;
      hintFadeCancelRef.current = rafFade(el, { from: cur, to: 0, durationMs: 450, onDone: () => setHintMounted(false) });
    };

    const grace = window.setTimeout(() => {
      if (hintDoneRef.current) return;
      if (!mask.paused || hasUserGesture()) return; // autoplay worked → never show
      setHintMounted(true); // the [hintMounted] effect runs the rAF fade-in
    }, 600);

    const offGesture = onFirstGesture(dismiss);
    mask.addEventListener("playing", dismiss);

    return () => {
      window.clearTimeout(grace);
      offGesture();
      mask.removeEventListener("playing", dismiss);
    };
  }, [active]);

  // Hint fade-IN (opacity only — the element owns transform:translateX for
  // centering), driven by rAF once it mounts so the pin re-insert churn can't snap
  // it. The dismiss above owns the fade-out + unmount.
  useEffect(() => {
    if (!hintMounted) return;
    const el = hintElRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }
    hintFadeCancelRef.current = rafFade(el, { from: 0, to: 1, durationMs: 700 });
    return () => hintFadeCancelRef.current?.();
  }, [hintMounted]);

  if (!active) {
    return (
      <section
        className="relative pt-28 md:pt-32 pb-16 md:pb-20 px-6"
        style={{ background: "var(--gradient-hero)" }}
      >
        {children}
      </section>
    );
  }

  return (
    <div ref={outerRef} className="hero-scroll-outer relative">
      <div
        ref={pinRef}
        className="hero-scroll-pin"
        data-video
      >
        {/* Grade overlay only — fiber video now comes from the shared <FiberZone> wrapper in the page. */}
        <div className="hero-scroll-video-grade" aria-hidden="true" />

        <div ref={maskWrapRef} className="hero-scroll-mask-wrap" aria-hidden="true">
          <div ref={maskFadeRef} className="hero-mask-fade">
            <div className="hero-scroll-mask">
              {/* Dark letter-defining plate. iOS Safari promotes a <video> to a
                  hardware overlay layer that BYPASSES ancestor filter/drop-shadow
                  compositing, so the old drop-shadow on .hero-scroll-mask-wrap —
                  which shadowed the masked <video> — silently dropped on iOS and
                  the letters washed out (bright fiber on bright fiber, no dark
                  cutout). This non-video div carries the SAME FMG mask and casts
                  the dark halo from its own (unmasked) wrapper, so the effect
                  renders identically on WebKit. The bright video below paints on
                  top and hides the plate's letter interiors; only the dark halo
                  around the glyphs shows — byte-identical to the desktop look. */}
              <div className="hero-mask-plate-wrap">
                <div
                  className="hero-mask-shape hero-mask-plate"
                  style={{ WebkitMaskImage: FMG_MASK, maskImage: FMG_MASK }}
                />
              </div>
              <div
                className="hero-mask-shape hero-mask-video"
                style={{ WebkitMaskImage: FMG_MASK, maskImage: FMG_MASK }}
              >
                <video
                  ref={maskVideoRef}
                  src={HERO_VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div
                  className="hero-mask-glow"
                  style={{ position: "absolute", inset: 0, background: "rgba(47,128,255,0.22)", mixBlendMode: "screen", pointerEvents: "none" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="hero-scroll-content relative z-10 pt-28 md:pt-32 pb-16 md:pb-20 px-6 min-h-screen flex flex-col justify-center"
          style={{ minHeight: "100lvh" }}
        >
          {children}
        </div>

        <div ref={blackRef} className="hero-scroll-black" aria-hidden="true" />

        {hintMounted && (
          <div ref={hintElRef} className="hero-scroll-hint" aria-hidden="true">
            <span className="hero-scroll-hint-label">scroll</span>
            <svg className="hero-scroll-hint-chevron" width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
              <path d="M2 2.5l9 7 9-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <style>{`
          /* Sit just ABOVE the centered FMG wordmark (the focal zone where iOS draws
             its play-button overlay on a frozen hero). The wordmark is
             width:min(92vw,1180px) at aspect-ratio 3/1 and vertically centered, so
             its top edge is at bottom:(50% + half its height) = 50% + width/6; place
             the hint's bottom edge a comfortable margin above that. */
          .hero-scroll-hint {
            position: absolute; left: 50%;
            /* Sit just above the FMG glyphs (which fill the lower ~70% of the 3:1
               wordmark box). Box half-height is min(92vw,1180px)/6; /12 lands the
               hint inside the box's empty upper band, a small margin above the
               letters so it reads attached to the wordmark zone. */
            bottom: calc(50% + min(92vw, 1180px) / 12 + 12px);
            transform: translateX(-50%);
            z-index: 11; pointer-events: none;
            display: flex; flex-direction: column; align-items: center; gap: 8px;
            text-align: center;
            color: hsl(var(--foreground) / 0.8);
            opacity: 0; /* shown via rAF-driven fade (see rafFade) — not a CSS
                           transition, which the pin re-insert churn would snap */
          }
          .hero-scroll-hint-label {
            font-size: 12px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase;
          }
          .hero-scroll-hint-chevron { display: block; animation: hero-scroll-hint-bob 1.8s ease-in-out infinite; }
          @keyframes hero-scroll-hint-bob {
            0%, 100% { transform: translateY(0); opacity: 0.65; }
            50% { transform: translateY(4px); opacity: 1; }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-scroll-hint-chevron { animation: none; }
          }
        `}</style>
      </div>
    </div>
  );
}
