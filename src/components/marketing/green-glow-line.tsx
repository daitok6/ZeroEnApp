'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface GreenGlowLineProps {
  className?: string;
  delay?: number;
}

export function GreenGlowLine({ className = '', delay = 0 }: GreenGlowLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className={`relative h-px ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E87A] to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00E87A]/50 to-transparent blur-sm"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1, delay: delay + 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}
