import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "@/lib/lenis-scroll";

gsap.registerPlugin(ScrollTrigger);

const DRIFT = 64;

/**
 * Scroll-scrubbed cross-dissolve at the 6 video <-> content seams.
 *
 * Each tagged section ([data-crossfade]) owns its own opacity through two
 * independent, non-overlapping scrubbed triggers — an entrance (0 -> 1) near
 * its top and an exit (1 -> 0) near its bottom. Because adjacent sections
 * share a seam, the outgoing section's exit window and the incoming section's
 * entrance window overlap across the boundary, so they fully melt through each
 * other (outgoing all the way to 0, incoming up from 0) instead of hard-cutting.
 *
 * The hero -> first-band seam is intentionally skipped (the hero black-beat owns
 * it): the first tagged section gets no entrance fade. The final CTA gets no exit
 * fade since nothing meaningful follows before the footer.
 *
 * Tied to the existing Lenis + ScrollTrigger setup (SmoothScroll.tsx) — no second
 * smooth-scroll. GPU-friendly (opacity/transform + will-change). Disabled under
 * prefers-reduced-motion (sections render at full opacity).
 */
export function SectionTransitions() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-crossfade]"),
    );
    if (sections.length < 2) return;

    const lastIndex = sections.length - 1;

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        const hasEntrance = index > 0; // skip hero -> first-band seam
        const hasExit = index < lastIndex; // skip cta -> footer seam

        // Incoming: rise + fade up from 0 over a generous window as the
        // section's top travels into view. immediateRender keeps it hidden
        // until scrolled to, so nothing below the fold pre-animates.
        if (hasEntrance) {
          gsap.fromTo(
            section,
            { opacity: 0, y: DRIFT },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              force3D: false,
              immediateRender: true,
              overwrite: false,
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "top 30%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }

        // Outgoing: fade fully to 0 + drift up as the section's bottom leaves.
        // This window overlaps the next section's entrance for the melt.
        if (hasExit) {
          gsap.fromTo(
            section,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -DRIFT,
              ease: "none",
              force3D: false,
              immediateRender: false,
              overwrite: false,
              scrollTrigger: {
                trigger: section,
                start: "bottom 70%",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });
    });

    scheduleScrollRefresh();

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
}
