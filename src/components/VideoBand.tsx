import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CascadeText } from "@/components/CascadeText";
import { useViewportInView } from "@/hooks/useViewportInView";
import { ensureVideoPlays } from "@/lib/ensureVideoPlays";

export const VIDEO_CLIPS = {
  alwaysAnswering: "/macbook%20typing%20blue%20close%20extended.mp4",
} as const;

type VideoBandProps = {
  clip: string;
  headline?: string;
  sub?: string;
  graded?: boolean;
  lightOverlay?: boolean;
  poster?: string;
  id?: string;
  /**
   * When set, the band becomes a pinned scroll-driver `pinVh` viewport-heights
   * tall: a sticky 100vh stage holds the media + content while the driver
   * scrolls past, and the text content is scroll-scrubbed in (the "beat") then
   * held. Mirrors the page's other pinned drivers. Omit for a normal in-flow band.
   */
  pinVh?: number;
  children?: ReactNode;
};

const clampN = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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
  id,
  pinVh,
  children,
}: VideoBandProps) {
  const reduced = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [enableParallax, setEnableParallax] = useState(false);
  const pinned = !!pinVh && !reduced;
  const { ref: sectionRef, inView } = useViewportInView<HTMLElement>({
    amount: pinVh ? 0.2 : 0.32,
    once: false,
    topInset: 48,
    bottomInset: 48,
  });

  useEffect(() => {
    if (reduced || pinVh) {
      setEnableParallax(false); // pinned bands hold the video still; no parallax drift
      return;
    }
    setEnableParallax(window.matchMedia("(hover: hover) and (min-width: 768px)").matches);
  }, [reduced, pinVh]);

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

  // Guarantee the clip starts (incl. iOS Low Power Mode). Pause/resume stays with
  // the inView effect above — this only handles the initial start + gesture backstop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    return ensureVideoPlays(video);
  }, []);

  // Pinned "beat": scroll-scrub the text content in as the band rises into view
  // and settles into its pin, then hold. The video keeps playing throughout, so
  // the long hold reads as a live presentation rather than a frozen frame.
  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    let raf = 0;
    const tick = () => {
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const pinTravel = Math.max(1, r.height - vh);
      // Entrance spans "band starts entering" -> "~40% into the pinned travel".
      const denom = vh + 0.4 * pinTravel;
      const prog = clampN((vh - r.top) / denom, 0, 1);
      const e = easeOutCubic(prog);
      content.style.opacity = String(e);
      content.style.transform = `translate3d(0, ${((1 - e) * 38).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pinned]);

  const media = (
    <>
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

      <div
        ref={pinned ? contentRef : undefined}
        className="video-band-content relative z-10 max-w-4xl mx-auto px-6 py-20 text-center"
        style={pinned ? { opacity: 0, willChange: "opacity, transform" } : undefined}
      >
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
    </>
  );

  if (pinVh) {
    // Pinned driver: tall outer carries data-crossfade/data-video/id (its place in
    // SectionTransitions' DOM-ordered melt is unchanged); sticky stage holds media.
    return (
      <section
        ref={sectionRef}
        id={id}
        className={`video-band-pin${reduced ? " is-reduced" : ""}${graded ? " video-band--graded" : ""}${lightOverlay ? " video-band--light" : ""}`}
        data-video
        data-crossfade
        style={{ height: reduced ? undefined : `${pinVh}vh` }}
      >
        <style>{`
          .video-band-pin { position: relative; }
          .video-band-pin .video-band-stage {
            position: sticky; top: 0; height: 100vh;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
          }
          .video-band-pin.is-reduced .video-band-stage {
            position: static; height: auto; min-height: 88vh;
          }
          .video-band-pin.is-reduced .video-band-content { opacity: 1 !important; transform: none !important; }
        `}</style>
        <div className="video-band-stage">{media}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`video-band relative w-full min-h-[88vh] flex items-center justify-center overflow-hidden${graded ? " video-band--graded" : ""}${lightOverlay ? " video-band--light" : ""}`}
      data-video
      data-crossfade
    >
      {media}
    </section>
  );
}
