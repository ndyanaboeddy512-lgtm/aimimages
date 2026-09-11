'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Camera, Phone, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
          {/* Brand Logo - Responsive on 320px */}
          <Link href="/" className="group flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-500/10 group-hover:border-gold-500 transition-colors shrink-0">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 transition-transform group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.18em] sm:tracking-[0.2em] text-base sm:text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors leading-tight">
                AIM IMAGES
              </span>
              <span className="text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-slate-400">
                Cinema & Photography
              </span>
            </div>
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

          {/* Desktop Action CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 font-medium text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <span>Book Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="w-full min-h-[48px] flex items-center justify-center rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors shadow-lg shadow-gold-500/20"
            >
              Inquire & Book Now
            </Link>
            <a
              href="https://wa.me/15552348900?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20a%20production."
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
