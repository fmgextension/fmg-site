import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerContainerTight } from "@/lib/motion";

type StaggerGroupProps = {
  children: React.ReactNode;
  tight?: boolean;
  className?: string;
};

export function StaggerGroup({ children, tight, className }: StaggerGroupProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={tight ? staggerContainerTight : staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export default StaggerGroup;