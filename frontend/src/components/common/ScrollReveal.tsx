'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

/**
 * ScrollReveal is a component that animates its children when they enter the viewport.
 * @param param0
 * @returns
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const variants = {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
