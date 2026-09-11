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
    <div className="group relative overflow-hidden rounded-xl bg-obsidian-850 border border-white/10 hover:border-gold-500/40 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
      <div className="relative aspect-[16/10] overflow-hidden bg-obsidian-900">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase bg-obsidian-950/80 border border-white/10 text-gold-400 backdrop-blur-md">
            {project.category}
          </span>
          {project.isVideo && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-gold-500/20 border border-gold-500/40 text-gold-300 backdrop-blur-md">
              4K Cinema
            </span>
          )}
        </div>

        {project.isVideo && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenVideo) onOpenVideo(project);
            }}
            className="absolute inset-0 flex items-center justify-center z-20 group/btn focus:outline-none cursor-pointer"
            aria-label={`Play preview for ${project.title}`}
          >
            <div className="w-14 h-14 rounded-full bg-black/60 border border-gold-500/60 backdrop-blur-md flex items-center justify-center text-gold-400 group-hover/btn:scale-115 group-hover/btn:bg-gold-500 group-hover/btn:text-obsidian-950 transition-all duration-300 shadow-xl">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
          </button>
        )}

        {project.duration && (
          <div className="absolute bottom-4 right-4 z-10 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[11px] font-mono text-slate-300">
            {project.duration}
          </div>
        )}
      </div>

      <div className="p-6 relative flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>{project.location}</span>
            <span>{project.year}</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <span className="text-xs text-slate-500 truncate max-w-[150px]">
            {project.client ? project.client : 'Studio Original'}
          </span>
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-medium tracking-wide uppercase transition-colors"
          >
            <span>View Case</span>
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
