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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian-950/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-500/10 group-hover:border-gold-500 transition-colors">
            <Camera className="w-5 h-5 text-gold-500 transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.2em] text-lg font-bold text-cream-50 group-hover:text-gold-400 transition-colors">
              AIM IMAGES
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400 -mt-0.5">
              Cinema & Photography
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors relative py-1 ${
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

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500/10 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 font-medium text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            <span>Book Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-obsidian-950/98 backdrop-blur-2xl border-b border-white/10 px-6 py-8 animate-fade-in">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg tracking-widest uppercase transition-colors ${
                  pathname === link.href ? 'text-gold-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
              <Link
                href="/contact"
                className="w-full py-3 text-center rounded-full bg-gold-500 text-obsidian-950 font-semibold text-xs tracking-widest uppercase shadow-lg"
              >
                Inquire & Book Now
              </Link>
              <a
                href="https://wa.me/15552348900?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20a%20production."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-full border border-emerald-500/30 text-emerald-400 text-xs tracking-widest uppercase hover:bg-emerald-500/10"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Instant WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
