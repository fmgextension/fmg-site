import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type TiltState = { rx: number; ry: number };
type ShineState = { x: number; y: number; opacity: number };

type UseCardTiltOptions = {
  maxTilt?: number;
  liftPx?: number;
  enabled?: boolean;
};

export function useCardTilt({
  maxTilt = 17,
  liftPx = 7,
  enabled = true,
}: UseCardTiltOptions = {}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [canTilt, setCanTilt] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState<TiltState>({ rx: 0, ry: 0 });
  const [shine, setShine] = useState<ShineState>({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    if (reduced) {
      setCanTilt(false);
      return;
    }
    setCanTilt(window.matchMedia("(hover: hover)").matches);
  }, [reduced]);

  const interactive = enabled && canTilt && !reduced;

  const onPointerEnter = useCallback(() => {
    if (!interactive) return;
    setIsHovering(true);
  }, [interactive]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!interactive) return;
      setIsHovering(true);
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      setTilt({
        ry: (x - 0.5) * maxTilt * 2,
        rx: -(y - 0.5) * maxTilt * 2,
      });
      setShine({ x: x * 100, y: y * 100, opacity: 1 });
    },
    [interactive, maxTilt],
  );

  const onPointerLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rx: 0, ry: 0 });
    setShine((s) => ({ ...s, opacity: 0 }));
  }, []);

  const cardStyle: React.CSSProperties = interactive && isHovering
    ? {
        transform: `translateY(-${liftPx}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1)`,
        transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out",
        boxShadow:
          "0 22px 50px hsl(0 0% 0% / 0.42), 0 0 36px hsl(var(--primary) / 0.28)",
        borderColor: "hsl(var(--primary) / 0.55)",
      }
    : {
        transform: undefined,
        transition: "transform 0.25s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out",
        boxShadow: undefined,
      };

  const shineVars = {
    "--shine-x": `${shine.x}%`,
    "--shine-y": `${shine.y}%`,
    "--shine-o": shine.opacity,
  } as React.CSSProperties;

  return {
    ref,
    reduced: !!reduced,
    interactive,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
    cardStyle,
    shineVars,
  };
}
