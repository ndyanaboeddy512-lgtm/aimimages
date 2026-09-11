import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Sparkles, Film, Camera, ShieldCheck, Globe, Star } from 'lucide-react';
import { getFeaturedProjects, SERVICES, TESTIMONIALS, STATS, BTS_IMAGES } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { TestimonialSlider } from '@/components/testimonial-slider';

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32">
      {/* Cinematic Hero */}
      <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
            alt="Aim Images Cinema Background"
            fill
            priority
            className="object-cover object-center brightness-40 scale-105 animate-pulse-glow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-gold-500/40 bg-obsidian-900/80 backdrop-blur-md text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-gold-400 shadow-xl max-w-full">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate sm:whitespace-normal">Worldwide Studio • Bookings Open</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-cream-50 leading-[1.15] sm:leading-[1.1] break-words">
            Where Light Meets <br className="hidden sm:inline" />
            <span className="gold-gradient-text">Timeless Storytelling</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed">
            Aim Images HD crafts breathtaking wedding documentaries, high-fashion editorial campaigns, and cinematic commercial films across the globe.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <Link
                href="/portfolio"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.35)]"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/256764709563?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20production."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-obsidian-900/90 border border-white/20 hover:border-gold-500/60 text-cream-100 font-semibold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-obsidian-850"
              >
                <span>Inquire & Book</span>
              </a>
            </div>

            {/* Premium Availability Status Indicator */}
            <div className="inline-flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Bookings Open</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 text-[11px] sm:text-xs tracking-wider uppercase">Worldwide Commissions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Milestone Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8 md:p-12 rounded-2xl bg-obsidian-900/60 border border-white/5 backdrop-blur-sm">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <span className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold gold-gradient-text block">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-slate-400 font-medium block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              Curated Works
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-cream-50">
              Featured Productions & Case Studies
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-semibold transition-colors py-1 min-h-[44px]"
          >
            <span>View All Works (8 Categories)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProjects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Creative Disciplines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Bespoke Services
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-cream-50">
            Precision Cinema & Editorial Photography
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Tailored packages designed for high-end celebrations, fashion collections, commercial advertising, and distinguished personalities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/10 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-obsidian-950 transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {service.tagline}
                </p>
                <div className="pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500">Starting From</span>
                  <p className="font-serif text-2xl font-bold text-gold-400">{service.startingPrice}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-500">{service.timeline}</span>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-400 group-hover:text-gold-300 uppercase tracking-wide font-medium min-h-[44px]"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Aim Images Standard */}
      <section className="bg-obsidian-900 border-y border-white/5 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              The Studio Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-cream-50">
              Crafted With Relentless Precision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/5 space-y-4">
              <Film className="w-8 h-8 text-gold-500" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50">
                Hollywood Cinema Glass
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shot on ARRI Alexa LF, RED V-Raptor, and anamorphic prime lenses for creamy falloff, organic skin tones, and undeniable film character.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/5 space-y-4">
              <ShieldCheck className="w-8 h-8 text-gold-500" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50">
                Zero-Loss Redundancy
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live dual-card recording on every body, instant on-set RAID backup, and triple offsite cloud encryption before our team leaves the location.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/5 space-y-4">
              <Globe className="w-8 h-8 text-gold-500" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50">
                Global Travel Ready
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active carnets, international insurance, FAA Part 107 aerial certifications, and experienced multi-lingual production coordinators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Behind The Scenes Visual Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              Behind The Scenes
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-cream-50">
              The Process In Motion
            </h2>
          </div>
          <Link
            href="/about"
            className="text-xs uppercase tracking-widest text-gold-400 hover:text-gold-300 font-semibold py-1 min-h-[44px] inline-flex items-center"
          >
            Meet The Full Team →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {BTS_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-obsidian-900 border border-white/10"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 sm:p-4">
                <span className="text-xs font-serif font-bold text-cream-50">{img.title}</span>
                <span className="text-[10px] text-gold-400">{img.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Testimonials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-cream-50">
            Endorsements from Celebrated Clients
          </h2>
        </div>

        <TestimonialSlider items={TESTIMONIALS} />
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 p-6 sm:p-12 md:p-16 text-center space-y-6 sm:space-y-8">
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Bookings Open</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-cream-50 leading-tight break-words">
              Ready to create something unforgettable?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dates are strictly limited to ensure uncompromising creative attention for each client.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
              <a
                href="https://wa.me/256764709563?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20reserve%20a%20production%20date."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)]"
              >
                Inquire via WhatsApp
              </a>
              <Link
                href="/contact"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 hover:border-gold-500/60 text-cream-100 font-semibold text-xs uppercase tracking-widest transition-all hover:bg-obsidian-850"
              >
                Submit Project Brief
              </Link>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide pt-1">
              <span className="text-gold-400 font-medium">Bookings Open</span> — Private dates reserved on a first-confirmed basis
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
