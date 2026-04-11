import Link from 'next/link';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';

interface Pillar {
  title: string;
  desc: string;
}

interface WhyZeroEnProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  pillars: Pillar[];
  urgency: string;
  locale: string;
  ctaText: string;
}

export function WhyZeroEn({
  eyebrow,
  title,
  subtitle,
  pillars,
  urgency,
  locale,
  ctaText,
}: WhyZeroEnProps) {
  return (
    <section className="py-24 px-4 bg-[#080808]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal direction="up" className="mb-14 text-center">
          <p className="text-[#00E87A] font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#F4F4F2] whitespace-pre-line mb-4">
            {title}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm md:text-base max-w-2xl mx-auto">
            {subtitle}
          </p>
        </ScrollReveal>

        {/* Pillar grid */}
        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          staggerDelay={0.1}
        >
          {pillars.map((pillar, i) => (
            <StaggerItem key={i}>
              <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 hover:border-[#00E87A]/20 hover:shadow-[0_0_20px_rgba(0,232,122,0.06)] transition-all duration-300 h-full">
                <p className="text-[#00E87A] font-mono text-xs font-bold tracking-widest mb-3">
                  0{i + 1}
                </p>
                <h3 className="text-[#F4F4F2] font-heading font-bold mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[#6B7280] font-mono text-sm">
                  {pillar.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Urgency + CTA */}
        <ScrollReveal direction="up" className="flex flex-col items-center gap-6 text-center">
          <p className="flex items-center text-[#6B7280] font-mono text-xs uppercase tracking-[0.15em]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00E87A] mr-2 animate-pulse" />
            {urgency}
          </p>
          <Link
            href={`/${locale}/login?intent=apply`}
            className="inline-block px-8 py-3 font-heading text-sm font-bold border border-[#00E87A] text-[#00E87A] rounded hover:bg-[#00E87A] hover:text-[#0D0D0D] transition-all duration-300"
          >
            {ctaText}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
