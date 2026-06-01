import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, fadeIn, scaleIn } from "@/lib/motion";
import { useViewportInView } from "@/hooks/useViewportInView";

const variantMap: Record<string, Variants> = {
  fadeUp: fadeUp as Variants,
  fadeIn: fadeIn as Variants,
  scaleIn: scaleIn as Variants,
};

type RevealProps = {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: "fadeUp" | "fadeIn" | "scaleIn";
  delay?: number;
  className?: string;
  /** Skip entrance animation (e.g. hero content driven by GSAP scroll). */
  immediate?: boolean;
};

export function Reveal({
  children,
  as = "div",
  variant = "fadeUp",
  delay,
  className,
  immediate = false,
}: RevealProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useViewportInView({
    amount: 0.38,
    once: true,
    disabled: !!reduced || immediate,
  });
  const Comp = motion[as as keyof typeof motion] as typeof motion.div;
  const selected = variantMap[variant];

  if (reduced || immediate) {
    const Tag = as as keyof React.JSX.IntrinsicElements;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={selected}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}

export default Reveal;
