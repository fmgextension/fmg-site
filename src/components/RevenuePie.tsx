import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { CascadeText } from "@/components/CascadeText";
import { Reveal } from "@/components/Reveal";

// Six-channel revenue split. The top slice tracks the brand primary (resolved
// from --primary at runtime so it follows the design token); the remaining five
// are a fixed darkening navy ramp with no token equivalent.
const CHANNELS = [
  { nm: "Paid Search", v: 742180, c: "#2F80FF" },
  { nm: "Local SEO", v: 531940, c: "#2566cc" },
  { nm: "Paid Social", v: 418220, c: "#1d4f9e" },
  { nm: "Email", v: 312650, c: "#163c78" },
  { nm: "AI Receptionist", v: 261400, c: "#0f2b56" },
  { nm: "Referral", v: 152682, c: "#0B1F3A" },
];
const TOTAL = CHANNELS.reduce((a, d) => a + d.v, 0);

const R = 235;
const CX = 450;
const CY = 450;
const T = 58;
const NS = "http://www.w3.org/2000/svg";
const TAU = Math.PI * 2;
const EXPLODE = 46;
const LIFT = 22;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

// Resolve hsl(var(--primary)) to a hex string usable by the wedge-shading math
// (which parses #rrggbb). Reads the live token so the pie follows brand changes.
function readPrimaryHex(): string {
  if (typeof document === "undefined") return "#2F80FF";
  const probe = document.createElement("span");
  probe.style.color = "hsl(var(--primary))";
  probe.style.display = "none";
  document.body.appendChild(probe);
  const c = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = c.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return "#2F80FF";
  const [r, g, b] = m.slice(0, 3).map((n) => Math.round(Number(n)));
  const hx = (x: number) => x.toString(16).padStart(2, "0");
  return `#${hx(r)}${hx(g)}${hx(b)}`;
}

type SliceMeta = {
  g: SVGGElement;
  am: number;
  sinam: number;
  outer: SVGPathElement;
  radw: SVGPathElement[];
  label: SVGTextElement;
  row: HTMLDivElement;
  val: HTMLSpanElement;
};

