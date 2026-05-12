import { memo } from "react";

// Two layers of organic curves with unique cubic Bezier control points.
const SLOW_PATHS: string[] = [
  "M 0,80 C 320,40 700,140 1080,90 S 1700,70 2000,110",
  "M 0,160 C 280,210 620,110 980,170 S 1600,220 2000,150",
  "M 0,240 C 360,180 720,300 1100,240 S 1720,200 2000,260",
  "M 0,320 C 240,360 640,260 1020,330 S 1680,380 2000,300",
  "M 0,400 C 320,350 700,460 1080,400 S 1700,360 2000,420",
  "M 0,480 C 280,540 660,440 1040,500 S 1660,560 2000,470",
  "M 0,560 C 360,500 740,620 1120,560 S 1740,510 2000,580",
  "M 0,640 C 240,690 620,580 1000,650 S 1620,710 2000,620",
  "M 0,720 C 320,670 700,790 1080,720 S 1700,670 2000,750",
  "M 0,800 C 280,860 660,750 1040,820 S 1660,880 2000,790",
  "M 0,880 C 360,820 740,940 1120,880 S 1740,830 2000,910",
  "M 0,960 C 240,1010 620,910 1000,970 S 1620,1030 2000,940",
  "M 0,1040 C 320,990 700,1110 1080,1040 S 1700,990 2000,1070",
  "M 0,1120 C 280,1180 660,1070 1040,1140 S 1660,1200 2000,1110",
  "M 0,40 C 400,80 800,10 1200,60 S 1800,100 2000,50",
  "M 0,1180 C 400,1140 800,1210 1200,1160 S 1800,1120 2000,1170",
];

const FAST_PATHS: string[] = [
  "M 0,180 C 500,80 1000,280 1500,180 S 2000,140 2000,140",
  "M 0,360 C 480,460 960,260 1440,360 S 2000,420 2000,420",
  "M 0,540 C 520,420 1040,660 1560,540 S 2000,480 2000,480",
  "M 0,700 C 460,820 920,580 1380,720 S 2000,800 2000,800",
  "M 0,860 C 540,720 1080,1000 1620,860 S 2000,790 2000,790",
  "M 0,1020 C 480,1140 960,900 1440,1020 S 2000,1090 2000,1090",
  "M 0,260 C 600,200 1200,330 1800,250 S 2000,270 2000,270",
  "M 0,620 C 580,540 1160,710 1740,620 S 2000,590 2000,590",
  "M 0,940 C 620,860 1240,1030 1860,940 S 2000,920 2000,920",
  "M 0,460 C 560,560 1120,360 1680,460 S 2000,510 2000,510",
];

function AnimatedWaveBackgroundBase() {
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
      <style>{`
        @keyframes awb-drift-slow {
          from { transform: translateX(0%) scaleY(1); }
          50%  { transform: translateX(-12.5%) scaleY(1.02); }
          to   { transform: translateX(-25%) scaleY(1); }
        }
        @keyframes awb-drift-medium {
          from { transform: translateX(0%) scaleY(1); }
          50%  { transform: translateX(-16.5%) scaleY(1.02); }
          to   { transform: translateX(-33%) scaleY(1); }
        }
        .awb-layer {
          position: absolute;
          top: 0; left: 0;
          width: 200%;
          height: 100%;
          will-change: transform;
        }
        .awb-slow {
          animation: awb-drift-slow 60s linear infinite;
        }
        .awb-fast {
          animation: awb-drift-medium 45s linear infinite;
        }
        .awb-slow svg { stroke-opacity: 0.05; }
        .awb-fast svg { stroke-opacity: 0.07; }
        @media (max-width: 767px) {
          .awb-slow svg { stroke-opacity: 0.035; }
          .awb-fast svg { stroke-opacity: 0.049; }
        }
        @media (prefers-reduced-motion: reduce) {
          .awb-layer { animation: none !important; }
        }
      `}</style>

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
          <g stroke="hsl(var(--primary))" strokeWidth={1} fill="none">
            {SLOW_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>

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
          <g stroke="hsl(var(--primary))" strokeWidth={1} fill="none">
            {FAST_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}

export const AnimatedWaveBackground = memo(AnimatedWaveBackgroundBase);
export default AnimatedWaveBackground;