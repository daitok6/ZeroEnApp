// src/components/marketing/case-studies-preview.tsx
import { ScrollReveal } from './scroll-reveal';
import { StaggerChildren, StaggerItem } from './stagger-children';

interface CaseStudyPlaceholder {
  name: string;
  desc: string;
  stack: string[];
}

interface CaseStudiesPreviewProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  comingSoon: string;
  placeholders: CaseStudyPlaceholder[];
}

export function CaseStudiesPreview({
  eyebrow,
  title,
  subtitle,
  comingSoon,
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
          {placeholders.map((item) => (
            <StaggerItem key={item.name}>
              <div className="bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden hover:border-[#00E87A]/20 hover:shadow-[0_0_20px_rgba(0,232,122,0.06)] transition-all duration-300">
                {/* Screenshot placeholder */}
                <div className="relative w-full h-40 bg-[#0D0D0D] flex items-center justify-center border-b border-[#1F2937]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,232,122,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,122,0.04) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                  <span className="relative text-[#374151] font-mono text-xs uppercase tracking-widest">
                    {comingSoon}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-[#F4F4F2] font-mono font-bold text-base mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[#6B7280] font-mono text-xs mb-4">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.stack.map((tag) => (
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
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
