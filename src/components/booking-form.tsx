'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Luxury Wedding Cinema & Photography',
    eventDate: '',
    budgetRange: '$5,000 - $10,000',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const servicesList = [
    'Luxury Wedding Cinema & Photography',
    'High Fashion & Editorial Campaigns',
    'Commercial & Brand Advertising Films',
    'Executive & Celebrity Portraiture',
    'Music Videos & Creative Direction',
    'Live Cultural Events & Galas'
  ];

  const budgetRanges = [
    'Under $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to submit enquiry. Please try again.');
      }

      setStatus('success');
      try {
        if (typeof window !== 'undefined') {
          window.open(createWhatsAppLink(), '_blank');
        }
      } catch {
        // Fallback handled by explicit button
      }
    } catch {
      setStatus('success');
      try {
        if (typeof window !== 'undefined') {
          window.open(createWhatsAppLink(), '_blank');
        }
      } catch {
        // Fallback handled by explicit button
      }
    }
  };

  const createWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hello Aim Images! I would like to inquire about booking a production:\n\n👤 Name: ${formData.name || 'Client'}\n📸 Service: ${formData.service}\n📅 Date: ${formData.eventDate || 'TBD'}\n💰 Budget: ${formData.budgetRange}\n📝 Note: ${formData.message || 'Looking forward to discussing details.'}`
    );
    return `https://wa.me/256764709563?text=${text}`;
  };

  if (status === 'success') {
    return (
      <div className="p-6 sm:p-10 rounded-2xl bg-obsidian-850 border border-gold-500/40 text-center space-y-6">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
            Inquiry Transmitted
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you, {formData.name || 'valued client'}. Your project brief has been recorded and directed to our WhatsApp line for immediate attention.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={createWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open WhatsApp Chat Now</span>
          </a>
          <button
            onClick={() => {
              setStatus('idle');
              setFormData({
                name: '',
                email: '',
                phone: '',
                service: servicesList[0],
                eventDate: '',
                budgetRange: budgetRanges[2],
                message: ''
              });
            }}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:border-white/30"
          >
            Submit Another Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-8 md:p-10 rounded-2xl bg-obsidian-850 border border-white/10 space-y-5 sm:space-y-6 shadow-2xl"
    >
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
            Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="Elena Rostova"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full min-h-[48px] bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="elena@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full min-h-[48px] bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            placeholder="+256 700 000 000"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full min-h-[48px] bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
            Target Event / Production Date
          </label>
          <input
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            className="w-full min-h-[48px] bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-cream-50 focus:outline-none focus:border-gold-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
            Production Discipline *
          </label>
          <select
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full min-h-[48px] bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-cream-50 focus:outline-none focus:border-gold-500 transition-colors"
          >
            {servicesList.map((svc) => (
              <option key={svc} value={svc}>
                {svc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
            Estimated Budget Range
          </label>
          <select
            value={formData.budgetRange}
            onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
            className="w-full min-h-[48px] bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-base sm:text-sm text-cream-50 focus:outline-none focus:border-gold-500 transition-colors"
          >
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
          Project Narrative & Location Details *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Describe your vision, locations, expected deliverables, and aesthetic preferences..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-obsidian-900 border border-white/10 rounded-xl p-4 text-base sm:text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors"
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)]"
        >
          <span>{status === 'loading' ? 'Transmitting...' : 'Transmit Project Brief'}</span>
          <Send className="w-4 h-4" />
        </button>

        <a
          href={createWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center justify-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 uppercase tracking-wider font-semibold transition-colors py-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Or Chat Live on WhatsApp</span>
        </a>
      </div>
    </form>
  );
}
