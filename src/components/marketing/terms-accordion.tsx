'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

interface AccordionSection {
  title: string;
  body: string;
  id?: string;
}

interface TermsAccordionProps {
  heading: string;
  sections: AccordionSection[];
}

export function TermsAccordion({ heading, sections }: TermsAccordionProps) {
  const [defaultValue, setDefaultValue] = useState<string[]>([]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const matchIndex = sections.findIndex((s) => s.id === hash);
      if (matchIndex !== -1) {
        setDefaultValue([String(matchIndex)]);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [sections]);

  return (
    <div>
      <h2 className="text-lg font-mono font-bold text-[#F4F4F2] mb-6 uppercase tracking-widest">
        {heading}
      </h2>
      <Accordion defaultValue={defaultValue.length > 0 ? defaultValue : undefined}>
        {sections.map((section, i) => (
          <AccordionItem
            key={i}
            value={String(i)}
            id={section.id}
            className="border-b border-[#1F2937]"
          >
            <AccordionTrigger className="text-[#9CA3AF] hover:text-[#F4F4F2] font-mono text-sm py-4 transition-colors">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="text-[#6B7280] font-mono text-sm leading-relaxed pb-5 whitespace-pre-line">
              {section.body}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
