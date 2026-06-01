import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { useViewportInView } from "@/hooks/useViewportInView";

const CTA_VIDEO_SRC = "/hundreds%20macro%20shot.mp4";
const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/GY7Wbc5EGo5NME2j6v9T";

export function CtaSection() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: sectionRef, inView } = useViewportInView<HTMLElement>({
    amount: 0.28,
    once: false,
    topInset: 48,
    bottomInset: 48,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    if (!inView) {
      video.pause();
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => {});
  }, [inView, reduced]);

  useEffect(() => {
    if (!reduced) return;
    const video = videoRef.current;
    if (!video) return;

    const freeze = () => {
      video.pause();
      video.currentTime = 0;
    };

    if (video.readyState >= 1) {
      freeze();
    } else {
      video.addEventListener("loadeddata", freeze, { once: true });
    }

    return () => video.removeEventListener("loadeddata", freeze);
  }, [reduced]);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="cta-section relative overflow-hidden py-16 md:py-24 px-6 border-t border-border"
      data-video
      data-crossfade
    >
      <div className="cta-section-media" aria-hidden="true">
        <video
          ref={videoRef}
          src={CTA_VIDEO_SRC}
          muted
          loop={!reduced}
          playsInline
          preload="metadata"
          className={reduced ? "cta-section-poster" : undefined}
        />
      </div>

      <div className="cta-section-overlay" aria-hidden="true" />

      <div className="cta-section-content cta-section-panel relative z-[1] max-w-4xl mx-auto text-center p-8 md:p-12 rounded-3xl">
        <Reveal>
          <h2 className="font-bold mb-4" style={{ fontSize: "clamp(28px, 7vw, 48px)" }}>
            Ready to Transform Your Business?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 25+ businesses already using FMG to capture more leads, earn more reviews, and grow
            faster. Let&apos;s talk about your goals.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center px-6 h-12 rounded-full bg-primary text-primary-foreground font-medium w-full sm:w-auto"
            >
              <span className="btn-label">Get your free audit</span>
            </a>
            <a
              href="tel:+17755464533"
              className="btn-secondary inline-flex items-center justify-center px-6 h-12 rounded-full border border-border bg-transparent text-foreground font-medium w-full sm:w-auto"
            >
              <span className="btn-label">Test Drive Our AI</span>
            </a>
          </div>
        </Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
          <a href="tel:+17755464533" className="text-link">
            775-546-4533
          </a>
          <a href="mailto:fmg.extension@gmail.com" className="text-link">
            fmg.extension@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
