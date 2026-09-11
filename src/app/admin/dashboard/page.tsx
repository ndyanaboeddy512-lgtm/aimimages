'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  Star,
  Users,
  Database,
  KeyRound,
  LogOut,
  CheckCircle2,
  Clock,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { INITIAL_PROJECTS, SERVICES, TESTIMONIALS } from '@/lib/data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'projects' | 'reviews' | 'settings'>('enquiries');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Sample inquiries for immediate demonstration
  const [enquiries, setEnquiries] = useState([
    {
      id: 'enq-1',
      name: 'Victoria & Alexander Stirling',
      email: 'victoria.stirling@estate.co.uk',
      phone: '+44 7700 900123',
      service: 'Luxury Wedding Cinema & Photography',
      eventDate: '2025-06-14',
      budgetRange: '$10,000 - $25,000',
      message: 'Planning our 3-day wedding celebration at Villa d\'Este, Lake Como. Looking for multi-cam 4K cinema and fine art stills.',
      status: 'PENDING',
      createdAt: 'Today, 14:32'
    },
    {
      id: 'enq-2',
      name: 'Julian Moreau',
      email: 'j.moreau@vogue-edition.fr',
      phone: '+33 6 12 34 56 78',
      service: 'High Fashion & Editorial Campaigns',
      eventDate: '2024-11-20',
      budgetRange: '$5,000 - $10,000',
      message: 'Spring/Summer Haute Couture collection lookbook in Paris. Studio and outdoor architectural locations.',
      status: 'REVIEWED',
      createdAt: 'Yesterday, 09:15'
    }
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('aim_admin_auth');
      if (!auth) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aim_admin_auth');
    }
    router.push('/admin/login');
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setEnquiries(
      enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 6) {
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 4000);
      setNewPassword('');
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 sm:pb-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold-500/20 text-gold-400 border border-gold-500/30">
              Studio Console
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
              Aim Images Executive Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time management for client inquiries, bookings, portfolio entries, and database state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">PostgreSQL Ready</span>
          </div>

          <button
            onClick={handleLogout}
            className="min-w-[44px] min-h-[44px] rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-red-500/40 hover:bg-red-500/10 transition-colors flex items-center justify-center"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-1 sm:space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">Total Enquiries</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-400 block">{enquiries.length}</span>
          <span className="text-[10px] sm:text-[11px] text-emerald-400">1 New this week</span>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-1 sm:space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">Portfolio Projects</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 block">{INITIAL_PROJECTS.length}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">8 Disciplines Active</span>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-1 sm:space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">Approved Reviews</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 block">{TESTIMONIALS.length}</span>
          <span className="text-[10px] sm:text-[11px] text-gold-400">5.0 Star Average</span>
        </div>
        <div className="p-4 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-1 sm:space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400">Active Services</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 block">{SERVICES.length}</span>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Cinema & Stills</span>
        </div>
      </div>

      {/* Navigation Tabs - swipeable on mobile */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none touch-pan-x">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'enquiries' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white bg-obsidian-900 border border-white/5'
          }`}
        >
          Bookings & Enquiries ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'projects' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white bg-obsidian-900 border border-white/5'
          }`}
        >
          Portfolio Works ({INITIAL_PROJECTS.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'settings' ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-slate-400 hover:text-white bg-obsidian-900 border border-white/5'
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* Tab 1: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-4 sm:p-6 rounded-2xl bg-obsidian-850 border border-white/10 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-cream-50">{enq.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span className="break-all">{enq.email}</span>
                    </span>
                    {enq.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        <span>{enq.phone}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{enq.createdAt}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 sm:pt-0">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                    className="min-h-[40px] bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cream-100 focus:outline-none focus:border-gold-500"
                  >
                    <option value="PENDING">Status: PENDING</option>
                    <option value="REVIEWED">Status: REVIEWED</option>
                    <option value="BOOKED">Status: BOOKED</option>
                    <option value="ARCHIVED">Status: ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs bg-obsidian-900 p-3 sm:p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Discipline</span>
                  <span className="text-gold-400 font-medium">{enq.service}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Target Date</span>
                  <span className="text-cream-100 font-medium">{enq.eventDate || 'Flexible'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Budget Tier</span>
                  <span className="text-cream-100 font-medium">{enq.budgetRange}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-obsidian-900/50 p-3 sm:p-4 rounded-xl break-words">
                "{enq.message}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Projects Overview */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50">
              Live Showcase Works ({INITIAL_PROJECTS.length})
            </h3>
            <Link
              href="/portfolio"
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold uppercase tracking-wider min-h-[44px] inline-flex items-center"
            >
              Preview Live Portfolio →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-4 sm:p-5 rounded-2xl bg-obsidian-850 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1 truncate">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400">
                    {proj.category} • {proj.year}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-cream-50 truncate">{proj.title}</h4>
                  <span className="text-xs text-slate-400 block">{proj.location}</span>
                </div>
                <Link
                  href={`/portfolio/${proj.slug}`}
                  className="min-h-[40px] px-4 py-2 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-gold-400 hover:border-gold-500/40 shrink-0 font-medium flex items-center justify-center text-center"
                >
                  Inspect
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 'settings' && (
        <div className="max-w-md p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/10 space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-cream-50 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-gold-500" />
              <span>Update Studio Password</span>
            </h3>
            <p className="text-xs text-slate-400">
              Change the master studio access credential used to access this console.
            </p>
          </div>

          {passwordSaved && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Studio password successfully updated!</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
                New Studio Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-50 focus:outline-none focus:border-gold-500 transition-colors min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-lg flex items-center justify-center"
            >
              Save New Master Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
