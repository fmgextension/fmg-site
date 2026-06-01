import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { useViewportInView } from "@/hooks/useViewportInView";

export type CascadeSegment = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

type CascadeTextProps = {
  children?: string;
  segments?: CascadeSegment[];
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  delay?: number;
};

type WordToken = {
  word: string;
  className?: string;
  style?: React.CSSProperties;
};

function tokenize(children: string | undefined, segments: CascadeSegment[] | undefined): WordToken[] {
  const source: CascadeSegment[] =
    segments ?? (children ? [{ text: children }] : []);

  const tokens: WordToken[] = [];
  for (const segment of source) {
    for (const word of segment.text.trim().split(/\s+/)) {
      if (!word) continue;
      tokens.push({ word, className: segment.className, style: segment.style });
    }
  }
  return tokens;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export function CascadeText({
  children,
  segments,
  as = "div",
  className,
  style,
  stagger = 0.035,
  delay = 0,
}: CascadeTextProps) {
  const reduced = useReducedMotion();
  const words = tokenize(children, segments);
  const Comp = motion[as as keyof typeof motion] as typeof motion.div;
  const Tag = as as keyof React.JSX.IntrinsicElements;
  const { ref, inView } = useViewportInView({
    amount: 0.38,
    once: true,
    disabled: !!reduced,
  });

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {words.map((token, i) => (
          <React.Fragment key={`${token.word}-${i}`}>
            {i > 0 ? " " : null}
            <span className={token.className} style={token.style}>
              {token.word}
            </span>
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Comp
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      custom={{ stagger, delay }}
    >
      {words.map((token, i) => (
        <motion.span
          key={`${token.word}-${i}`}
          variants={wordVariants}
          className={token.className}
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            marginRight: i < words.length - 1 ? "0.28em" : undefined,
            ...token.style,
          }}
        >
          {token.word}
        </motion.span>
      ))}
    </Comp>
  );
}
