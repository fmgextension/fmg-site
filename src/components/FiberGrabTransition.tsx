import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { scheduleScrollRefresh } from "@/lib/lenis-scroll";

// Same fiber clip the hero/ProcessFlow use — ONE decode for the whole CTA zone.
const VIDEO_SRC = "/blue%20fiber%20optic%20cables.mp4";

// Resolve a brand token to an "r, g, b" string for canvas paints (which can't
// take hsl(var(--token)) directly). Reads the live token — never a hard-coded hex.
function readRGB(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const probe = document.createElement("span");
  probe.style.color = `hsl(var(${varName}))`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = c.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return fallback;
  return m.slice(0, 3).map((n) => Math.round(Number(n))).join(", ");
}

// Derive the bright tip bead from the primary token (mix toward white).
function lighten(rgb: string, f: number): string {
  const [r, g, b] = rgb.split(",").map((n) => Number(n.trim()));
  const mix = (c: number) => Math.round(c + (255 - c) * f);
  return `${mix(r)}, ${mix(g)}, ${mix(b)}`;
}

type Strand = {
  x: number;
  f: number;
  d: number;
  sw: number;
  ph: number;
  wf: number;
  wa: number;
};

type FiberGrabTransitionProps = {
  reviews: ReactNode;
  cta: ReactNode;
  footer: ReactNode;
};

// Lerp factor for the smoothed scroll progress that drives cable geometry.
// 0.12 tracks scroll closely while filtering Lenis' per-frame jitter (raise
// toward 0.2 if laggy, lower toward 0.08 if jittery).
const LERP = 0.12;

