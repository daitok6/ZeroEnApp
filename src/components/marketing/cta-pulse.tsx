'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface CtaPulseProps {
  children: React.ReactNode;
  className?: string;
}

export function CtaPulse({ children, className = '' }: CtaPulseProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={`inline-flex ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      className={`inline-flex ${className}`}
      animate={{
        filter: [
          'drop-shadow(0 0 8px rgba(0,232,122,0.35))',
          'drop-shadow(0 0 22px rgba(0,232,122,0.75))',
          'drop-shadow(0 0 8px rgba(0,232,122,0.35))',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
