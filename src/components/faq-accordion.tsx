'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const questionId = `faq-q-${idx}`;
        const answerId = `faq-a-${idx}`;

        return (
          <div
            key={idx}
            className="border border-white/10 rounded-xl bg-obsidian-850 overflow-hidden transition-colors hover:border-gold-500/30"
          >
            <button
              id={questionId}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggle(idx)}
              className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 min-h-[48px] flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
            >
              <span className="font-serif text-base sm:text-lg font-medium text-cream-50 leading-snug break-words">
                {item.q}
              </span>
              <div
                className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-gold-500/10 border-gold-500/40 text-gold-400' : 'text-slate-400'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className="px-4 sm:px-6 pb-5 sm:pb-6 text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-4 animate-fade-in break-words"
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
