// src/components/marketing/case-studies-preview.tsx
import Image from 'next/image';
import { ScrollReveal } from './scroll-reveal';
import { StaggerChildren, StaggerItem } from './stagger-children';

interface CaseStudyPlaceholder {
  name: string;
  desc: string;
  meta: string[];
  url?: string;
  screenshot?: string;
  label?: string;
}

interface CaseStudiesPreviewProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  comingSoon: string;
  live: string;
  placeholders: CaseStudyPlaceholder[];
}

export function CaseStudiesPreview({
  eyebrow,
  title,
  subtitle,
  comingSoon,
  live,
  placeholders,
}: CaseStudiesPreviewProps) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up">
          <div className="mb-16 text-center">
            <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-mono font-bold text-[#F4F4F2] mb-4">
              {title}
            </h2>
            <p className="text-[#6B7280] font-mono text-sm">{subtitle}</p>
          </div>
        </ScrollReveal>

        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {placeholders.map((item) => {
            const card = (
              <div className="bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden hover:border-[#00E87A]/20 hover:shadow-[0_0_20px_rgba(0,232,122,0.06)] transition-all duration-300 h-full">
                {/* Preview area */}
                <div className="relative w-full h-40 bg-[#0D0D0D] flex items-center justify-center border-b border-[#1F2937] overflow-hidden">
                  {item.screenshot ? (
                    <>
                      <Image
                        src={item.screenshot}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/60 to-transparent" />
                      <span className="absolute bottom-2 right-2 flex items-center gap-1.5 text-[#00E87A] font-mono text-[10px] uppercase tracking-widest bg-[#0D0D0D]/80 px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E87A] shadow-[0_0_6px_rgba(0,232,122,0.8)] animate-pulse" />
                        {live}
                      </span>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0,232,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,122,0.04) 1px, transparent 1px)`,
                          backgroundSize: '24px 24px',
                        }}
                      />
                      <span className="relative text-[#374151] font-mono text-xs uppercase tracking-widest">
                        {item.label ?? comingSoon}
                      </span>
                    </>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-[#F4F4F2] font-mono font-bold text-base mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[#6B7280] font-mono text-xs mb-4">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.meta.map((tag) => (
                      <span
                        key={tag}
                        className="text-[#9CA3AF] font-mono text-[10px] border border-[#374151] rounded px-2 py-0.5 uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );

            return (
              <StaggerItem key={item.name}>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    {card}
                  </a>
                ) : (
                  card
                )}
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
