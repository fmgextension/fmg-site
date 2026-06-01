import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "@/lib/lenis-scroll";

gsap.registerPlugin(ScrollTrigger);

const MIN_OPACITY = 0.4;
const DRIFT = 48;

/**
 * Scroll-scrubbed cross-dissolve between adjacent major sections.
 * Each tagged section ([data-crossfade]) fades in from slightly below as it
 * enters and fades out drifting up as it leaves. Adjacent sections overlap
 * their enter/exit ranges, producing a gentle hand-off. Tied to the existing
 * Lenis + ScrollTrigger setup (SmoothScroll.tsx) — no second smooth-scroll.
 */
export function SectionTransitions() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-crossfade]"),
    );
    if (!sections.length) return;

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        // Incoming: fade up from slightly below as the section enters view.
        gsap.fromTo(
          section,
          { autoAlpha: MIN_OPACITY, y: DRIFT },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 40%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        // Outgoing: fade down drifting up as the section leaves view. The
        // range overlaps the next section's enter range for the cross-dissolve.
        gsap.fromTo(
          section,
          { autoAlpha: 1, y: 0 },
          {
            autoAlpha: MIN_OPACITY,
            y: -DRIFT,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "bottom 70%",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    scheduleScrollRefresh();

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
