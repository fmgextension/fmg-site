import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Star as PStar,
  Globe as PGlobe,
  PhoneCall as PPhoneCall,
  Lightning as PLightning,
} from "@phosphor-icons/react";
import { CascadeText } from "@/components/CascadeText";
import { Reveal } from "@/components/Reveal";
import { ServicesCarousel } from "@/components/ServicesCarousel";

/**
 * Services scroll-driver. Mirrors the page's existing pinned drivers
 * (ResultsScatter / RevenuePie): a tall outer wrapper carries `data-crossfade`,
 * a sticky 100vh stage holds the content, and a RAF reads the wrapper's rect to
 * derive scroll progress. The heading uses the existing in-view Reveals (its
 * lead-in as the band rises in); the cards are the scroll-scrubbed "beat" —
 * they assemble across roughly the first 40% of the driver, then hold assembled
 * for the remainder so the pin reads as intentional rather than stuck.
 *
 * `data-crossfade` stays on THIS wrapper (not the sticky child) so the section's
 * place in SectionTransitions' DOM-ordered melt is unchanged. A crossfade
 * transform on the wrapper does not break the sticky child — sticky tracks the
 * scrollport, not the transformed containing block (same as ResultsScatter).
 */

const ITEMS = [
  { icon: PPhoneCall, title: "AI Receptionists", desc: "24/7 AI-powered receptionists that answer calls, book appointments, and never miss a lead.", items: ["24/7 Availability", "Natural Conversations", "Appointment Booking", "Lead Capture"] },
  { icon: PStar, title: "5-Star Review Generation", desc: "Automatically collect and boost your Google reviews. Turn happy customers into your best marketing.", items: ["Automated Follow-ups", "Review Monitoring", "Response Templates", "Analytics Dashboard"] },
  { icon: PGlobe, title: "High-End Web Design", desc: "Premium websites that convert visitors into customers. Stunning designs backed by conversion science.", items: ["Custom Design", "Mobile Optimized", "SEO Ready", "Fast Loading"] },
  { icon: PLightning, title: "Increase Lead Flow", desc: "Supercharge your pipeline with AI-driven lead generation. More appointments, more revenue.", items: ["Book More Appts", "Schedule Consultations", "Lead Nurturing", "Pipeline Automation"] },
];

const clampN = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ServicesPinned() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return; // static layout under reduced-motion (no pin)
    const pin = pinRef.current;
    const cards = cardsRef.current;
    if (!pin || !cards) return;

    let raf = 0;
    const tick = () => {
      const r = pin.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinTravel = Math.max(1, r.height - vh);
      // Pin progress: 0 when the stage locks to the top, 1 when it releases. The
      // heading (in-view Reveal) covers the lead-in; the cards are the scrubbed
      // beat — they assemble across the first 40% of the pin, then hold assembled
      // for the remaining 60% so the hold reads as intentional, not frozen.
      const p = clampN(-r.top / pinTravel, 0, 1);
      const e = easeOutCubic(clampN(p / 0.4, 0, 1));
      cards.style.opacity = String(e);
      cards.style.transform = `translate3d(0, ${((1 - e) * 46).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <section
      ref={pinRef}
      id="services"
      data-crossfade
      className={reduced ? "svc-pin svc-reduced" : "svc-pin"}
    >
      <style>{`
        .svc-pin { position: relative; height: 260vh; }
        .svc-stage {
          position: sticky; top: 0; height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          overflow-x: clip;
        }
        /* reduced-motion: no pin — render as a normal in-flow section. */
        .svc-reduced { height: auto; }
        .svc-reduced .svc-stage { position: static; height: auto; min-height: 0; padding: 64px 0; }
        .svc-reduced .svc-cards { opacity: 1 !important; transform: none !important; }
      `}</style>

      <div className="svc-stage">
        <div className="w-full">
          <div className="relative z-[1] max-w-7xl mx-auto px-6">
            <div className="text-center mb-10 md:mb-14">
              <Reveal><div className="text-sm text-primary font-medium mb-3">Our Services</div></Reveal>
              <CascadeText
                as="h2"
                delay={0.1}
                className="font-bold mb-4"
                style={{ fontSize: "clamp(28px, 6vw, 48px)" }}
                segments={[
                  { text: "Everything Your Business Needs to" },
                  { text: "Grow", style: { color: "hsl(var(--primary))" } },
                ]}
              />
              <Reveal delay={0.2}>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                  We combine cutting-edge AI technology with premium design to deliver solutions that actually move the needle.
                </p>
              </Reveal>
            </div>
          </div>
          {/* Scroll-scrubbed "beat": cards assemble across the first ~40% of the
              driver, then hold. Driven imperatively by the RAF above (no in-view
              Reveal here, so the scrub is the single source of entrance). */}
          <div ref={cardsRef} className="svc-cards relative z-[1]" style={{ opacity: 0, willChange: "opacity, transform" }}>
            <ServicesCarousel items={ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesPinned;
