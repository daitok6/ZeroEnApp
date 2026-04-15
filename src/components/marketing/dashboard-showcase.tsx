'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from './scroll-reveal';
import { StaggerChildren, StaggerItem } from './stagger-children';
import { MockDashboard } from './mock-dashboard';

interface Bullet {
  title: string;
  body: string;
}

interface DashboardShowcaseProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  bullets: Bullet[];
  ctaLabel: string;
  ctaHref: string;
}

export function DashboardShowcase({
  eyebrow,
  heading,
  subheading,
  bullets,
  ctaLabel,
  ctaHref,
}: DashboardShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-4 bg-[#080808]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <ScrollReveal direction="up">
          <div className="mb-10 text-center">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4">
              {heading}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm max-w-lg mx-auto">
              {subheading}
            </p>
          </div>
        </ScrollReveal>

        {/* Bullets — 3-column on sm+, stacked on mobile */}
        <StaggerChildren
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
          staggerDelay={0.08}
        >
          {bullets.map((bullet) => (
            <StaggerItem key={bullet.title}>
              <div className="flex gap-3">
                <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border border-[#00E87A]/60 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A]" />
                </span>
                <div>
                  <p className="text-[#F4F4F2] font-mono font-bold text-sm mb-1">
                    {bullet.title}
                  </p>
                  <p className="text-[#6B7280] font-mono text-xs leading-relaxed">
                    {bullet.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Mock dashboard — full width */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MockDashboard />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-8 text-center"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 text-[#00E87A] font-mono text-sm font-bold group hover:gap-3 transition-all duration-150"
          >
            {ctaLabel}
            <span className="group-hover:translate-x-1 transition-transform duration-150">→</span>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