export function RevenuePie() {
  const reduced = useReducedMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<SVGGElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<SVGCircleElement>(null);
  const drawlineRef = useRef<SVGPathElement>(null);
  const totalRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const gradEndRef = useRef<SVGStopElement>(null);

  useEffect(() => {
    const tiltG = tiltRef.current;
    const labels = labelsRef.current;
    const legend = legendRef.current;
    const seed = seedRef.current;
    const drawline = drawlineRef.current;
    const total = totalRef.current;
    const center = centerRef.current;
    if (!tiltG || !labels || !legend || !seed || !drawline || !total || !center) return;

    const PRIMARY = readPrimaryHex();
    if (gradEndRef.current) gradEndRef.current.setAttribute("stop-color", PRIMARY);
    const DATA = CHANNELS.map((d, i) => (i === 0 ? { ...d, c: PRIMARY } : d));

    const pt = (a: number, r: number): [number, number] => [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
    const shade = (hex: string, f: number) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgb(${Math.round(((n >> 16) & 255) * f)},${Math.round(((n >> 8) & 255) * f)},${Math.round((n & 255) * f)})`;
    };

    // ONE continuous path: center -> up to top -> clockwise full circle (closes)
    const DPATH = `M ${CX} ${CY} L ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX} ${CY + R} A ${R} ${R} 0 1 1 ${CX} ${CY - R}`;
    drawline.setAttribute("d", DPATH);
    const DL = drawline.getTotalLength();
    drawline.style.strokeDasharray = String(DL);
    drawline.style.strokeDashoffset = String(DL);

    // Build solid 3D wedges (top face + outer wall + two radial walls) + labels + legend rows.
    let cum = 0;
    const meta: SliceMeta[] = DATA.map((d) => {
      const frac = d.v / TOTAL;
      const a0 = -Math.PI / 2 + cum * TAU;
      const a1 = -Math.PI / 2 + (cum + frac) * TAU;
      cum += frac;
      const am = (a0 + a1) / 2;
      const [ax, ay] = pt(a0, R);
      const [bx, by] = pt(a1, R);
      const large = a1 - a0 > Math.PI ? 1 : 0;

      const g = document.createElementNS(NS, "g");
      g.style.opacity = "0";
      const outer = document.createElementNS(NS, "path");
      outer.setAttribute("d", `M ${ax} ${ay} A ${R} ${R} 0 ${large} 1 ${bx} ${by} L ${bx} ${by + T} A ${R} ${R} 0 ${large} 0 ${ax} ${ay + T} Z`);
      outer.setAttribute("fill", shade(d.c, 0.5));
      const rW = document.createElementNS(NS, "path");
      rW.setAttribute("d", `M ${CX} ${CY} L ${bx} ${by} L ${bx} ${by + T} L ${CX} ${CY + T} Z`);
      rW.setAttribute("fill", shade(d.c, 0.62));
      const lW = document.createElementNS(NS, "path");
      lW.setAttribute("d", `M ${CX} ${CY} L ${ax} ${ay} L ${ax} ${ay + T} L ${CX} ${CY + T} Z`);
      lW.setAttribute("fill", shade(d.c, 0.4));
      const top = document.createElementNS(NS, "path");
      top.setAttribute("d", `M ${CX} ${CY} L ${ax.toFixed(1)} ${ay.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${bx.toFixed(1)} ${by.toFixed(1)} Z`);
      top.setAttribute("fill", d.c);
      top.setAttribute("stroke", "rgba(7,10,15,.5)");
      top.setAttribute("stroke-width", "2");
      top.setAttribute("stroke-linejoin", "round");
      g.appendChild(outer);
      g.appendChild(lW);
      g.appendChild(rW);
      g.appendChild(top);

      const [lx, ly] = pt(am, R + 72);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", lx.toFixed(1));
      t.setAttribute("y", ly.toFixed(1));
      t.setAttribute("fill", "#eef3fb");
      t.setAttribute("font-size", "21");
      t.setAttribute("font-weight", "700");
      t.setAttribute("text-anchor", Math.cos(am) > 0.2 ? "start" : Math.cos(am) < -0.2 ? "end" : "middle");
      t.setAttribute("dominant-baseline", "middle");
      t.textContent = d.nm;
      t.style.opacity = "0";
      labels.appendChild(t);

      const row = document.createElement("div");
      row.className = "rp-row";
      row.innerHTML = `<span class="rp-dot" style="background:${d.c}"></span><span class="rp-nm">${d.nm}</span><span class="rp-val" data-v="${d.v}">$0</span>`;
      legend.appendChild(row);

      return { g, am, sinam: Math.sin(am), outer, radw: [lW, rW], label: t, row, val: row.querySelector(".rp-val") as HTMLSpanElement };
    });
    // Draw back-to-front: slices pointing up (back) first, down (front) last.
    [...meta].sort((p, q) => p.sinam - q.sinam).forEach((m) => tiltG.appendChild(m.g));

    const render = (p: number) => {
      // 1) ONE line draws: center -> up -> clockwise -> closes  [0..0.46]
      const dr = clamp(p / 0.46, 0, 1);
      drawline.style.strokeDashoffset = String(DL * (1 - dr));
      seed.setAttribute("opacity", p > 0.004 && dr < 0.04 ? "1" : "0");
      // 2) fill slices  [0.46..0.55]
      const fillP = clamp((p - 0.46) / 0.09, 0, 1);
      // 3) tilt + the flat draw-line fades (its job is done)  [0.55..0.66]
      const tiltP = clamp((p - 0.55) / 0.11, 0, 1);
      drawline.style.opacity = (1 - tiltP).toFixed(3);
      const sy = 1 - 0.4 * tiltP;
      tiltG.setAttribute("transform", `translate(${CX} ${CY}) scale(1 ${sy.toFixed(3)}) translate(${-CX} ${-CY})`);
      // 4) reveal: solid slices lift out one by one  [0.66..0.96]
      const reveal = clamp((p - 0.66) / 0.3, 0, 1);
      center.style.opacity = String(clamp(reveal * 4, 0, 1));
      const N = meta.length;
      const step = 0.7 / N;
      const dur = 0.55;
      let shown = 0;
      meta.forEach((m, i) => {
        m.g.style.opacity = String(fillP);
        m.outer.style.opacity = String(tiltP);
        m.radw.forEach((w) => (w.style.opacity = String(tiltP)));
        const e = clamp((reveal - i * step) / dur, 0, 1);
        const ox = Math.cos(m.am) * EXPLODE * e;
        const oy = Math.sin(m.am) * EXPLODE * e - LIFT * e;
        m.g.setAttribute("transform", `translate(${ox.toFixed(1)} ${oy.toFixed(1)})`);
        m.g.setAttribute("filter", e > 0.02 ? "url(#rp-lift)" : "none");
        m.label.style.opacity = String(e);
        m.label.setAttribute("transform", `translate(0 ${(-LIFT * e * sy).toFixed(1)})`);
        const v = Number(m.val.dataset.v);
        m.val.textContent = fmt(v * e);
        m.row.classList.toggle("on", e > 0.02);
        shown += v * e;
      });
      total.textContent = fmt(shown);
    };

    let raf = 0;
    if (reduced) {
      // Static final state — full pie, slices exploded, totals + legend filled.
      render(1);
    } else {
      const tick = () => {
        const pin = pinRef.current;
        if (pin) {
          const r = pin.getBoundingClientRect();
          const p = clamp(-r.top / (r.height - window.innerHeight), 0, 1);
          render(p);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      // Clear imperatively-built nodes so a remount/StrictMode re-run can't duplicate them.
      while (tiltG.firstChild) tiltG.removeChild(tiltG.firstChild);
      while (labels.firstChild) labels.removeChild(labels.firstChild);
      legend.innerHTML = "";
    };
  }, [reduced]);

  return (
    <div ref={pinRef} className={reduced ? "rp-root rp-reduced" : "rp-root rp-pin"}>
      <style>{`
        .rp-pin{height:640vh;position:relative}
        /* Column: heading (natural height) on top, pie area fills the rest. */
        .rp-sticky{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:clamp(14px,3.5vh,32px) 0}
        .rp-head{flex:0 0 auto;width:100%;max-width:1200px;margin:0 auto;padding:0 6vw;z-index:4}
        .rp-wrap{position:relative;z-index:3;flex:1 1 auto;min-height:0;width:100%;max-width:1200px;margin:0 auto;padding:0 6vw;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(12px,2.2vh,30px)}
        /* Pie area takes the remaining vertical space; the SVG stays square and
           fits inside it (decoupled so a non-square region never stretches it). */
        .rp-piewrap{position:relative;flex:1 1 0;min-height:0;width:100%;max-width:560px;margin:0 auto;display:flex;align-items:center;justify-content:center}
        .rp-pie{height:100%;width:auto;aspect-ratio:1;max-width:100%;max-height:100%;overflow:visible}
        .rp-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;pointer-events:none;z-index:5;opacity:0}
        .rp-center .rp-v{font-size:clamp(26px,4vw,46px);font-weight:800;letter-spacing:-.02em;line-height:1;font-feature-settings:"tnum";text-shadow:0 2px 18px rgba(7,10,15,.95)}
        .rp-center .rp-l{margin-top:9px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.82);max-width:150px;text-shadow:0 2px 10px rgba(7,10,15,.95)}
        .rp-legend{flex:0 0 auto;display:flex;flex-direction:column;gap:clamp(8px,1.4vh,14px);width:100%;max-width:560px;margin:0 auto}
        .rp-legend .rp-row{display:flex;align-items:center;gap:14px;opacity:0;transform:translateX(10px);transition:opacity .35s, transform .35s}
        .rp-legend .rp-row.on{opacity:1;transform:none}
        .rp-legend .rp-dot{width:12px;height:12px;border-radius:3px;flex:none}
        .rp-legend .rp-nm{font-size:14px;font-weight:600;flex:1}
        .rp-legend .rp-val{font-size:15px;font-weight:700;font-feature-settings:"tnum";color:#DBDEE9}
        /* reduced-motion: no pin; static container has no definite height, so the
           pie sizes from width instead of flex-filling remaining space. */
        .rp-reduced{position:relative}
        .rp-reduced .rp-sticky{position:static;height:auto;min-height:0;display:flex;flex-direction:column;align-items:center;padding:40px 0}
        .rp-reduced .rp-wrap{flex:0 0 auto;min-height:0}
        .rp-reduced .rp-piewrap{flex:0 0 auto;width:100%;max-width:min(520px,82vw)}
        .rp-reduced .rp-pie{height:auto;width:100%;max-height:none}
        .rp-reduced .rp-head{margin-bottom:28px}
      `}</style>

      <div className="rp-sticky">
        <div className="rp-head">
          <div className="text-center mx-auto mb-8 lg:mb-12" style={{ maxWidth: 640 }}>
            <Reveal><div className="text-sm text-primary font-medium mb-3">Why Choose Us</div></Reveal>
            <CascadeText
              as="h2"
              delay={0.1}
              className="font-bold mb-4"
              style={{ fontSize: "clamp(28px, 5vw, 48px)", lineHeight: 1.15 }}
              segments={[
                { text: "Built for Businesses That" },
                { text: "Demand Excellence", style: { color: "hsl(var(--primary))" } },
              ]}
            />
            <Reveal delay={0.2}>
              <p className="text-base text-muted-foreground">
                Six channels. One revenue engine. Built to compound.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="rp-wrap">
          <div className="rp-piewrap">
            <svg className="rp-pie" viewBox="0 0 900 900">
              <defs>
                <filter id="rp-glw" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="rp-lift" x="-70%" y="-70%" width="240%" height="280%">
                  <feDropShadow dx="0" dy="22" stdDeviation="16" floodColor="#000" floodOpacity="0.5" />
                </filter>
                <linearGradient id="rp-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#bcd6ff" />
                  <stop offset="100%" ref={gradEndRef} stopColor="#2F80FF" />
                </linearGradient>
              </defs>
              <g ref={tiltRef} />
              <circle ref={seedRef} cx="450" cy="450" r="5" fill="#dbe8ff" filter="url(#rp-glw)" opacity="0" />
              <path
                ref={drawlineRef}
                fill="none"
                stroke="url(#rp-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#rp-glw)"
              />
              <g ref={labelsRef} />
            </svg>
            <div ref={centerRef} className="rp-center">
              <div className="rp-v" ref={totalRef}>$0</div>
              <div className="rp-l">Tracked revenue<br />all channels</div>
            </div>
          </div>
          <div className="rp-legend" ref={legendRef} />
        </div>
      </div>
    </div>
  );
}

export default RevenuePie;
