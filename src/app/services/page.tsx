import React from 'react';
import Link from 'next/link';
import { SERVICES, FAQS } from '@/lib/data';
import { FAQAccordion } from '@/components/faq-accordion';
import { CheckCircle2, ArrowRight, Sparkles, Clock, Compass, Shield, Award } from 'lucide-react';

export default function ServicesPage() {
  const steps = [
    {
      num: '01',
      title: 'Discovery & Creative Treatment',
      desc: 'We define the narrative arc, visual palette, moodboards, and location scout to formulate a cohesive editorial vision before stepping onto set.'
    },
    {
      num: '02',
      title: 'Principal Photography & Cinema Capture',
      desc: 'Executing the production with Hollywood cinema glass, synchronized multi-cam crews, ambient lighting design, and FAA certified aerials.'
    },
    {
      num: '03',
      title: 'Master Color Grade & Sound Design',
      desc: 'Hand-crafted grading in DaVinci Resolve with Kodak print film emulations, custom sound architecture, foley, and cinematic licensing.'
    },
    {
      num: '04',
      title: 'Private Premiere & Archival Delivery',
      desc: 'Teasers delivered within 72 hours. Master 4K films and high-resolution galleries delivered in a private password-protected client vault.'
    }
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-20 sm:pb-24 space-y-16 sm:space-y-24">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Disciplines & Investment</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-cream-50 break-words leading-tight">
          Tailored Creative Packages
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-400 leading-relaxed">
          Transparent investment tiers for world-class visual storytelling. Every commission receives our senior creative team’s dedicated focus.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/10 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 sm:space-y-8"
          >
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
                  Package 0{service.order}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-gold-500" />
                  {service.timeline}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-50 mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.tagline}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-obsidian-900 border border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 block">
                  Starting Investment
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block mt-1">
                  {service.startingPrice}
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-cream-100 font-semibold block">
                  Included Deliverables:
                </span>
                <ul className="space-y-2.5">
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <Link
                href={`/contact?package=${encodeURIComponent(service.title)}`}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                <span>Book This Package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 4-Step Production Timeline */}
      <div className="bg-obsidian-900 border-y border-white/5 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              The Journey
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50">
              Our 4-Step Production Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              From concept development to the final master delivery, we ensure seamless communication and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/5 relative space-y-3 sm:space-y-4"
              >
                <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-500/20 block">
                  {step.num}
                </span>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="text-center space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Inquiries & Logistics
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to know about working with Aim Images HD Studio.
          </p>
        </div>

        <FAQAccordion items={FAQS} />
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-12 rounded-3xl bg-obsidian-850 border border-gold-500/30 text-center space-y-4 sm:space-y-6">
          <h3 className="font-serif text-xl sm:text-3xl font-bold text-cream-50 break-words">
            Need a Bespoke or Multi-Day Custom Scope?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            We regularly formulate custom commissions for destination weddings, worldwide commercial campaigns, and festival coverage.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 text-xs uppercase font-bold tracking-widest transition-colors shadow-lg"
            >
              <span>Schedule a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
