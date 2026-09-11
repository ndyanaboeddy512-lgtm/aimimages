'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Eye } from 'lucide-react';
import { ProjectData } from '@/lib/data';

interface ProjectCardProps {
  project: ProjectData;
  onOpenVideo?: (project: ProjectData) => void;
}

export function ProjectCard({ project, onOpenVideo }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-obsidian-850 border border-white/10 hover:border-gold-500/40 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden bg-obsidian-900">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges - Flexible wrap for narrow mobile viewports */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex flex-wrap items-center justify-between gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wider uppercase bg-obsidian-950/90 border border-white/10 text-gold-400 backdrop-blur-md">
            {project.category}
          </span>
          {project.isVideo && (
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase bg-gold-500/20 border border-gold-500/40 text-gold-300 backdrop-blur-md">
              4K Cinema
            </span>
          )}
        </div>

        {/* Center Play Button for Videos (Touch-friendly 52px diameter on mobile) */}
        {project.isVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenVideo) onOpenVideo(project);
            }}
            className="absolute inset-0 flex items-center justify-center z-20 group/btn focus:outline-none cursor-pointer"
            aria-label={`Play cinema preview for ${project.title}`}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/70 border border-gold-500/60 backdrop-blur-md flex items-center justify-center text-gold-400 group-hover/btn:scale-110 group-hover/btn:bg-gold-500 group-hover/btn:text-obsidian-950 transition-all duration-300 shadow-xl">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
            </div>
          </button>
        )}

        {/* Duration badge */}
        {project.duration && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 px-2 py-0.5 rounded bg-black/85 border border-white/10 text-[10px] sm:text-[11px] font-mono text-slate-300">
            {project.duration}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 relative flex flex-col flex-1 justify-between gap-4">
        <div>
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 mb-2">
            <span className="truncate max-w-[60%]">{project.location}</span>
            <span className="shrink-0">{project.year}</span>
          </div>

          <h3 className="font-serif text-base sm:text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-white/5 mt-auto">
          <span className="text-[11px] text-slate-500 truncate max-w-[130px] sm:max-w-[160px]">
            {project.client ? project.client : 'Studio Original'}
          </span>
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 min-h-[36px] px-2 py-1 text-xs text-gold-400 hover:text-gold-300 font-medium tracking-wide uppercase transition-colors"
          >
            <span>View Case</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
