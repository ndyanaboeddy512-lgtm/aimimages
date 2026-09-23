'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';

export function Navbar({ settings: initialSettings }: { settings?: Record<string, any> } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
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

  const waNumber = (settings.contact_whatsapp || '256764709563').replace(/[^0-9]/g, '');
  const bookingStatus = settings.booking_status || 'Bookings Open';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isOpen
            ? 'bg-obsidian-950/95 backdrop-blur-md border-b border-white/10 py-2.5 sm:py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent py-3 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo - Dynamic Aim Images Logo */}
          <Link href="/" className="group flex items-center shrink-0" aria-label="Aim Images Home">
            <Image
              src={settings.site_logo || '/logo.png'}
              alt="Aim Images Studio Logo"
              width={160}
              height={92}
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs lg:text-sm tracking-widest uppercase transition-colors relative py-1 ${
                    isActive ? 'text-gold-400 font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-500 to-amber-300 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action CTA - Direct WhatsApp Booking */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-[11px] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{bookingStatus}</span>
            </span>

            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20production.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 font-medium text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <span>Book Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Hamburger Button (Min 44x44px touch target) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6 text-gold-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 md:hidden bg-obsidian-950/98 border-b border-white/10 shadow-2xl transition-all duration-300 ease-out transform ${
          isOpen ? 'translate-y-0 opacity-100 pt-20 pb-8 px-6' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2 max-w-sm mx-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl text-sm tracking-widest uppercase font-medium transition-colors ${
                  isActive
                    ? 'bg-gold-500/15 border border-gold-500/40 text-gold-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-gold-400" />}
              </Link>
            );
          })}

          <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>{bookingStatus}</span>
            </div>

            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20production.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="w-full min-h-[48px] flex items-center justify-center rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors shadow-lg shadow-gold-500/20"
            >
              Inquire & Book on WhatsApp
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20chat%20live%20about%20photography%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 text-emerald-400 text-xs tracking-widest uppercase hover:bg-emerald-500/10 font-medium transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Instant WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
