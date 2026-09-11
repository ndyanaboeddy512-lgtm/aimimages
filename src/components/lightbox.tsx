'use client';

import React, { useEffect } from 'react';
import { X, MapPin, Calendar } from 'lucide-react';
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
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-obsidian-900 border border-gold-500/30 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian-950">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-gold-500/20 text-gold-400 border border-gold-500/30">
              {project.category}
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-cream-50 truncate max-w-md">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

        <div className="p-6 bg-obsidian-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/5">
          <div className="space-y-1 max-w-xl">
            <p className="text-xs text-slate-400 leading-relaxed">
              {project.description}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
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

          <a
            href={`/portfolio/${project.slug}`}
            className="px-5 py-2.5 rounded-full bg-gold-500 text-obsidian-950 text-xs font-semibold tracking-wider uppercase hover:bg-gold-400 transition-colors shrink-0"
          >
            Full Case Study
          </a>
        </div>
      </div>
    </div>
  );
}
