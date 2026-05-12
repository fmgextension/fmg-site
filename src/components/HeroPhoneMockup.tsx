import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Wifi, Battery, Signal } from "lucide-react";
import { EASE_IN_OUT } from "@/lib/motion";

type Speaker = "AI" | "MIKE";
type Line = { id: number; speaker: Speaker; text: string };

const SCRIPT: Omit<Line, "id">[] = [
  { speaker: "AI", text: "Hi, this is FMG roofing — how can I help you today?" },
  { speaker: "MIKE", text: "Hey, I've got a leak in my roof from the storm last night." },
  { speaker: "AI", text: "Sorry to hear that. I can book you for an inspection — what's your zip code?" },
  { speaker: "MIKE", text: "07041, in Millburn." },
  { speaker: "AI", text: "Got it. We have an opening tomorrow at 10 AM or Thursday at 2 PM. Which works?" },
  { speaker: "MIKE", text: "Tomorrow at 10 works." },
  { speaker: "AI", text: "Perfect, I've booked you for 10 AM tomorrow. You'll get a text confirmation shortly." },
];

const MAX_VISIBLE = 4;

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export function HeroPhoneMockup() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [seconds, setSeconds] = useState(reduced ? 42 : 0);
  const [lines, setLines] = useState<Line[]>(
    reduced ? SCRIPT.slice(-MAX_VISIBLE).map((l, i) => ({ ...l, id: i })) : [],
  );
  const idxRef = useRef(0);
  const nextIdRef = useRef(1000);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Call timer
  useEffect(() => {
    if (reduced || !inView) return;
    const id = window.setInterval(() => {
      setSeconds((s) => (s + 1) % 180);
    }, 1000);
    return () => clearInterval(id);
  }, [reduced, inView]);

  // Transcript advancement
  useEffect(() => {
    if (reduced || !inView) return;
    let timeoutId: number | undefined;
    const tick = () => {
      const i = idxRef.current;
      if (i >= SCRIPT.length) {
        // Reset loop
        setLines([]);
        idxRef.current = 0;
        timeoutId = window.setTimeout(tick, 4000);
        return;
      }
      const next: Line = { ...SCRIPT[i], id: nextIdRef.current++ };
      setLines((prev) => {
        const updated = [...prev, next];
        return updated.length > MAX_VISIBLE ? updated.slice(updated.length - MAX_VISIBLE) : updated;
      });
      idxRef.current = i + 1;
      const delay = 2500 + Math.random() * 1000;
      timeoutId = window.setTimeout(tick, delay);
    };
    timeoutId = window.setTimeout(tick, 800);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [reduced, inView]);

  const dotPulse = reduced
    ? {}
    : { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{
        width: "100%",
        maxWidth: "var(--phone-max, 320px)",
        aspectRatio: "9 / 19.5",
        borderRadius: 44,
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        boxShadow:
          "0 0 60px hsl(var(--primary) / 0.15), 0 20px 40px hsl(0 0% 0% / 0.5)",
        padding: 12,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <div
        className="relative flex flex-col w-full h-full overflow-hidden"
        style={{
          background: "hsl(var(--background))",
          borderRadius: 32,
        }}
      >
        {/* Status bar */}
        <div
          className="flex items-center justify-between"
          style={{
            height: 24,
            padding: "8px 20px",
            fontSize: 11,
            fontWeight: 600,
            color: "hsl(0 0% 100% / 0.8)",
            fontFeatureSettings: '"tnum"',
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>9:41</span>
          <div className="flex items-center" style={{ gap: 5 }}>
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={14} />
          </div>
        </div>

        {/* Incoming call header */}
        <div
          className="flex flex-col items-center"
          style={{ padding: "16px 20px 12px", gap: 4 }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Incoming Call
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "hsl(0 0% 100%)",
              marginTop: 4,
            }}
          >
            Mike Reynolds
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Local — Roofing inquiry
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 14,
              fontWeight: 500,
              color: "hsl(var(--primary))",
              fontFeatureSettings: '"tnum"',
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fmtTime(seconds)}
          </div>

          {/* AI handling badge */}
          <div
            className="flex items-center"
            style={{
              margin: "8px auto 0",
              padding: "6px 12px",
              background: "hsl(var(--primary) / 0.1)",
              border: "1px solid hsl(var(--primary) / 0.3)",
              borderRadius: 999,
              gap: 6,
            }}
          >
            <motion.span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "hsl(var(--primary))",
                display: "inline-block",
              }}
              animate={dotPulse}
              transition={{ duration: 1.5, ease: EASE_IN_OUT, repeat: Infinity }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "hsl(var(--primary))",
              }}
            >
              AI HANDLING
            </span>
          </div>
        </div>

        {/* Transcript area */}
        <div
          className="flex flex-col"
          style={{
            flex: "1 1 auto",
            padding: "8px 16px",
            overflow: "hidden",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <AnimatePresence initial={false}>
            {lines.map((line) => {
              const isAI = line.speaker === "AI";
              return (
                <motion.div
                  key={line.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isAI ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                    alignSelf: isAI ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: isAI
                        ? "hsl(var(--primary) / 0.7)"
                        : "hsl(var(--muted-foreground) / 0.7)",
                      marginBottom: 2,
                    }}
                  >
                    {isAI ? "AI" : "MIKE"}
                  </div>
                  <div
                    style={{
                      padding: "8px 12px",
                      fontSize: 11,
                      fontWeight: 500,
                      lineHeight: 1.3,
                      borderRadius: isAI
                        ? "14px 14px 14px 4px"
                        : "14px 14px 4px 14px",
                      background: isAI
                        ? "hsl(var(--primary) / 0.15)"
                        : "hsl(var(--muted))",
                      color: isAI
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {line.text}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom stats strip */}
        <div
          style={{
            background: "hsl(var(--card))",
            borderTop: "1px solid hsl(var(--border))",
            padding: "12px 16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {[
            { l: "INTENT", v: "Booking", c: "hsl(0 0% 100%)" },
            { l: "SENTIMENT", v: "Positive", c: "hsl(var(--primary))" },
            { l: "LEAD SCORE", v: "92 / 100", c: "hsl(0 0% 100%)" },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {s.l}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: s.c,
                  marginTop: 2,
                }}
              >
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroPhoneMockup;
