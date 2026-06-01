import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerContainerTight } from "@/lib/motion";
import { useViewportInView } from "@/hooks/useViewportInView";

type StaggerGroupProps = {
  children: React.ReactNode;
  tight?: boolean;
  className?: string;
  immediate?: boolean;
};

export function StaggerGroup({ children, tight, className, immediate = false }: StaggerGroupProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useViewportInView({
    amount: 0.35,
    once: true,
    disabled: !!reduced || immediate,
  });

  if (reduced || immediate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={tight ? staggerContainerTight : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export default StaggerGroup;
