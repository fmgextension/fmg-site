import { memo, useEffect } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

// Two layers of organic curves with unique smooth cubic Bezier paths.
const SLOW_PATHS: string[] = [
  "M 0,82 C 150,140 270,48 410,82 S 665,152 810,104 S 1045,28 1190,74 S 1465,164 1620,116 S 1840,58 2000,96",
  "M 0,238 C 145,180 285,290 430,242 S 680,158 835,214 S 1065,322 1220,268 S 1480,184 1645,228 S 1845,308 2000,256",
  "M 0,388 C 135,332 280,420 420,392 S 665,310 805,372 S 1040,470 1205,408 S 1455,340 1620,376 S 1835,452 2000,402",
  "M 0,612 C 150,670 275,560 420,606 S 670,704 825,636 S 1065,528 1220,594 S 1470,728 1635,650 S 1845,560 2000,618",
  "M 0,818 C 130,768 285,852 435,822 S 680,750 840,802 S 1075,902 1225,852 S 1475,772 1645,810 S 1840,878 2000,832",
  "M 0,968 C 150,1024 285,924 435,964 S 680,1060 835,1000 S 1075,898 1235,956 S 1480,1080 1645,1010 S 1845,932 2000,974",
  "M 0,1108 C 145,1158 275,1062 425,1100 S 670,1190 825,1132 S 1065,1032 1225,1088 S 1480,1206 1640,1138 S 1845,1068 2000,1112",
];

const FAST_PATHS: string[] = [
  "M 0,158 C 180,82 340,206 520,144 S 810,54 990,132 S 1260,260 1445,172 S 1710,102 2000,156",
  "M 0,562 C 180,482 360,622 545,572 S 830,456 1015,540 S 1285,694 1470,604 S 1740,496 2000,564",
  "M 0,888 C 180,804 350,946 540,898 S 825,786 1010,866 S 1290,1018 1475,930 S 1740,826 2000,892",
  "M 0,1126 C 175,1064 360,1166 545,1132 S 830,1048 1020,1108 S 1290,1214 1475,1154 S 1745,1084 2000,1130",
];

function AnimatedWaveBackgroundBase() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const layer1Y = useTransform(scrollY, (v) => (prefersReducedMotion ? 0 : v * -0.05));
  const layer2Y = useTransform(scrollY, (v) => (prefersReducedMotion ? 0 : v * -0.15));

  const mouseX = useMotionValue(0);
  const layer1MouseX = useSpring(useTransform(mouseX, (x) => x * 30), { stiffness: 50, damping: 20 });
  const layer2MouseX = useSpring(useTransform(mouseX, (x) => x * 60), { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <motion.div style={{ position: "absolute", inset: 0, y: layer1Y, x: layer1MouseX }}>
      <div className="awb-layer awb-slow">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 2000 1200"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <g stroke="hsl(var(--primary))" strokeWidth={1.5} fill="none">
            {SLOW_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>
      </motion.div>

      <motion.div style={{ position: "absolute", inset: 0, y: layer2Y, x: layer2MouseX }}>
      <div className="awb-layer awb-fast">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 2000 1200"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <g stroke="hsl(var(--primary))" strokeWidth={1.5} fill="none">
            {FAST_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>
      </motion.div>
    </div>
  );
}

export const AnimatedWaveBackground = memo(AnimatedWaveBackgroundBase);
export default AnimatedWaveBackground;