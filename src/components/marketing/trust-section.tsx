import { Shield, Handshake, Trash2 } from 'lucide-react';
import { ScrollReveal } from '@/components/marketing/scroll-reveal';
import { StaggerChildren, StaggerItem } from '@/components/marketing/stagger-children';

interface TrustPoint {
  title: string;
  desc: string;
}

interface TrustSectionProps {
  eyebrow: string;
  title: string;
  points: TrustPoint[];
}

const ICONS = [Shield, Handshake, Trash2];

export function TrustSection({ eyebrow, title, points }: TrustSectionProps) {
  return (
    <section className="py-24 px-4 bg-[#0D0D0D]">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal direction="up" className="mb-14 text-center">
          <p className="text-[#00E87A] font-mono text-xs font-bold uppercase tracking-[0.2em] mb-4">
            {eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F4F4F2]">
            {title}
          </h2>
        </ScrollReveal>

        <StaggerChildren
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {points.map((point, i) => {
            const Icon = ICONS[i];
            return (
              <StaggerItem key={i}>
                <div className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 hover:border-[#00E87A]/20 hover:shadow-[0_0_20px_rgba(0,232,122,0.06)] transition-all duration-300 h-full">
                  <Icon
                    className="text-[#00E87A] mb-4"
                    size={20}
                    strokeWidth={1.5}
                  />
                  <h3 className="text-[#F4F4F2] font-mono font-bold mb-2 text-sm">
                    {point.title}
                  </h3>
                  <p className="text-[#6B7280] font-mono text-sm">
                    {point.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
