'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Mail, Phone, Instagram, Youtube, CheckCircle2, ArrowRight } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch {
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-obsidian-950 border-t border-white/10 text-slate-400 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-500/10">
              <Camera className="w-5 h-5 text-gold-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.2em] text-xl font-bold text-cream-50">
                AIM IMAGES
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500/80">
                Cinema & Photography Studio
              </span>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
            High-end cinematography, editorial lookbooks, and luxury wedding films. Crafting timeless visual narratives worldwide with master-grade lighting and precision color.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href="mailto:contact@aimimages.com"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-semibold mb-6">
            Studio
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/portfolio" className="hover:text-gold-400 transition-colors">
                Portfolio Showcase
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gold-400 transition-colors">
                Creative Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gold-400 transition-colors">
                Philosophy & Team
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gold-400 transition-colors">
                Booking Inquiries
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                Client Portal / Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-semibold mb-6">
            Disciplines
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/portfolio?cat=Weddings" className="hover:text-gold-400 transition-colors">
                Wedding Films
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Fashion" className="hover:text-gold-400 transition-colors">
                Haute Couture
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Commercial" className="hover:text-gold-400 transition-colors">
                Commercial TVCs
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Music Videos" className="hover:text-gold-400 transition-colors">
                Music Videos
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Portraits" className="hover:text-gold-400 transition-colors">
                Executive Portraits
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-semibold mb-6">
            Private Journal
          </h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Curated dispatches on cinema direction, camera gear, and private releases.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 p-3 bg-gold-500/10 border border-gold-500/30 rounded-lg text-gold-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>You are subscribed to the journal.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your private email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-850 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-cream-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gold-500 text-obsidian-950 rounded-md text-xs font-semibold hover:bg-gold-400 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Aim Images HD Studio. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Available Worldwide</span>
          <span>•</span>
          <span>Los Angeles • Paris • Milan</span>
        </div>
      </div>
    </footer>
  );
}
