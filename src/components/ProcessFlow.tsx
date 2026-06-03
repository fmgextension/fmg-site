import { useEffect, useRef } from "react";

const STEPS = [
  { t: "Strategize", ic: "pf-ic-target", d: "Find the opportunity, build the plan." },
  { t: "Launch",     ic: "pf-ic-rocket", d: "Build the foundation and go to market." },
  { t: "Manage",     ic: "pf-ic-gear",   d: "Run operations, optimize, stay consistent." },
  { t: "Grow",       ic: "pf-ic-graph",  d: "Acquire customers, lift revenue." },
  { t: "Scale",      ic: "pf-ic-globe",  d: "Expand systems and long-term impact." },
];
const VW = 1600, VH = 900;
const N = STEPS.length;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

// rising trend anchors + gentle volatility, then SMOOTH (Catmull-Rom) = stock-like but flowing
const nodeX = STEPS.map((_, i) => 150 + i * ((VW - 300) / (N - 1)));
const trendY = [600, 520, 475, 365, 290];
const nodeY = trendY.slice();
const nodePct = nodeX.map((x) => (x / VW) * 100);

function rng(s: number) { return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
const rand = rng(4471);
const pts: [number, number][] = [[0, trendY[0] + (rand() - 0.5) * 34]];
for (let i = 0; i < N; i++) {
  pts.push([nodeX[i], trendY[i]]);
  if (i < N - 1) {
    const seg = 3;
    for (let k = 1; k < seg; k++) {
      const t = k / seg;
      const x = nodeX[i] + (nodeX[i + 1] - nodeX[i]) * t;
      const base = trendY[i] + (trendY[i + 1] - trendY[i]) * t;
      pts.push([x, base + (rand() - 0.5) * 52]);
    }
  }
}
pts.push([VW, trendY[N - 1] + (rand() - 0.5) * 26]);

function smooth(P: [number, number][]) {
  if (P.length < 3) return "M" + P.map((p) => p.join(" ")).join(" L");
  let d = "M" + P[0][0].toFixed(1) + " " + P[0][1].toFixed(1);
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
const D_PATH = smooth(pts);

// invisible drop paths from Launch/Manage/Grow -> the 3 numbers
const statX = [0.187, 0.5, 0.813].map((f) => f * VW);
const fromIdx = [1, 2, 3];
const TY = 792;
const DROP_D = statX.map((sx, i) => {
  const fi = fromIdx[i], fx = nodeX[fi], fy = nodeY[fi] + 22;
  return `M ${fx} ${fy} C ${fx} ${fy + 120}, ${sx} ${TY - 150}, ${sx} ${TY}`;
});

const STAT = [
  { count: 500, suffix: "+", dec: 0, label: "Businesses Served" },
  { count: 10000, suffix: "+", dec: 0, label: "Calls Handled / Day" },
  { count: 4.9, suffix: "", dec: 1, label: "Average Rating" },
];

export function ProcessFlow() {
  const pinRef = useRef<HTMLElement>(null);
  const flowheadRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dropRefs = useRef<(SVGPathElement | null)[]>([]);
  const ballRefs = useRef<(SVGCircleElement | null)[]>([]);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = drawRef.current;
    if (!draw) return;
    const L = draw.getTotalLength();
    draw.style.strokeDasharray = String(L);

    const lit = new Array(N).fill(false);
    const done = new Array(3).fill(false);
    const dropLen = dropRefs.current.map((p) => (p ? p.getTotalLength() : 0));

    if (reduce) {
      draw.style.strokeDashoffset = "0";
      if (inkRef.current) inkRef.current.style.setProperty("--edge", "102%");
      if (flowheadRef.current) { flowheadRef.current.style.opacity = "1"; flowheadRef.current.style.transform = "none"; }
      cellRefs.current.forEach((c) => c && c.classList.add("on"));
      valRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = STAT[i];
        el.textContent = (s.dec ? s.count.toFixed(s.dec) : Math.round(s.count).toLocaleString()) + s.suffix;
      });
      return;
    }

    draw.style.strokeDashoffset = String(L);

    const fastCount = (i: number) => {
      const el = valRefs.current[i];
      if (!el || done[i]) return;
      done[i] = true;
      const s = STAT[i], dur = 850, t0 = performance.now();
      const stepFn = (now: number) => {
        const k = clamp((now - t0) / dur, 0, 1), ev = 1 - Math.pow(1 - k, 3), val = s.count * ev;
        el.textContent = (s.dec ? val.toFixed(s.dec) : Math.round(val).toLocaleString()) + s.suffix;
        if (k < 1) requestAnimationFrame(stepFn);
      };
      requestAnimationFrame(stepFn);
    };

    let raf = 0;
    const tick = () => {
      const pin = pinRef.current;
      if (pin) {
        const r = pin.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - window.innerHeight), 0, 1);

        const hf = clamp(p / 0.10, 0, 1);
        if (flowheadRef.current) {
          flowheadRef.current.style.opacity = String(hf);
          flowheadRef.current.style.transform = `translateY(${(1 - hf) * 22}px)`;
        }

        const dp = clamp(p / 0.50, 0, 1);
        const drawn = L * dp;
        draw.style.strokeDashoffset = String(L - drawn);
        if (dp > 0 && dp < 1) {
          const pt = draw.getPointAtLength(drawn);
          const edge = (pt.x / VW) * 100;
          inkRef.current?.style.setProperty("--edge", edge + "%");
          nodeRefs.current.forEach((nd, i) => {
            if (nd && !lit[i] && edge >= nodePct[i]) { lit[i] = true; nd.classList.add("lit"); }
          });
        } else if (dp >= 1) {
          inkRef.current?.style.setProperty("--edge", "102%");
        } else {
          inkRef.current?.style.setProperty("--edge", "0%");
        }

        dropRefs.current.forEach((pa, i) => {
          const start = 0.54 + i * 0.11, dur = 0.18, tp = clamp((p - start) / dur, 0, 1);
          const ball = ballRefs.current[i];
          if (pa && ball && tp > 0 && tp < 1) {
            const t = tp * tp;
            const ptn = pa.getPointAtLength(dropLen[i] * t);
            ball.setAttribute("cx", String(ptn.x));
            ball.setAttribute("cy", String(ptn.y));
            ball.setAttribute("opacity", "1");
          } else if (ball) {
            ball.setAttribute("opacity", "0");
          }
          if (tp >= 1) { cellRefs.current[i]?.classList.add("on"); fastCount(i); }
          else { cellRefs.current[i]?.classList.remove("on"); done[i] = false; }
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="pf" ref={pinRef}>
      <style>{`
        .pf{height:540vh;position:relative}
        .pf-sticky{position:sticky;top:0;height:100vh;overflow:hidden}
        .pf-fiber{position:absolute;inset:0;overflow:hidden;background:#070A0F}
        .pf-fiber video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .pf-fiber-grade{position:absolute;inset:0;background:linear-gradient(180deg, rgba(7,10,15,.6), rgba(7,10,15,.45) 45%, rgba(7,10,15,.7))}
        .pf-flowhead{position:absolute;top:6vh;left:0;right:0;text-align:center;z-index:6;opacity:0;will-change:opacity,transform}
        .pf-flowhead .pf-eye{font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:#2F80FF;font-weight:600}
        .pf-flowhead h2{font-size:clamp(26px,4vw,44px);font-weight:800;letter-spacing:-.02em;margin-top:10px;color:#fff}
        .pf-flowhead h2 .b{color:#2F80FF}
        .pf-canvas{position:absolute;inset:0;z-index:3}
        svg.pf-snake{position:absolute;inset:0;width:100%;height:100%;overflow:visible;z-index:5;pointer-events:none}
        .pf-ink{position:absolute;inset:0;z-index:4;
          -webkit-mask-image:linear-gradient(90deg,#000 0,#000 var(--edge,0%),transparent calc(var(--edge,0%) + 2.2%));
          mask-image:linear-gradient(90deg,#000 0,#000 var(--edge,0%),transparent calc(var(--edge,0%) + 2.2%));}
        .pf-node{position:absolute;transform:translate(-50%,-50%);width:min(210px,18vw);text-align:center}
        .pf-node .pf-glyph{width:42px;height:42px;stroke:#fff;stroke-width:1.4;fill:none;stroke-linecap:round;stroke-linejoin:round;margin:0 auto 12px;display:block}
        .pf-node .pf-glyph .accent{stroke:#2F80FF}
        .pf-node .pf-stepno{font-size:13px;letter-spacing:.28em;font-weight:700;color:#eef3fb;margin-bottom:6px;text-shadow:0 0 6px rgba(7,10,15,.95),0 0 12px rgba(7,10,15,.8)}
        .pf-node .pf-title{font-size:21px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px;color:#fff}
        .pf-node .pf-desc{font-size:12px;line-height:1.5;color:rgba(219,222,233,.62)}
        @keyframes pf-chargeFlash{0%{filter:brightness(1.9) drop-shadow(0 0 18px rgba(47,128,255,.9));}100%{filter:brightness(1) drop-shadow(0 0 0 rgba(47,128,255,0));}}
        .pf-node.lit{animation:pf-chargeFlash .8s ease-out}
        .pf-statsrow{position:absolute;bottom:6vh;left:5vw;right:5vw;z-index:6;display:grid;grid-template-columns:repeat(3,1fr)}
        .pf-statsrow .pf-c{padding:22px 18px 0;text-align:center;border-right:1px solid transparent;border-top:1px solid transparent;visibility:hidden;opacity:0;transform:translateY(14px)}
        .pf-statsrow .pf-c:last-child{border-right:none}
        .pf-statsrow .pf-c.on{visibility:visible;opacity:1;transform:none;border-top:1px solid rgba(219,222,233,.12);transition:opacity .3s, transform .3s}
        .pf-statsrow .pf-c.on:not(:last-child){border-right:1px solid rgba(219,222,233,.12)}
        .pf-statsrow .pf-v{font-size:clamp(34px,5.4vw,76px);font-weight:800;letter-spacing:-.03em;line-height:1;font-feature-settings:"tnum";color:#fff}
        .pf-statsrow .pf-l{margin-top:12px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(219,222,233,.55)}
      `}</style>

      <div className="pf-sticky">
        <div className="pf-fiber" aria-hidden="true">
          <video src="/blue%20fiber%20optic%20cables.mp4" autoPlay muted loop playsInline preload="metadata" />
          <div className="pf-fiber-grade" />
        </div>
        <div className="pf-flowhead" ref={flowheadRef}>
          <div className="pf-eye">HOW WE WORK</div>
          <h2>One <span className="b">system</span>, end to end.</h2>
        </div>

        <div className="pf-ink" ref={inkRef}>
          <div className="pf-canvas">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="pf-node"
                ref={(el) => { nodeRefs.current[i] = el; }}
                style={{ left: `${(nodeX[i] / VW) * 100}%`, top: `${(nodeY[i] / VH) * 100}%` }}
              >
                <svg className="pf-glyph" viewBox="0 0 42 42"><use href={`#${s.ic}`} /></svg>
                <div className="pf-stepno">0{i + 1}</div>
                <div className="pf-title">{s.t}</div>
                <div className="pf-desc">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        <svg className="pf-snake" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <filter id="pf-glw" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="pf-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9cc4ff" /><stop offset="100%" stopColor="#2F80FF" />
            </linearGradient>
          </defs>
          <path d={D_PATH} fill="none" stroke="rgba(150,190,255,.07)" strokeWidth={2.5} />
          <g>
            {DROP_D.map((d, i) => (
              <path key={i} ref={(el) => { dropRefs.current[i] = el; }} d={d} fill="none" stroke="none" />
            ))}
          </g>
          <path ref={drawRef} d={D_PATH} fill="none" stroke="url(#pf-grad)" strokeWidth={3} filter="url(#pf-glw)" strokeLinecap="round" strokeLinejoin="round" />
          <g>
            {[0, 1, 2].map((i) => (
              <circle key={i} ref={(el) => { ballRefs.current[i] = el; }} r={6} fill="#eaf2ff" filter="url(#pf-glw)" opacity={0} />
            ))}
          </g>
        </svg>

        <div className="pf-statsrow">
          {STAT.map((s, i) => (
            <div key={i} className="pf-c" ref={(el) => { cellRefs.current[i] = el; }}>
              <div className="pf-v" ref={(el) => { valRefs.current[i] = el; }}>0</div>
              <div className="pf-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* hidden icon defs */}
      <svg style={{ display: "none" }}><defs>
        <g id="pf-ic-target"><circle cx="21" cy="21" r="15" /><circle cx="21" cy="21" r="8" /><circle className="accent" cx="21" cy="21" r="3" fill="#2F80FF" stroke="none" /><path className="accent" d="M21 21 L34 8" /></g>
        <g id="pf-ic-rocket"><path d="M21 5c7.5 5.5 9 13 7 22l-7 5.5-7-5.5c-2-9 -.5-16.5 7-22z" /><circle className="accent" cx="21" cy="16" r="3.6" /><path className="accent" d="M14 31l-4.5 6.5M28 31l4.5 6.5" /></g>
        <g id="pf-ic-gear"><circle cx="21" cy="21" r="7" /><path d="M21 5v5.5M21 31.5v5.5M5 21h5.5M31.5 21h5.5M9 9l3.8 3.8M33 33l-3.8-3.8M33 9l-3.8 3.8M9 33l3.8-3.8" /></g>
        <g id="pf-ic-graph"><path d="M7 35V7M7 35h28" /><rect x="11" y="24" width="5.5" height="11" className="accent" /><rect x="20" y="16" width="5.5" height="19" className="accent" /><rect x="29" y="10" width="5.5" height="25" className="accent" /></g>
        <g id="pf-ic-globe"><circle cx="21" cy="21" r="15" /><path d="M6 21h30M21 6c6.5 6.5 6.5 23.5 0 30M21 6c-6.5 6.5-6.5 23.5 0 30" /></g>
      </defs></svg>
    </section>
  );
}
