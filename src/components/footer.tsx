'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Instagram, Youtube, CheckCircle2, ArrowRight } from 'lucide-react';

export function Footer({ settings: initialSettings }: { settings?: Record<string, any> } = {}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>(initialSettings || {});

  useEffect(() => {
    if (initialSettings) setSettings(initialSettings);
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settingsMap) setSettings((prev) => ({ ...prev, ...data.settingsMap }));
      })
      .catch(() => {});
  }, [initialSettings]);

  const siteLogo = settings.site_logo || '/logo.png';
  const instagramUrl = settings.instagram_url || 'https://instagram.com/aimimages_hd_photography';
  const youtubeUrl = settings.youtube_url || 'https://youtube.com/@AimImagesphotography';
  const contactEmail = settings.contact_email || 'aimugimages@gmail.com';
  const contactWhatsApp = settings.contact_whatsapp || '+256 764 709 563';
  const waNumber = contactWhatsApp.replace(/[^0-9]/g, '');

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
    <footer className="bg-obsidian-950 border-t border-white/10 text-slate-400 pt-16 sm:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-12 sm:mb-16">
        <div className="sm:col-span-2 space-y-6">
          <Link href="/" className="inline-block" aria-label="Aim Images Home">
            <Image
              src={siteLogo}
              alt="Aim Images Studio Logo"
              width={180}
              height={104}
              className="h-12 sm:h-14 w-auto object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
            High-end cinematography, editorial lookbooks, and luxury wedding films. Crafting timeless visual narratives in Kabale, throughout Uganda, and worldwide.
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Aim Images on Instagram"
              className="min-w-[44px] min-h-[44px] rounded-full border border-white/10 flex items-center justify-center hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to Aim Images on YouTube"
              className="min-w-[44px] min-h-[44px] rounded-full border border-white/10 flex items-center justify-center hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with Aim Images on WhatsApp"
              className="min-w-[44px] min-h-[44px] rounded-full border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${contactEmail}`}
              aria-label="Email Aim Images Studio"
              className="min-w-[44px] min-h-[44px] rounded-full border border-white/10 flex items-center justify-center hover:text-gold-400 hover:border-gold-500/40 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-semibold mb-4 sm:mb-6">
            Studio
          </h4>
          <ul className="space-y-2 sm:space-y-3 text-sm">
            <li>
              <Link href="/portfolio" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Portfolio Showcase
              </Link>
            </li>
            <li>
              <Link href="/services" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Creative Services
              </Link>
            </li>
            <li>
              <Link href="/about" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Philosophy & Team
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20production.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 hover:text-gold-400 transition-colors"
              >
                Booking Inquiries (WhatsApp)
              </a>
            </li>
            <li>
              <Link href="/admin/login" className="inline-block py-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors">
                Client Portal / Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-semibold mb-4 sm:mb-6">
            Disciplines
          </h4>
          <ul className="space-y-2 sm:space-y-3 text-sm">
            <li>
              <Link href="/portfolio?cat=Weddings" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Wedding Films
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Fashion" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Haute Couture
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Commercial" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Commercial TVCs
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Music Videos" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Music Videos
              </Link>
            </li>
            <li>
              <Link href="/portfolio?cat=Portraits" className="inline-block py-1.5 hover:text-gold-400 transition-colors">
                Executive Portraits
              </Link>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="text-xs uppercase tracking-[0.2em] text-cream-100 font-semibold mb-4 sm:mb-6">
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
                  className="w-full bg-obsidian-850 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-xs sm:text-sm text-cream-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors min-h-[44px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gold-500 text-obsidian-950 rounded-md text-xs font-semibold hover:bg-gold-400 transition-colors min-w-[40px] flex items-center justify-center"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 text-center sm:text-left">
        <p>© {new Date().getFullYear()} Aim Images HD Studio. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href={settings.google_maps_url || 'https://maps.google.com/?q=Rugarama+Road,+Kabale,+Uganda'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold-400 transition-colors"
          >
            {settings.studio_address || 'Rugarama Road, Kabale, Uganda'}
          </a>
          <span>•</span>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            {settings.contact_phone || settings.contact_whatsapp || '+256 764 709 563'}
          </a>
          <span>•</span>
          <span>Worldwide Commissions</span>
        </div>
      </div>
    </footer>
  );
}
