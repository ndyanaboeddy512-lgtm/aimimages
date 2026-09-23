import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getTeamMembers, getSiteSettings, TEAM_MEMBERS, STATS, BTS_IMAGES } from '@/lib/data';
import { Sparkles, Camera, Film, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export default async function AboutPage() {
  const [teamMembersData, settings] = await Promise.all([
    getTeamMembers(),
    getSiteSettings(),
  ]);
  const teamMembers = teamMembersData && teamMembersData.length > 0 ? teamMembersData : TEAM_MEMBERS;
  const waNumber = (settings.contact_whatsapp || '256764709563').replace(/[^0-9]/g, '');
  const values = [
    {
      title: 'Emotive Realism',
      desc: 'We eschew stiff posing in favor of genuine presence. Our cinematography captures unspoken glances, spontaneous laughter, and the quiet resonance of authentic human connection.'
    },
    {
      title: 'Theatrical Color Craft',
      desc: 'Every still and sequence is hand-graded in DaVinci Resolve with proprietary film stock emulation curves, yielding rich shadows, gentle highlights, and natural skin tones.'
    },
    {
      title: 'Archival Permanence',
      desc: 'Your memories deserve more than fleeting social posts. We engineer heirloom cinema films and hand-bound Italian fine art albums built to withstand generations.'
    }
  ];

  return (
    <div className="pt-28 sm:pt-32 pb-20 sm:pb-24 space-y-16 sm:space-y-24">
      {/* Editorial Studio Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Studio Narrative</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-cream-50 leading-tight break-words">
            Crafting Visual Poetry <br />
            <span className="gold-gradient-text">Across the Globe</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-light">
            Founded with an uncompromising devotion to cinematic natural light and emotional narrative, Aim Images HD has grown into an internationally commissioned creative cinema & photography collective.
          </p>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-obsidian-900 border border-white/10 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1800&auto=format&fit=crop"
            alt="Aim Images Studio Cinema Set"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-black/30" />
        </div>
      </div>

      {/* Stats Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8 md:p-12 rounded-2xl bg-obsidian-900 border border-white/5">
          {STATS.map((stat, idx) => (
            <div key={idx} className="text-center space-y-1">
              <span className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold gold-gradient-text block">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-slate-400 font-medium block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Studio Philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            Our Guiding Ethos
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50">
            A Legacy of Visual Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {values.map((v, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/10 space-y-3 sm:space-y-4 hover:border-gold-500/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-serif font-bold text-sm">
                0{i + 1}
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50">{v.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creative Team Profiles */}
      <div className="bg-obsidian-900 border-y border-white/5 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
              The Creators
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50">
              Meet The Directors & Artists
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              A collaborative team of directors, cinematographers, gaffers, and senior colorists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-2xl overflow-hidden bg-obsidian-850 border border-white/10 hover:border-gold-500/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden bg-obsidian-900">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent opacity-80" />
                  </div>

                  <div className="p-5 sm:p-6 space-y-2">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gold-400 font-medium tracking-wide uppercase">
                      {member.role}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1 sm:pt-2">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behind The Scenes Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold">
            On Set Around The World
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50">
            Behind The Lens
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {BTS_IMAGES.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-obsidian-900 border border-white/10 group"
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 sm:p-5 flex flex-col justify-end">
                <span className="font-serif text-xs sm:text-sm font-bold text-cream-50">{item.title}</span>
                <span className="text-[10px] sm:text-[11px] text-gold-400">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-12 rounded-3xl bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 border border-gold-500/30 text-center space-y-4 sm:space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 break-words">
            Let's Collaborate on Your Vision
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Our studio is currently accepting commissions for destination weddings, luxury editorial, and commercial campaigns.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20collaborate%20on%20a%20production.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-widest transition-colors shadow-lg"
            >
              <span>Begin Your Inquiry on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
