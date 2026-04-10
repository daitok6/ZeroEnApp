// src/components/marketing/tech-stack-terminal.tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TerminalWindow } from './terminal-window';

interface Tool {
  name: string;
  tag: string;
  desc: string;
}

interface TechStackTerminalProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  terminalTitle: string;
  lines: string[];
  tools: Tool[];
}

const TOOL_KEYWORDS = ['next@15', 'supabase', 'vercel', 'stripe', 'next@15 を', 'supabase を', 'vercel を', 'stripe を'];

function HighlightedLine({ text }: { text: string }) {
  const lowerText = text.toLowerCase();
  const keyword = TOOL_KEYWORDS.find((k) => lowerText.includes(k));

  if (!keyword) {
    const isSuccess = text.startsWith('✓');
    return (
      <span className={isSuccess ? 'text-[#00E87A]' : 'text-[#9CA3AF]'}>
        {text}
      </span>
    );
  }

  const idx = lowerText.indexOf(keyword);
  return (
    <span className="text-[#9CA3AF]">
      {text.slice(0, idx)}
      <span className="text-[#00E87A] font-bold">{text.slice(idx, idx + keyword.length)}</span>
      {text.slice(idx + keyword.length)}
    </span>
  );
}

export function TechStackTerminal({
  eyebrow,
  title,
  subtitle,
  terminalTitle,
  lines,
  tools,
}: TechStackTerminalProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#F4F4F2] mb-4 whitespace-pre-line">
            {title}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          className="mb-10"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <TerminalWindow title={terminalTitle} className="w-full">
            <div className="space-y-2 text-sm font-mono">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.45 }}
                >
                  {i === 0 ? (
                    <span>
                      <span className="text-[#00E87A]">$ </span>
                      <span className="text-[#F4F4F2]">{line.replace('$ ', '')}</span>
                    </span>
                  ) : (
                    <HighlightedLine text={line} />
                  )}
                </motion.div>
              ))}
            </div>
          </TerminalWindow>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="bg-[#111827] border border-[#1F2937] rounded-lg p-4 hover:border-[#00E87A]/30 transition-colors duration-200"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            >
              <p className="text-[#00E87A] font-mono text-[10px] uppercase tracking-widest mb-1">
                {tool.tag}
              </p>
              <p className="text-[#F4F4F2] font-mono font-bold text-sm mb-2">
                {tool.name}
              </p>
              <p className="text-[#6B7280] font-mono text-xs leading-relaxed">
                {tool.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
