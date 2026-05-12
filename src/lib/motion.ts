export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.45, 0, 0.55, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  ambient: 4,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.1,
  loose: 0.16,
} as const;

export const DISTANCE = {
  sm: 12,
  base: 24,
  lg: 40,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: DISTANCE.base },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.base, delayChildren: 0.1 } },
};

export const staggerContainerTight = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.tight, delayChildren: 0.05 } },
};

export const ambientFloat = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: DURATION.ambient, ease: EASE_IN_OUT, repeat: Infinity },
  },
};