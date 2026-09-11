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
      <div className="relative overflow-hidden rounded-3xl bg-obsidian-850 border border-white/10 p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-6 right-8 text-gold-500/10">
          <Quote className="w-24 h-24" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-1.5 text-gold-400">
            {Array.from({ length: active.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <p className="font-serif text-lg sm:text-2xl text-cream-50 italic leading-relaxed">
            "{active.comment}"
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div>
              <h4 className="font-serif text-base font-bold text-cream-100">
                {active.clientName}
              </h4>
              <p className="text-xs text-gold-400/90 tracking-wide uppercase mt-0.5">
                {active.roleOrEvent}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-500 transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:border-gold-500 transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
