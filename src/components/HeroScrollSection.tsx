import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scheduleScrollRefresh } from "@/lib/lenis-scroll";

const HERO_VIDEO_SRC = "/blue%20fiber%20optic%20cables.mp4";

const FMG_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 160"><text x="50%" y="58%" text-anchor="middle" dominant-baseline="middle" font-family="Inter,system-ui,sans-serif" font-size="128" font-weight="800" letter-spacing="-0.08em" fill="white">FMG</text></svg>',
)}")`;

type HeroScrollSectionProps = {
  active: boolean;
  children: ReactNode;
};

export function HeroScrollSection({ active, children }: HeroScrollSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const maskVideoRef = useRef<HTMLVideoElement>(null);
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    const outer = outerRef.current;
    const pin = pinRef.current;
    const maskWrap = maskWrapRef.current;
    const content = contentRef.current;
    const black = blackRef.current;
    const bgVideo = bgVideoRef.current;

    if (!outer || !pin || !maskWrap || !content || !black) return;

    const ctx = gsap.context(() => {
      gsap.set(content, { opacity: 0, y: 48 });
      gsap.set(black, { opacity: 0 });
      gsap.set(maskWrap, { scale: 1, opacity: 1, transformOrigin: "center center" });
      if (bgVideo) gsap.set(bgVideo, { scale: 1.2, transformOrigin: "center center" });

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
          end: "+=140%",
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
      if (bgVideo) {
        tl.to(bgVideo, { scale: 1.32, ease: "power2.out", duration: 0.4 }, 0);
      }
      tl.to(content, { opacity: 1, y: 0, ease: "power2.out", duration: 0.25 }, 0.25);
      tl.to(black, { opacity: 1, ease: "power2.in", duration: 0.18 }, 0.82);
    }, outer);

    scheduleScrollRefresh();

    return () => {
      ctx.revert();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const videos = [bgVideoRef.current, maskVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    if (!videos.length) return;

    const section = pinRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        for (const video of videos) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [active]);

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
        <div className="hero-scroll-video-bg" aria-hidden="true">
          <video
            ref={bgVideoRef}
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="hero-scroll-video-grade" />
        </div>

        <div ref={maskWrapRef} className="hero-scroll-mask-wrap" aria-hidden="true">
          <div
            className="hero-scroll-mask"
            style={{
              WebkitMaskImage: FMG_MASK,
              maskImage: FMG_MASK,
            }}
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
          </div>
        </div>

        <div
          ref={contentRef}
          className="hero-scroll-content relative z-10 pt-28 md:pt-32 pb-16 md:pb-20 px-6 min-h-screen flex flex-col justify-center"
        >
          {children}
        </div>

        <div ref={blackRef} className="hero-scroll-black" aria-hidden="true" />
      </div>
    </div>
  );
}
