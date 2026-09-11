'use client';

import React, { useEffect } from 'react';
import { X, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ProjectData } from '@/lib/data';

interface LightboxProps {
  project: ProjectData | null;
  onClose: () => void;
}

export function Lightbox({ project, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 md:p-8 animate-fade-in overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="relative w-full max-w-5xl bg-obsidian-900 border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950 gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gold-500/20 text-gold-400 border border-gold-500/30 shrink-0">
              {project.category}
            </span>
            <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-cream-50 truncate">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Frame */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {project.isVideo && project.videoUrl ? (
            <iframe
              src={`${project.videoUrl}?autoplay=1&title=0&byline=0&portrait=0`}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Modal Specs & Footer */}
        <div className="p-4 sm:p-6 bg-obsidian-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5">
          <div className="space-y-1.5 max-w-xl">
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-500" />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gold-500" />
                {project.year}
              </span>
              {project.duration && <span>Duration: {project.duration}</span>}
            </div>
          </div>

          <Link
            href={`/portfolio/${project.slug}`}
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 text-xs font-semibold tracking-wider uppercase hover:bg-gold-400 transition-colors shrink-0"
          >
            <span>Full Case Study</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
