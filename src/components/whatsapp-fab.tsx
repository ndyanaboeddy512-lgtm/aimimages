'use client';

import React, { useState, useEffect } from 'react';

export function FloatingWhatsApp({ settings: initialSettings }: { settings?: Record<string, any> } = {}) {
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
  const whatsappUrl = `https://wa.me/${waNumber}?text=Hello%20Aim%20Images%2C%20I%20would%20like%20to%20inquire%20about%20your%20photography%20and%20cinema%20services.`;

  return (
    <aside
      aria-label="WhatsApp Contact Widget"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover/focus */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-full bg-obsidian-900/95 border border-emerald-500/40 text-cream-100 text-xs font-medium tracking-wide shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <span className="w-2 h-2 inline-block rounded-full bg-emerald-400 animate-pulse mr-2" />
        Inquire on WhatsApp
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Inquiry with Aim Images"
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_35px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/50"
      >
        {/* Radar ping effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-75" />

        {/* WhatsApp Official Glyph */}
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10"
          aria-hidden="true"
        >
          <path d="M16.002 0C7.164 0 0 7.164 0 16.002c0 2.825.736 5.578 2.133 8.001L.069 31.931l8.13-2.062a15.938 15.938 0 007.803 2.05h.007c8.835 0 16-7.164 16-16.002C32.009 7.164 24.843 0 16.002 0zm0 29.308h-.006a13.256 13.256 0 01-6.757-1.848l-.484-.287-5.021 1.275 1.34-4.896-.316-.502a13.277 13.277 0 01-2.037-7.048c0-7.33 5.965-13.295 13.297-13.295 3.551 0 6.89 1.383 9.402 3.896a13.228 13.228 0 013.894 9.403c-.003 7.33-5.969 13.295-13.308 13.295zm7.297-9.96c-.399-.2-2.365-1.167-2.732-1.3-.367-.134-.634-.2-.9.2-.267.4-.999 1.3-1.233 1.567-.233.267-.467.3-.866.1-.4-.2-1.688-.622-3.216-1.984-1.189-1.06-1.992-2.37-2.226-2.769-.233-.4-.025-.615.175-.814.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.233-2.967-.325-.779-.655-.673-.9-.685l-.767-.014c-.267 0-.7.1-1.067.5-.367.4-1.4 1.367-1.4 3.333 0 1.967 1.433 3.867 1.633 4.133.2.267 2.822 4.308 6.837 6.042.955.412 1.701.658 2.282.843.959.305 1.832.262 2.522.159.769-.115 2.365-.967 2.7-1.9.333-.933.333-1.733.233-1.9-.1-.167-.333-.267-.733-.467z" />
        </svg>
      </a>
    </aside>
  );
}
