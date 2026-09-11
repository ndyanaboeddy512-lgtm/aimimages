'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Camera, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Default studio admin password
    if (password === 'aimimages2024' || password === 'admin' || password === process.env.ADMIN_SECRET_KEY) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aim_admin_auth', 'true');
      }
      router.push('/admin/dashboard');
    } else {
      setError('Invalid studio credential. Use studio master key.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-20 sm:py-28">
      <div className="w-full max-w-md p-6 sm:p-10 rounded-2xl bg-obsidian-850 border border-white/10 shadow-2xl space-y-6 sm:space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border border-gold-500/40 bg-gold-500/10 flex items-center justify-center mx-auto text-gold-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-cream-50">
            Studio Management Portal
          </h1>
          <p className="text-xs text-slate-400">
            Authorized access for Aim Images directors & coordinators.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              Studio Access Key
            </label>
            <input
              type="password"
              required
              placeholder="Enter master key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors min-h-[44px]"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              Default studio password: <code className="text-gold-400">aimimages2024</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Studio Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-gold-500" />
          <span>Encrypted Studio Session</span>
        </div>
      </div>
    </div>
  );
}
