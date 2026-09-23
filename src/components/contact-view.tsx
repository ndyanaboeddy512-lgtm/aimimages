'use client';

import React, { useState, useEffect } from 'react';
import { BookingForm } from '@/components/booking-form';
import { Mail, Phone, MapPin, Clock, Globe, Shield, MessageSquare, Sparkles } from 'lucide-react';

export function ContactView({ initialSettings }: { initialSettings?: Record<string, any> }) {
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

  const studioAddress = settings.studio_address || 'Rugarama Road, Kabale, Uganda';
  const contactEmail = settings.contact_email || 'aimugimages@gmail.com';
  const contactWhatsApp = settings.contact_whatsapp || '+256 764 709 563';
  const googleMapsUrl = settings.google_maps_url || 'https://maps.google.com/?q=Rugarama+Road,+Kabale,+Uganda';
  const waNumber = contactWhatsApp.replace(/[^0-9]/g, '');

  return (
    <div className="pt-28 sm:pt-32 pb-20 sm:pb-24 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Commission Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-cream-50 break-words leading-tight">
          Begin Your Production
        </h1>
        <p className="max-w-2xl mx-auto text-xs sm:text-base text-slate-400 leading-relaxed">
          Whether you are planning an intimate destination celebration or an international commercial campaign, our creative directors are ready to collaborate.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Left Column: Studio Information */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
          <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-850 border border-white/10 space-y-6">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-50 border-b border-white/5 pb-4">
              Studio Coordinates
            </h3>

            <div className="space-y-4 sm:space-y-5 text-sm">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">Studio Location</span>
                  <span className="font-medium text-cream-100">{studioAddress}</span>
                  <span className="block text-xs text-slate-400 mb-1">Available throughout Uganda & Worldwide</span>
                  {googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gold-400 hover:text-gold-300 font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <span>View on Google Maps / Directions</span>
                      <Globe className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">Executive Email</span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-medium text-cream-100 hover:text-gold-400 transition-colors inline-block py-1 min-h-[36px]"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">Phone / WhatsApp Line</span>
                  <a
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-cream-100 hover:text-emerald-400 transition-colors inline-block py-1 min-h-[36px]"
                  >
                    {contactWhatsApp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-slate-500">Studio Hours</span>
                  <span className="text-slate-300 block">Mon - Sat: 08:00 - 19:00 EAT</span>
                  <span className="text-xs text-slate-500">Productions scheduled 24/7 on location</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20a%20production.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-obsidian-900 border border-white/5 space-y-3 sm:space-y-4">
            <Shield className="w-6 h-6 text-gold-500" />
            <h4 className="font-serif text-base font-bold text-cream-100">
              Confidentiality & Discretion
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We frequently handle high-profile celebrity events, pre-release commercial campaigns, and private estates. Formal Non-Disclosure Agreements (NDAs) are gladly accommodated upon request.
            </p>
          </div>
        </div>

        {/* Right Column: Multi-Step Booking Form */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <BookingForm whatsappNumber={settings.contact_whatsapp} />
        </div>
      </div>
    </div>
  );
}
