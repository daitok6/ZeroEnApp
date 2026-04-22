'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { trackEvent } from '@/components/analytics/google-analytics';
import { TerminalWindow } from './terminal-window';
import { TypingEffect } from './typing-effect';

interface HeroProps {
  texts: string[];
  subtitle: string;
  ctaText: string;
  terminalCommand: string;
  locale: string;
}

export function Hero({ texts, subtitle, ctaText, terminalCommand, locale }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{
        background: '#0D0D0D',
        backgroundImage: `
          linear-gradient(rgba(0,232,122,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,232,122,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    >
      {/* Radial glow behind terminal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,232,122,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        {/* Terminal */}
        <motion.div
          className="w-full"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TerminalWindow title="zeroen — bash" className="w-full">
            <div className="space-y-4 text-sm sm:text-base">
              {/* Prompt line */}
              <div className="flex items-center gap-2">
                <span className="text-[#00E87A]">$</span>
                <span className="text-[#00E87A]">{terminalCommand}</span>
              </div>

              {/* Typing effect line */}
              <div className="flex items-center gap-2">
                <span className="text-[#6B7280]">&gt;</span>
                <TypingEffect
                  texts={texts}
                  typingSpeed={70}
                  deletingSpeed={40}
                  pauseDuration={2200}
                  className="text-[#F4F4F2] font-mono text-lg sm:text-xl font-semibold"
                />
              </div>

              {/* Subtitle line */}
              <div className="text-[#6B7280] text-xs sm:text-sm pt-2 border-t border-[#374151]/50">
                {subtitle}
              </div>
            </div>
          </TerminalWindow>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link
            href={`/${locale}/login`}
            onClick={() => trackEvent({ action: 'apply_login_click' })}
            className="
              inline-block
              bg-[#00E87A] text-[#0D0D0D]
              font-heading font-bold
              uppercase tracking-widest
              text-sm
              px-10 py-4
              rounded
              hover:bg-[#00ff88]
              active:scale-95
              transition-all duration-150
              shadow-[0_0_24px_rgba(0,232,122,0.4)]
              hover:shadow-[0_0_36px_rgba(0,232,122,0.6)]
            "
          >
            {ctaText}
          </Link>
          <a
            href="https://note.com/zeroen_dev/n/n2d8f1bb2247a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#374151] font-mono text-xs hover:text-[#6B7280] transition-colors duration-150"
          >
            {locale === 'ja'
              ? '元日立・元楽天が月¥10,000でLP制作を始める理由 →'
              : 'Why an ex-Hitachi, ex-Rakuten engineer charges ¥10,000/mo →'}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-[#374151] text-xs font-mono uppercase tracking-widest">scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-[#374151] to-transparent"
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
