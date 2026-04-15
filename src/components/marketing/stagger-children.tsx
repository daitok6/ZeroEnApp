'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;   // seconds between children (default: 0.1)
  childDelay?: number;     // initial delay before first child (default: 0)
  once?: boolean;
}

const containerVariants = (staggerDelay: number, childDelay: number) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: childDelay,
    },
  },
});

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export function StaggerChildren({
  children,
  className = '',
  staggerDelay = 0.1,
  childDelay = 0,
  once = true,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  // Skip stagger animation for users who prefer reduced motion
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      variants={containerVariants(staggerDelay, childDelay)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Wrap each child item in this for stagger effect
export function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}
