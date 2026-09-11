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
    <div className="pt-28 pb-24 space-y-16">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
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

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/40">
                {project.category}
              </span>
              {project.duration && (
                <span className="text-xs font-mono text-slate-400">
                  Run Time: {project.duration}
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cream-50">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div>
              <span className="block text-slate-500 uppercase tracking-wider text-[10px]">Location</span>
              <span className="font-medium text-cream-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gold-500" />
                {project.location}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 uppercase tracking-wider text-[10px]">Year</span>
              <span className="font-medium text-cream-100 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-gold-500" />
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

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-cream-50">
            Creative Direction & Synopsis
          </h2>
          <p className="text-base text-slate-300 leading-relaxed font-light">
            {project.description}
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every frame was tailored to harmonize natural ambience with high-fidelity production lighting. Color grading adhered to Kodak 2383 print film curves in DaVinci Resolve Studio to preserve organic skin texture, subtle tonal falloff, and luxurious shadow depth.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-obsidian-900 border border-white/10 space-y-6">
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
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gold-500 text-obsidian-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-colors"
            >
              <span>Inquire Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
          Selected High-Resolution Stills
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/10 flex items-center justify-between">
        {prevProject ? (
          <Link
            href={`/portfolio/${prevProject.slug}`}
            className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="text-left hidden sm:block">
              <span className="text-[10px] text-slate-500 block">Previous Case</span>
              <span className="font-semibold text-cream-100">{prevProject.title}</span>
            </div>
          </Link>
        ) : <div />}

        {nextProject ? (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400 hover:text-gold-400 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-slate-500 block">Next Case</span>
              <span className="font-semibold text-cream-100">{nextProject.title}</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
