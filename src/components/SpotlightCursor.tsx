import { useEffect, useRef, useState } from "react";

const BASE_SIZE = 420;
const VIDEO_SIZE = 560;
const BASE_OPACITY = 0.15;
const VIDEO_OPACITY = 0.28;
const LERP = 0.12;

export function SpotlightCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setEnabled(true);

    const cursor = cursorRef.current;
    if (!cursor) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentSize = BASE_SIZE;
    let targetSize = BASE_SIZE;
    let currentOpacity = BASE_OPACITY;
    let targetOpacity = BASE_OPACITY;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const overVideo = !!el?.closest("[data-video]");

      targetSize = overVideo ? VIDEO_SIZE : BASE_SIZE;
      targetOpacity = overVideo ? VIDEO_OPACITY : BASE_OPACITY;
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

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.4) 35%, transparent 70%)",
        width: BASE_SIZE,
        height: BASE_SIZE,
        opacity: BASE_OPACITY,
        willChange: "transform, opacity, width, height",
      }}
    />
  );
}
