import { Target, MessageSquare, Search, Mail, Globe, PhoneCall, type LucideIcon } from "lucide-react";

type NodeKey = "paid" | "social" | "seo" | "email" | "website" | "ai";

type ConstellationNode = {
  key: NodeKey;
  label: string;
  icon: LucideIcon;
  angle: number; // degrees from 12 o'clock, clockwise
  dist: number; // px from center in 600x600 viewbox
};

const NODES: ConstellationNode[] = [
  { key: "paid", label: "PAID MEDIA", icon: Target, angle: 350, dist: 220 },
  { key: "social", label: "SOCIAL", icon: MessageSquare, angle: 55, dist: 200 },
  { key: "seo", label: "SEO", icon: Search, angle: 110, dist: 215 },
  { key: "email", label: "EMAIL", icon: Mail, angle: 175, dist: 225 },
  { key: "website", label: "WEBSITE", icon: Globe, angle: 245, dist: 205 },
  { key: "ai", label: "AI RECEPTIONIST", icon: PhoneCall, angle: 295, dist: 210 },
];

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

// Compute Bezier path from outer node edge -> center node edge,
// with a perpendicular control offset for a subtle curve.
function curvedPath(n: ConstellationNode, flip: boolean) {
  const { x: nx, y: ny } = nodeCenter(n);
  const dx = CENTER - nx;
  const dy = CENTER - ny;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // Approximate edge offsets (squares -> use half-size as a rough inset)
  const startX = nx + ux * (NODE_SIZE / 2);
  const startY = ny + uy * (NODE_SIZE / 2);
  const endX = CENTER - ux * (CENTER_SIZE / 2);
  const endY = CENTER - uy * (CENTER_SIZE / 2);
  const mx = (startX + endX) / 2;
  const my = (startY + endY) / 2;
  // perpendicular
  const px = -uy;
  const py = ux;
  const off = flip ? -20 : 20;
  const cxp = mx + px * off;
  const cyp = my + py * off;
  return {
    d: `M ${startX} ${startY} Q ${cxp} ${cyp} ${endX} ${endY}`,
    // midpoint of quadratic at t=0.5
    midX: 0.25 * startX + 0.5 * cxp + 0.25 * endX,
    midY: 0.25 * startY + 0.5 * cyp + 0.25 * endY,
  };
}

export type ConstellationProps = {
  activeKey?: NodeKey;
  pillText?: { label: string; stat: string };
  counterValue?: string;
};

export function RevenueConstellation({
  activeKey = "ai",
  pillText = { label: "LAST 24H", stat: "312 calls handled / 0 missed" },
  counterValue = "$2,419,072",
}: ConstellationProps) {
  return (
    <div className="relative w-full mx-auto" style={{ maxWidth: 600, aspectRatio: "1 / 1" }}>
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {NODES.map((n, i) => {
          const isActive = n.key === activeKey;
          const { d, midX, midY } = curvedPath(n, i % 2 === 0);
          return (
            <g key={n.key}>
              <path
                d={d}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={isActive ? 1.5 : 1}
                strokeOpacity={isActive ? 1 : 0.2}
              />
              <circle
                cx={midX}
                cy={midY}
                r={isActive ? 3 * 1.3 : 3}
                fill="hsl(var(--primary))"
                opacity={isActive ? 1 : 0.5}
              />
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
            color: "hsl(var(--primary))",
            fontFeatureSettings: '"tnum"',
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {counterValue}
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
              className="absolute flex flex-col items-center justify-center"
              style={{
                left: `${(x / VIEW) * 100}%`,
                top: `${(y / VIEW) * 100}%`,
                width: `${(NODE_SIZE / VIEW) * 100}%`,
                height: `${(NODE_SIZE / VIEW) * 100}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: "hsl(var(--card))",
                border: isActive
                  ? "1px solid hsl(var(--primary))"
                  : "1px solid hsl(var(--border))",
                borderRadius: 16,
                boxShadow: isActive
                  ? "0 0 32px hsl(var(--primary) / 0.3)"
                  : "none",
                transition: "border-color 300ms ease-out, box-shadow 300ms ease-out",
              }}
            >
              <Icon size={24} style={{ color: "hsl(var(--primary))" }} />
              <div
                style={{
                  marginTop: 6,
                  fontSize: "clamp(9px, 1.8vw, 11px)",
                  fontWeight: 600,
                  color: "hsl(var(--foreground))",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  lineHeight: 1.1,
                  padding: "0 4px",
                }}
              >
                {n.label}
              </div>
            </div>

            {isActive && (
              <div
                className="absolute"
                style={{
                  left: `${(x / VIEW) * 100}%`,
                  top: `calc(${(y / VIEW) * 100}% + ${(NODE_SIZE / 2 / VIEW) * 100}% + 16px)`,
                  transform: "translate(-50%, 0)",
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  padding: "8px 12px",
                  maxWidth: 180,
                  width: "max-content",
                  zIndex: 2,
                }}
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
                  {pillText.label}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "hsl(var(--foreground))",
                    fontFeatureSettings: '"tnum"',
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {pillText.stat}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RevenueConstellation;