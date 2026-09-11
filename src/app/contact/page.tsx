import React from 'react';
import { BookingForm } from '@/components/booking-form';
import { Mail, Phone, MapPin, Clock, Globe, Shield, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 space-y-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-semibold uppercase tracking-[0.25em]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Commission Inquiries</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cream-50">
          Begin Your Production
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
          Whether you are planning an intimate destination celebration or an international commercial campaign, our creative directors are ready to collaborate.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Studio Information */}
        <div className="space-y-8">
          <div className="p-8 rounded-2xl bg-obsidian-850 border border-white/10 space-y-6">
            <h3 className="font-serif text-xl font-bold text-cream-50 border-b border-white/5 pb-4">
              Studio Coordinates
            </h3>

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500">Primary Hub</span>
                  <span className="font-medium text-cream-100">Los Angeles, California</span>
                  <span className="block text-xs text-slate-400">Available Worldwide via ATA Carnet</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Mail className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500">Executive Email</span>
                  <a
                    href="mailto:contact@aimimages.com"
                    className="font-medium text-cream-100 hover:text-gold-400 transition-colors"
                  >
                    contact@aimimages.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Phone className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500">Studio Line</span>
                  <a
                    href="tel:+15552348900"
                    className="font-medium text-cream-100 hover:text-gold-400 transition-colors"
                  >
                    +1 (555) 234-8900
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500">Consultation Hours</span>
                  <span className="text-slate-300 block">Mon - Fri: 09:00 - 18:00 PST</span>
                  <span className="text-xs text-slate-500">Shoots scheduled 24/7 on location</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <a
                href="https://wa.me/15552348900?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Concierge</span>
              </a>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-obsidian-900 border border-white/5 space-y-4">
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
        <div className="lg:col-span-2">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
