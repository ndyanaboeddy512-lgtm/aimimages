import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Film, CheckCircle2 } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/lib/data';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 space-y-12 sm:space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-gold-400 transition-colors py-2 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
          {project.isVideo && project.videoUrl ? (
            <iframe
              src={`${project.videoUrl}?autoplay=0&title=0&byline=0&portrait=0`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover object-center"
            />
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 border-b border-white/10 pb-6 sm:pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/40">
                {project.category}
              </span>
              {project.duration && (
                <span className="text-xs font-mono text-slate-400">
                  Run Time: {project.duration}
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-cream-50 break-words leading-tight">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 pt-2 sm:pt-0">
            <div>
              <span className="block text-slate-500 uppercase tracking-wider text-[10px]">Location</span>
              <span className="font-medium text-cream-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gold-500 shrink-0" />
                {project.location}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase tracking-wider text-[10px]">Year</span>
              <span className="font-medium text-cream-100 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-gold-500 shrink-0" />
                {project.year}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase tracking-wider text-[10px]">Client / Label</span>
              <span className="font-medium text-cream-100 mt-0.5 block">
                {project.client || 'Aim Images Studio Original'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
            Creative Direction & Synopsis
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {project.description}
          </p>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every frame was tailored to harmonize natural ambience with high-fidelity production lighting. Color grading adhered to Kodak 2383 print film curves in DaVinci Resolve Studio to preserve organic skin texture, subtle tonal falloff, and luxurious shadow depth.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900 border border-white/10 space-y-6">
          <h3 className="font-serif text-lg font-bold text-cream-100 border-b border-white/5 pb-4">
            Production Specifications
          </h3>

          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
              Deliverables Transmitted
            </h4>
            <ul className="space-y-2">
              {project.deliverables.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
              Camera & Optical Package
            </h4>
            <ul className="space-y-2">
              {project.gearUsed.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <Film className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Link
              href={`/contact`}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-lg"
            >
              <span>Inquire Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-cream-50">
          Selected High-Resolution Stills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {project.gallery.map((imgUrl, i) => (
            <div
              key={i}
              className="relative aspect-[16/10] rounded-xl overflow-hidden bg-obsidian-900 border border-white/10 group"
            >
              <Image
                src={imgUrl}
                alt={`${project.title} - Still ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 border-t border-white/10 flex items-center justify-between gap-4">
        {prevProject ? (
          <Link
            href={`/portfolio/${prevProject.slug}`}
            className="flex items-center gap-2 sm:gap-3 text-xs uppercase tracking-wider text-slate-400 hover:text-gold-400 transition-colors py-2 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 hidden sm:block">Previous Case</span>
              <span className="font-semibold text-cream-100 truncate max-w-[120px] sm:max-w-[200px] block">
                {prevProject.title}
              </span>
            </div>
          </Link>
        ) : <div />}

        {nextProject ? (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="flex items-center gap-2 sm:gap-3 text-xs uppercase tracking-wider text-slate-400 hover:text-gold-400 transition-colors py-2 min-h-[44px]"
          >
            <div className="text-right">
              <span className="text-[10px] text-slate-500 hidden sm:block">Next Case</span>
              <span className="font-semibold text-cream-100 truncate max-w-[120px] sm:max-w-[200px] block">
                {nextProject.title}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
