'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TestimonialData } from '@/lib/data';

export function TestimonialSlider({ items }: { items: TestimonialData[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);
  const next = () => setCurrent((prev) => (prev + 1) % items.length);

  const active = items[current];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-obsidian-850 border border-white/10 p-6 sm:p-10 md:p-14 shadow-2xl">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 text-gold-500/10 pointer-events-none">
          <Quote className="w-14 h-14 sm:w-24 sm:h-24" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-1.5 text-gold-400">
            {Array.from({ length: active.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <p className="font-serif text-base sm:text-xl md:text-2xl text-cream-50 italic leading-relaxed break-words">
            "{active.comment}"
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
            <div>
              <h4 className="font-serif text-base font-bold text-cream-100">
                {active.clientName}
              </h4>
              <p className="text-xs text-gold-400/90 tracking-wide uppercase mt-0.5">
                {active.roleOrEvent}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <div className="flex items-center gap-1.5 sm:hidden">
                {items.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrent(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      current === dotIdx ? 'w-5 bg-gold-400' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={prev}
                  className="min-w-[44px] min-h-[44px] rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-500 transition-colors active:scale-95"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="min-w-[44px] min-h-[44px] rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-500 transition-colors active:scale-95"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
