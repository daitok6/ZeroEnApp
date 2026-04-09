'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqItem {
  q: string;
  a: string;
}

interface PricingFaqProps {
  items: FaqItem[];
  title: string;
}

export function PricingFaq({ items, title }: PricingFaqProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-mono font-bold text-[#F4F4F2] mb-10 text-center">
        {title}
      </h2>
      <Accordion
        value={openItems}
        onValueChange={(newValue: number[]) => setOpenItems(newValue)}
        className="space-y-3"
      >
        {items.map((item, i) => (
          <AccordionItem
            key={i}
            value={i}
            className="border border-[#1F2937] rounded-lg bg-[#111827] px-6 hover:border-[#00E87A]/30 transition-colors duration-200"
          >
            <AccordionTrigger className="font-mono text-sm text-[#F4F4F2] hover:text-[#00E87A] hover:no-underline py-5 text-left">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="font-mono text-sm text-[#9CA3AF] leading-relaxed pb-5">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
