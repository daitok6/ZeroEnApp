'use client';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface AccordionSection {
  title: string;
  body: string;
}

interface TermsAccordionProps {
  heading: string;
  sections: AccordionSection[];
}

export function TermsAccordion({ heading, sections }: TermsAccordionProps) {
  return (
    <div>
      <h2 className="text-lg font-mono font-bold text-[#F4F4F2] mb-6 uppercase tracking-widest">
        {heading}
      </h2>
      <Accordion>
        {sections.map((section, i) => (
          <AccordionItem
            key={i}
            value={String(i)}
            className="border-b border-[#1F2937]"
          >
            <AccordionTrigger className="text-[#9CA3AF] hover:text-[#F4F4F2] font-mono text-sm py-4 transition-colors">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="text-[#6B7280] font-mono text-sm leading-relaxed pb-5">
              {section.body}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
