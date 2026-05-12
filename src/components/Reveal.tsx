import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { fadeUp, fadeIn, scaleIn } from "@/lib/motion";

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
};

export function Reveal({
  children,
  as = "div",
  variant = "fadeUp",
  delay,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = motion(as as any) as any;
  const selected = variantMap[variant];

  if (reduced) {
    const Tag = as as any;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={selected}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Comp>
  );
}

export default Reveal;