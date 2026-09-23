'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES, INITIAL_PROJECTS, ProjectData } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { Lightbox } from '@/components/lightbox';
import { Filter, Film, Camera, Sparkles } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectData[]>(INITIAL_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo'>('all');
  const [activeVideoProject, setActiveVideoProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch(() => {});
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesType =
        filterType === 'all' ||
        (filterType === 'video' && project.isVideo) ||
        (filterType === 'photo' && !project.isVideo);
      return matchesCategory && matchesType;
    });
  }, [projects, selectedCategory, filterType]);

  return (
    <div className="pt-28 sm:pt-32 pb-24 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-cream-50 break-words leading-tight">
          Curated Cinema & Fine Art Stills
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-400 leading-relaxed">
          Explore our collection of multi-award-winning weddings, high-fashion campaigns, commercial TVCs, and music videos.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Category Pills - Touch swipeable on mobile */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 scrollbar-none touch-pan-x">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 active:scale-95 flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-gold-500 text-obsidian-950 shadow-lg shadow-gold-500/20'
                    : 'bg-obsidian-900 border border-white/10 text-slate-300 hover:text-white hover:border-gold-500/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Media Type Sub-Filter & Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
          <span className="text-xs uppercase tracking-widest text-slate-400 order-2 sm:order-1">
            Showing <strong className="text-gold-400">{filteredProjects.length}</strong> Works
          </span>

          <div className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-obsidian-900 p-1 border border-white/10 order-1 sm:order-2">
            <button
              onClick={() => setFilterType('all')}
              className={`min-h-[40px] px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                filterType === 'all' ? 'bg-obsidian-800 text-gold-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'video' ? 'bg-obsidian-800 text-gold-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinema Films</span>
            </button>
            <button
              onClick={() => setFilterType('photo')}
              className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'photo' ? 'bg-obsidian-800 text-gold-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Stills</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {filteredProjects.length === 0 ? (
          <div className="p-8 sm:p-16 rounded-2xl bg-obsidian-900 border border-white/10 text-center space-y-4">
            <p className="text-slate-400 text-sm">No productions match this specific combination.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setFilterType('all');
              }}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 text-xs uppercase font-bold tracking-wider hover:bg-gold-400 transition-colors inline-flex items-center justify-center"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpenVideo={(p) => setActiveVideoProject(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        project={activeVideoProject}
        onClose={() => setActiveVideoProject(null)}
      />
    </div>
  );
}