export function FiberGrabTransition({ reviews, cta, footer }: FiberGrabTransitionProps) {
  const reduced = useReducedMotion();
  const driverRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    const driver = driverRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    const canvas = canvasRef.current;
    const ctaEl = ctaRef.current;
    if (!driver || !media || !content || !canvas || !ctaEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CABLE = readRGB("--primary", "47, 128, 255");
    const BEAD = lighten(CABLE, 0.55);

    let W = 0;
    let H = 0;
    let lastW = -1;
    let strands: Strand[] = [];

    // Seed the strand field. RANDOMIZED, so it must run ONCE per real width — never on
    // a bare height change (see resize()).
    const genStrands = () => {
      strands = [];
      const n = Math.round(W / 14);
      for (let i = 0; i < n; i++) {
        strands.push({
          x: Math.random() * W,
          f: 0.55 + Math.random() * 0.45,
          d: Math.random() * 0.25,
          sw: 0.8 + Math.random() * 1.6,
          ph: Math.random() * 6.28,
          wf: 1.5 + Math.random() * 2.2,
          wa: 6 + Math.random() * 14,
        });
      }
    };

    // Size the backing store and restore context state (assigning canvas.width/height
    // wipes the bitmap AND resets all 2D context state — so lineCap/lineJoin are
    // re-applied here, not once outside). Re-seed the strands ONLY when the WIDTH
    // actually changes. iOS Safari fires 'resize' on every URL-bar/toolbar collapse —
    // a HEIGHT-only change — during a jiggle; re-seeding there reshuffled the entire
    // cable field to new random positions, the visible "reset/jump". Width is constant
    // across a toolbar toggle, so this holds the field stable through a jiggle while
    // still rebuilding on a true layout change (rotation). Desktop never changes width
    // on scroll, so behaviour there is byte-identical.
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (W !== lastW) {
        lastW = W;
        genStrands();
      }
    };
    resize();

    // Debounce so an iOS toolbar-collapse 'resize' burst coalesces into a single
    // backing-store resize after the gesture settles (avoids per-event bitmap churn).
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };
    window.addEventListener("resize", onResize);

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const easeIn = (v: number) => v * v;

    if (video) {
      video.muted = true;
      void video.play().catch(() => {});
    }

    let rendered: number | null = null; // smoothed scroll progress — CABLE GEOMETRY ONLY
    let raf = 0;

    const loop = () => {
      const now = performance.now(); // wall clock — sway/wiggle, never scroll
      const r = driver.getBoundingClientRect();
      // Pin travel = driver height − pinned-stage height. Use the sticky stage's own
      // height (CSS 100vh) instead of live window.innerHeight: on iOS the visual
      // viewport (innerHeight) shrinks/grows with the toolbar while the stage's vh
      // basis stays fixed, so the live value stepped p ~2% on every toolbar toggle.
      // On desktop stage.clientHeight === innerHeight, so this is identical.
      const stage = stageRef.current;
      const pinH = stage && stage.clientHeight ? stage.clientHeight : window.innerHeight;
      const p = clamp(-r.top / (r.height - pinH)); // RAW p — CSS timeline only
      rendered = rendered === null ? p : rendered + (p - rendered) * LERP;
      const sp = rendered; // smoothed — cables

      // ---- CSS timeline (RAW p, crisp choreography) ----
      // GROW 0–0.42: testimonials pinned. PULL 0.42–0.66: yank up + fade out.
      const contentProgress = clamp((p - 0.42) / 0.24);
      const pull = easeIn(contentProgress) * H * 0.7;
      content.style.transform = `translateY(${-pull}px)`;
      content.style.opacity = String(Math.max(0, 1 - contentProgress * 1.6));
      content.style.pointerEvents = contentProgress < 0.5 ? "auto" : "none";

      // REVEAL 0.62–0.88: rising mask + opacity 0.35→1 + descent zoom 1.07→1.
      const maskProgress = clamp((p - 0.62) / 0.26);
      const mb = -18 + maskProgress * 118; // boundary: -18 (hidden) .. 100 (full)
      if (mb >= 100) {
        media.style.maskImage = "none";
        media.style.webkitMaskImage = "none";
      } else {
        const mi = `linear-gradient(to top, black ${mb}%, transparent ${mb + 18}%)`;
        media.style.maskImage = mi;
        media.style.webkitMaskImage = mi;
      }
      media.style.opacity = String(0.35 + 0.65 * maskProgress);
      if (video) video.style.transform = `scale(${(1.07 - easeIn(maskProgress) * 0.07).toFixed(4)})`;

      // CTA SETTLE 0.84–0.94, then held to 1.0 (held slice widened 0.02→0.06 so
      // momentum can't blow past the CTA into the footer; settle span unchanged at 0.10).
      const ca = clamp((p - 0.84) / 0.1);
      ctaEl.style.opacity = String(ca);
      ctaEl.style.transform = `translateY(${((1 - ca) * 40).toFixed(2)}px)`;
      ctaEl.style.pointerEvents = ca > 0.5 ? "auto" : "none";

      // ---- Cables (SMOOTHED sp geometry, NOW phase) ----
      // GROW up; REEL 0.42–0.80 retracts fully below the frame (geometric exit).
      const grab = clamp((sp - 0.42) / 0.38);
      ctx.clearRect(0, 0, W, H);
      const segs = 14;
      for (let si = 0; si < strands.length; si++) {
        const s = strands[si];
        const lp = clamp((sp - s.d) / 0.5);
        if (lp <= 0) continue;
        const hgt = lp * H * 0.82 * s.f * (1 - easeIn(grab) * 1.04);
        if (hgt <= 0) continue; // fully retracted below frame — growFade already faded it to 0 here
        // Fade near zero instead of a hard cutoff so strands never pop in/out on small scrolls.
        const growFade = clamp(hgt / 14);
        const tipY = H - hgt;
        const sway = Math.sin(now * 0.0015 + s.ph);

        const px: number[] = [];
        const py: number[] = [];
        for (let k = 0; k <= segs; k++) {
          const f = k / segs;
          const wig = Math.sin(f * s.wf * 3.14 + now * 0.0022 + s.ph) * s.wa * f * (1 - grab * 0.6);
          px.push(s.x + wig + sway * 4 * f);
          py.push(H + 4 - (H + 4 - tipY) * f);
        }
        // Smooth spline: quadratic curves through segment midpoints.
        ctx.strokeStyle = `rgba(${CABLE}, ${((0.18 + 0.4 * lp * (1 - grab * 0.55)) * growFade).toFixed(3)})`;
        ctx.lineWidth = s.sw;
        ctx.beginPath();
        ctx.moveTo(px[0], py[0]);
        for (let k = 1; k < segs; k++) {
          ctx.quadraticCurveTo(px[k], py[k], (px[k] + px[k + 1]) / 2, (py[k] + py[k + 1]) / 2);
        }
        ctx.lineTo(px[segs], py[segs]);
        ctx.stroke();

        // Tip bead WELDED to the true endpoint (the last sample) — no hook/horn.
        ctx.fillStyle = `rgba(${BEAD}, ${((0.45 + 0.5 * lp) * growFade).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px[segs], py[segs], 2.2 + lp * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    scheduleScrollRefresh();

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  const styleBlock = (
    <style>{`
      .cta-zone { position: relative; isolation: isolate; }
      /* ONE shared fiber video — sticky so it spans the transition stage, the
         held CTA, and the footer to the page bottom (single decode). */
      .fgt-media {
        position: sticky; top: 0; height: 100vh; margin-bottom: -100vh;
        z-index: 0; pointer-events: none; overflow: hidden;
        background: hsl(var(--background));
      }
      .fgt-media video {
        position: absolute; inset: 0; width: 100%; height: 100%;
        object-fit: cover; transform-origin: center center;
      }
      .fgt-grade { position: absolute; inset: 0; background: hsl(var(--background) / 0.45); }
      /* overflow-anchor:none — defensive: keep iOS scroll-anchoring from ever
         nudging scrollTop within the pinned region (belt-and-suspenders; the jiggle
         reset was the resize re-seed, not anchoring). */
      .fgt-driver { position: relative; height: 550vh; overflow-anchor: none; }
      .fgt-stage { position: sticky; top: 0; height: 100vh; overflow: hidden; overflow-anchor: none; }
      /* Testimonial layer: solid page-dark so the masked-out video stays hidden
         behind it until the grab reveals it. */
      .fgt-content {
        position: absolute; inset: 0; z-index: 3; overflow: hidden;
        background: hsl(var(--background));
        display: flex; flex-direction: column; justify-content: center;
        will-change: transform, opacity;
      }
      .fgt-strands { position: absolute; inset: 0; z-index: 4; width: 100%; height: 100%; pointer-events: none; }
      .fgt-cta {
        position: absolute; inset: 0; z-index: 5;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        opacity: 0; will-change: opacity, transform;
      }
      /* reduced-motion: reviews render as a normal (solid-dark) section, then a
         centered full-screen CTA, then the footer — no driver/strands. */
      .fgt-reviews-static { position: relative; z-index: 1; background: hsl(var(--background)); }
      .fgt-cta-static {
        position: relative; z-index: 1; min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
      }
    `}</style>
  );

  if (reduced) {
    return (
      <div className="cta-zone">
        {styleBlock}
        <div className="fgt-media" aria-hidden="true">
          <video ref={videoRef} src={VIDEO_SRC} autoPlay muted loop playsInline />
          <div className="fgt-grade" />
        </div>
        <div className="fgt-reviews-static">{reviews}</div>
        <div className="fgt-cta-static">{cta}</div>
        {footer}
      </div>
    );
  }

  return (
    <div className="cta-zone">
      {styleBlock}
      <div className="fgt-media" ref={mediaRef} aria-hidden="true">
        <video ref={videoRef} src={VIDEO_SRC} autoPlay muted loop playsInline />
        <div className="fgt-grade" />
      </div>
      <div className="fgt-driver" ref={driverRef}>
        <div className="fgt-stage" ref={stageRef}>
          <div className="fgt-content" ref={contentRef}>{reviews}</div>
          <canvas ref={canvasRef} className="fgt-strands" aria-hidden="true" />
          <div className="fgt-cta" ref={ctaRef}>{cta}</div>
        </div>
      </div>
      {footer}
    </div>
  );
}

export default FiberGrabTransition;
