// src/components/marketing/newsletter-section.tsx
import { ScrollReveal } from './scroll-reveal';
import { NewsletterForm } from './newsletter-form';

interface NewsletterSectionProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  note: string;
  locale: string;
}

export function NewsletterSection({
  eyebrow,
  title,
  subtitle,
  note,
  locale,
}: NewsletterSectionProps) {
  return (
    <section className="py-20 px-4 bg-[#080808] border-t border-[#1F2937]">
      <div className="max-w-xl mx-auto text-center">
        <ScrollReveal direction="up">
          <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-3">
            {eyebrow}
          </p>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#F4F4F2] mb-3">
            {title}
          </h2>
          <p className="text-[#6B7280] font-mono text-sm mb-8">{subtitle}</p>

          <NewsletterForm locale={locale} />

          <p className="text-[#374151] font-mono text-xs mt-4">{note}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
