import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Target,
  MessageSquare,
  Search,
  Mail,
  Globe,
  PhoneCall,
  type LucideIcon,
} from "lucide-react";

export type NodeKey = "paid" | "social" | "seo" | "email" | "website" | "ai";

type ConstellationNode = {
  key: NodeKey;
  label: string;
  icon: LucideIcon;
  angle: number;
  dist: number;
};

const NODES: ConstellationNode[] = [
  { key: "paid", label: "PAID MEDIA", icon: Target, angle: 350, dist: 220 },
  { key: "social", label: "SOCIAL", icon: MessageSquare, angle: 55, dist: 200 },
  { key: "seo", label: "SEO", icon: Search, angle: 110, dist: 215 },
  { key: "email", label: "EMAIL", icon: Mail, angle: 175, dist: 225 },
  { key: "website", label: "WEBSITE", icon: Globe, angle: 245, dist: 205 },
  { key: "ai", label: "RECEPTIONIST", icon: PhoneCall, angle: 295, dist: 210 },
];

const PILL_BY_KEY: Record<NodeKey, { label: string; stat: string }> = {
  paid: { label: "LAST 24H", stat: "$4,200 spend / 38 leads" },
  social: { label: "LAST 7D", stat: "2.1M impressions" },
  seo: { label: "PAGE 1 RANKINGS", stat: "47 keywords" },
  email: { label: "LAST CAMPAIGN", stat: "38% open / 12% reply" },
  website: { label: "LAST 24H", stat: "1,402 visits / 4.7% conv" },
  ai: { label: "LAST 24H", stat: "312 calls handled / 0 missed" },
};

const VIEW = 600;
const CENTER = VIEW / 2;
const NODE_SIZE = 88;
const CENTER_SIZE = 120;

function nodeCenter(n: ConstellationNode) {
  const rad = (n.angle * Math.PI) / 180;
  return {
    x: CENTER + n.dist * Math.sin(rad),
    y: CENTER - n.dist * Math.cos(rad),
  };
}

function curvedPath(n: ConstellationNode, flip: boolean) {
  const { x: nx, y: ny } = nodeCenter(n);
  const dx = CENTER - nx;
  const dy = CENTER - ny;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const startX = nx + ux * (NODE_SIZE / 2);
  const startY = ny + uy * (NODE_SIZE / 2);
  const endX = CENTER - ux * (CENTER_SIZE / 2);
  const endY = CENTER - uy * (CENTER_SIZE / 2);
  const mx = (startX + endX) / 2;
  const my = (startY + endY) / 2;
  const px = -uy;
  const py = ux;
  const off = flip ? -20 : 20;
  return {
    d: `M ${startX} ${startY} Q ${mx + px * off} ${my + py * off} ${endX} ${endY}`,
    midX: 0.25 * startX + 0.5 * (mx + px * off) + 0.25 * endX,
    midY: 0.25 * startY + 0.5 * (my + py * off) + 0.25 * endY,
  };
}

export type ConstellationProps = {
  activeKey?: NodeKey;
};

