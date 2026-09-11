'use client';

import React, { useState, useMemo } from 'react';
import { CATEGORIES, INITIAL_PROJECTS, ProjectData } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';
import { Lightbox } from '@/components/lightbox';
import { Filter, Film, Camera, Sparkles } from 'lucide-react';

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo'>('all');
  const [activeVideoProject, setActiveVideoProject] = useState<ProjectData | null>(null);

  const filteredProjects = useMemo(() => {
    return INITIAL_PROJECTS.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' || project.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesType =
        filterType === 'all' ||
        (filterType === 'video' && project.isVideo) ||
        (filterType === 'photo' && !project.isVideo);
      return matchesCategory && matchesType;
    });
  }, [selectedCategory, filterType]);

  return (
    <div className="pt-32 pb-24 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-semibold uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Archive</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream-50">
          Curated Cinema & Fine Art Stills
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
          Explore our collection of multi-award-winning weddings, high-fashion campaigns, commercial TVCs, and music videos.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
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
          <span className="text-xs uppercase tracking-widest text-slate-400">
            Showing <strong className="text-gold-400">{filteredProjects.length}</strong> Works
          </span>

          <div className="inline-flex rounded-xl bg-obsidian-900 p-1 border border-white/10">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'all' ? 'bg-obsidian-800 text-gold-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'video' ? 'bg-obsidian-800 text-gold-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinema Films</span>
            </button>
            <button
              onClick={() => setFilterType('photo')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
      <div className="max-w-7xl mx-auto px-6">
        {filteredProjects.length === 0 ? (
          <div className="p-16 rounded-2xl bg-obsidian-900 border border-white/10 text-center space-y-4">
            <p className="text-slate-400 text-sm">No productions match this specific combination.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setFilterType('all');
              }}
              className="px-6 py-2.5 rounded-full bg-gold-500 text-obsidian-950 text-xs uppercase font-bold tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
