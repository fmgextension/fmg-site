import { memo } from "react";

type Variant = "hero" | "services" | "cta";

type Props = { variant: Variant; className?: string };

// Hand-tuned irregular curves per variant. viewBox 1440 x 800.
const PATHS: Record<Variant, string[]> = {
  hero: [
    "M0,420 C240,360 480,500 720,440 C960,380 1200,500 1440,430",
    "M0,460 C260,400 500,540 740,470 C980,400 1220,520 1440,460",
    "M0,500 C220,440 460,580 700,510 C940,440 1180,560 1440,500",
    "M0,540 C280,480 520,610 760,540 C1000,470 1240,590 1440,535",
    "M0,580 C240,520 480,650 720,580 C960,510 1200,630 1440,575",
    "M0,620 C260,560 500,690 740,620 C980,550 1220,670 1440,615",
    "M0,655 C220,600 460,720 700,650 C940,580 1180,700 1440,650",
    "M0,690 C280,635 520,755 760,685 C1000,615 1240,735 1440,685",
    "M0,720 C240,665 480,785 720,715 C960,645 1200,765 1440,715",
    "M0,748 C260,695 500,810 740,745 C980,680 1220,790 1440,745",
    "M0,772 C220,725 460,830 700,770 C940,710 1180,810 1440,770",
    "M0,792 C280,750 520,845 760,790 C1000,735 1240,825 1440,790",
    "M0,250 C320,210 640,300 960,260 C1200,230 1320,270 1440,255",
    "M0,310 C300,270 600,360 900,310 C1180,265 1330,305 1440,300",
  ],
  services: [
    "M0,60 C260,30 520,130 780,80 C1040,30 1240,110 1440,70",
    "M0,110 C300,70 580,170 860,120 C1100,80 1300,150 1440,115",
    "M0,160 C220,120 480,210 740,165 C1000,125 1240,195 1440,160",
    "M0,210 C320,170 600,250 880,210 C1140,175 1320,235 1440,205",
    "M0,610 C260,570 520,670 780,620 C1040,575 1240,650 1440,610",
    "M0,660 C300,615 580,720 860,670 C1100,625 1300,695 1440,660",
    "M0,710 C220,670 480,760 740,720 C1000,680 1240,750 1440,715",
    "M0,760 C320,720 600,810 880,765 C1140,725 1320,790 1440,760",
  ],
  cta: [
    "M0,180 C320,260 580,340 720,400 C860,460 1120,520 1440,600",
    "M0,240 C340,300 600,360 720,400 C840,440 1100,480 1440,560",
    "M0,300 C360,340 620,380 720,400 C820,420 1080,440 1440,520",
    "M0,360 C380,380 640,395 720,400 C800,405 1060,420 1440,470",
    "M0,420 C380,415 640,405 720,400 C800,395 1060,385 1440,360",
    "M0,480 C360,460 620,420 720,400 C820,380 1080,345 1440,300",
    "M0,540 C340,500 600,440 720,400 C840,360 1100,310 1440,250",
    "M0,600 C320,540 580,460 720,400 C860,340 1120,260 1440,190",
    "M0,120 C300,200 560,330 720,400 C880,470 1140,560 1440,660",
    "M0,680 C300,600 560,470 720,400 C880,330 1140,210 1440,140",
  ],
};

const OPACITY: Record<Variant, number> = {
  hero: 0.1,
  services: 0.06,
  cta: 0.08,
};

function WaveTextureBase({ variant, className }: Props) {
  const baseOpacity = OPACITY[variant];
  const paths = PATHS[variant];
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        // Mobile: reduce visibility to 70%
        opacity: 1,
      }}
    >
      <style>{`
        .wave-tex-${variant} { opacity: 1; }
        @media (max-width: 767px) {
          .wave-tex-${variant} { opacity: 0.7; }
        }
      `}</style>
      <svg
        className={`wave-tex-${variant}`}
        width="100%"
        height="100%"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <g
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeOpacity={baseOpacity}
          fill="none"
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export const WaveTexture = memo(WaveTextureBase);
export default WaveTexture;