export function RevenueConstellation({ activeKey = "ai" }: ConstellationProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(false);

  // Stable randomized packet durations (one per node, persists across renders)
  const durationsRef = useRef<Record<NodeKey, number>>({} as Record<NodeKey, number>);
  if (Object.keys(durationsRef.current).length === 0) {
    NODES.forEach((n) => {
      durationsRef.current[n.key] = 2.5 + Math.random() * 1.5;
    });
  }

  // Observe own visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pause/resume SVG SMIL animations when off-screen
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (reduced) {
      svg.pauseAnimations?.();
      return;
    }
    if (inView) svg.unpauseAnimations?.();
    else svg.pauseAnimations?.();
  }, [inView, reduced]);

  // Live counter
  const [value, setValue] = useState(2419072);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (reduced || !inView) return;
    let timeoutId: number | undefined;
    let flashTimeoutId: number | undefined;
    const tick = () => {
      setValue((v) => v + 13 + Math.floor(Math.random() * 135));
      setFlash(true);
      flashTimeoutId = window.setTimeout(() => setFlash(false), 200);
      const delay = 1200 + Math.random() * 2300;
      timeoutId = window.setTimeout(tick, delay);
    };
    timeoutId = window.setTimeout(tick, 1200 + Math.random() * 2300);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (flashTimeoutId) clearTimeout(flashTimeoutId);
    };
  }, [reduced, inView]);

  const activeNode = NODES.find((n) => n.key === activeKey) ?? NODES[5];
  const activePos = nodeCenter(activeNode);
  const pill = PILL_BY_KEY[activeKey];
  const transitionDur = reduced ? 0 : 0.4;

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto"
      style={{ maxWidth: 600, aspectRatio: "1 / 1" }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="rc-packet-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {NODES.map((n, i) => {
          const isActive = n.key === activeKey;
          const { d, midX, midY } = curvedPath(n, i % 2 === 0);
          const pathId = `rc-path-${n.key}`;
          const dur = durationsRef.current[n.key];
          return (
            <g key={n.key}>
              <motion.path
                id={pathId}
                d={d}
                fill="none"
                stroke="hsl(var(--primary))"
                initial={false}
                animate={{
                  strokeOpacity: isActive ? 1 : 0.2,
                  strokeWidth: isActive ? 1.5 : 1,
                }}
                transition={{ duration: transitionDur, ease: "easeOut" }}
              />
              {reduced ? (
                <circle
                  cx={midX}
                  cy={midY}
                  r={isActive ? 3.9 : 3}
                  fill="hsl(var(--primary))"
                  opacity={isActive ? 1 : 0.5}
                />
              ) : (
                <motion.circle
                  r={isActive ? 4.5 : 3}
                  fill="hsl(var(--primary))"
                  filter="url(#rc-packet-glow)"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: transitionDur, ease: "easeOut" }}
                  style={{ willChange: "transform" }}
                >
                  <animateMotion
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </motion.circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Center node */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: `${(CENTER / VIEW) * 100}%`,
          top: `${(CENTER / VIEW) * 100}%`,
          width: `${(CENTER_SIZE / VIEW) * 100}%`,
          height: `${(CENTER_SIZE / VIEW) * 100}%`,
          transform: "translate(-50%, -50%)",
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--primary) / 0.4)",
          borderRadius: 24,
          boxShadow: "inset 0 0 24px hsl(var(--primary) / 0.15)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(14px, 3vw, 18px)",
            fontWeight: 700,
            color: "hsl(var(--foreground))",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          FMG
        </div>
        <div
          style={{
            height: 1,
            width: "60%",
            backgroundColor: "hsl(var(--border))",
            marginTop: 8,
            marginBottom: 8,
          }}
        />
        <div
          style={{
            fontSize: "clamp(12px, 2.6vw, 16px)",
            fontWeight: 600,
            color: flash ? "hsl(217 100% 72%)" : "hsl(var(--primary))",
            fontFeatureSettings: '"tnum"',
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
            minWidth: 90,
            textAlign: "center",
            transition: "color 200ms ease-out",
          }}
        >
          ${value.toLocaleString("en-US")}
        </div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 500,
            color: "hsl(var(--muted-foreground))",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          Tracked Revenue
        </div>
      </div>

      {/* Outer nodes */}
      {NODES.map((n) => {
        const { x, y } = nodeCenter(n);
        const isActive = n.key === activeKey;
        const Icon = n.icon;
        return (
          <div key={n.key}>
            <div
              className={`rc-node${isActive ? " is-active" : ""}`}
              style={{
                position: "absolute",
                left: `${(x / VIEW) * 100}%`,
                top: `${(y / VIEW) * 100}%`,
                width: `${(NODE_SIZE / VIEW) * 100}%`,
                height: `${(NODE_SIZE / VIEW) * 100}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: "hsl(var(--card))",
                borderRadius: 16,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              <Icon size={24} style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div
              style={{
                position: "absolute",
                left: `${(x / VIEW) * 100}%`,
                top: `calc(${(y / VIEW) * 100}% + ${(NODE_SIZE / 2 / VIEW) * 100}% - 18px)`,
                transform: "translate(-50%, 0)",
                fontSize: "clamp(9px, 1.8vw, 11px)",
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 1,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}

      {/* Info pill — moves to active node */}
      <motion.div
        initial={false}
        animate={{
          left: `${(activePos.x / VIEW) * 100}%`,
          top: `calc(${(activePos.y / VIEW) * 100}% + ${(NODE_SIZE / 2 / VIEW) * 100}% + 16px)`,
        }}
        transition={{ duration: transitionDur, ease: "easeOut" }}
        style={{
          position: "absolute",
          transform: "translate(-50%, 0)",
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 12,
          padding: "8px 12px",
          maxWidth: 180,
          width: "max-content",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeKey}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: "hsl(var(--muted-foreground))",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {pill.label}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                fontWeight: 500,
                color: "hsl(var(--foreground))",
                fontFeatureSettings: '"tnum"',
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}
            >
              {pill.stat}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default RevenueConstellation;