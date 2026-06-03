import { useEffect, useRef } from "react";

// Values mirrored from fmg-full-preview.html (#spot / #spot.hot):
//   base: 520px, radial-gradient(circle, primary @ .15, transparent 60%)
//   hot : 680px, primary @ .28  (over hero / video bands / cta)
//   z-index 90, mix-blend-mode: screen, lerp-follow at 0.18
const BASE_SIZE = 520;
const HOT_SIZE = 680;
const BASE_OPACITY = 0.15;
const HOT_OPACITY = 0.28;
const LERP = 0.18;

export function SpotlightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const canFollow =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Touch / reduced-motion: no pointer to follow — anchor the glow to the
    // center of the viewport. Because it is position:fixed it rides along with
    // whatever is in view as the page scrolls, reading as an ambient glow.
    if (!canFollow) {
      cursor.style.left = "50%";
      cursor.style.top = "50%";
      cursor.style.transform = "translate(-50%, -50%)";
      cursor.style.width = `${BASE_SIZE}px`;
      cursor.style.height = `${BASE_SIZE}px`;
      cursor.style.opacity = String(BASE_OPACITY);
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let currentSize = BASE_SIZE;
    let targetSize = BASE_SIZE;
    let currentOpacity = 0;
    let targetOpacity = BASE_OPACITY;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Intensify over the video-bearing sections (hero / bands / cta), the
      // same "hot" zones the preview brightens over.
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hot = !!el?.closest("[data-video]");

      targetSize = hot ? HOT_SIZE : BASE_SIZE;
      targetOpacity = hot ? HOT_OPACITY : BASE_OPACITY;
    };

    const animate = () => {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      currentSize += (targetSize - currentSize) * LERP;
      currentOpacity += (targetOpacity - currentOpacity) * LERP;

      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      cursor.style.width = `${currentSize}px`;
      cursor.style.height = `${currentSize}px`;
      cursor.style.opacity = String(currentOpacity);

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] rounded-full"
      style={{
        // 2-stop radial matching the preview's softness (transparent at 60%);
        // element opacity carries the .15 / .28 brightness so the falloff stays
        // identical to rgba(primary, .15) -> transparent.
        background:
          "radial-gradient(circle, hsl(var(--primary)), transparent 60%)",
        width: BASE_SIZE,
        height: BASE_SIZE,
        // Start invisible to avoid a first-paint flash at the origin; the effect
        // drives opacity (fade-in on desktop, static value on touch).
        opacity: 0,
        mixBlendMode: "screen",
        willChange: "transform, opacity, width, height",
      }}
    />
  );
}
