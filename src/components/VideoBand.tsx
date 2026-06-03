import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CascadeText } from "@/components/CascadeText";
import { useViewportInView } from "@/hooks/useViewportInView";

export const VIDEO_CLIPS = {
  dataLayer: "/code%20closeup%20extended.mov",
  modernBrands: "/skyscrape%20glass%20extended.mp4",
  alwaysAnswering: "/macbook%20typing%20blue%20close%20extended.mp4",
} as const;

type VideoBandProps = {
  clip: string;
  headline?: string;
  sub?: string;
  graded?: boolean;
  lightOverlay?: boolean;
  poster?: string;
  children?: ReactNode;
};

function overlayStyle(graded: boolean, lightOverlay: boolean): CSSProperties | undefined {
  if (graded) {
    return {
      background: `linear-gradient(
        180deg,
        hsl(var(--card) / 0.72) 0%,
        hsl(var(--background) / 0.88) 100%
      )`,
    };
  }
  if (lightOverlay) {
    return { backgroundColor: "hsl(var(--background) / 0.25)" };
  }
  return undefined;
}

export function VideoBand({
  clip,
  headline,
  sub,
  graded = false,
  lightOverlay = false,
  poster,
  children,
}: VideoBandProps) {
  const reduced = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enableParallax, setEnableParallax] = useState(false);
  const { ref: sectionRef, inView } = useViewportInView<HTMLElement>({
    amount: 0.32,
    once: false,
    topInset: 48,
    bottomInset: 48,
  });

  useEffect(() => {
    if (reduced) {
      setEnableParallax(false);
      return;
    }
    setEnableParallax(window.matchMedia("(hover: hover) and (min-width: 768px)").matches);
  }, [reduced]);

  useEffect(() => {
    if (!enableParallax) return;

    const section = sectionRef.current;
    const parallax = parallaxRef.current;
    if (!section || !parallax) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        parallax,
        { yPercent: -7.5 },
        {
          yPercent: 7.5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [enableParallax]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!inView) {
      video.pause();
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => {});
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className={`video-band relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden border-y border-border${graded ? " video-band--graded" : ""}${lightOverlay ? " video-band--light" : ""}`}
      data-video
      data-crossfade
    >
      <div className="video-band-media" aria-hidden="true">
        <div ref={enableParallax ? parallaxRef : undefined} className="video-band-parallax">
          <video
            ref={videoRef}
            src={clip}
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
          />
        </div>
      </div>

      <div className="video-band-overlay" style={overlayStyle(graded, lightOverlay)} />

      <div className="video-band-content relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        {children ?? (
          <>
            <CascadeText
              as="h2"
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 6vw, 48px)", lineHeight: 1.15 }}
            >
              {headline}
            </CascadeText>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{sub}</p>
          </>
        )}
      </div>
    </section>
  );
}
