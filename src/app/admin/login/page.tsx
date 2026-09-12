'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@aimimages.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store local session info for client UI fast check
      if (typeof window !== 'undefined') {
        localStorage.setItem('aim_admin_auth', 'true');
        localStorage.setItem('aim_admin_user', JSON.stringify(data.user));
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-20 sm:py-28">
      <div className="w-full max-w-md p-6 sm:p-10 rounded-2xl bg-obsidian-850 border border-white/10 shadow-2xl space-y-6 sm:space-y-8 backdrop-blur-xl">
        {/* Studio Branding */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Aim Images Studio"
              width={64}
              height={64}
              className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-[10px] font-bold uppercase tracking-widest text-gold-400">
            <Lock className="w-3 h-3" />
            <span>Studio Administration Portal</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Aim Images CMS
          </h1>
          <p className="text-xs text-slate-400">
            Authorized access for studio directors, editors, and production managers.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              Studio Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="username"
                placeholder="admin@aimimages.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-cream-50 placeholder-slate-600 focus:outline-none focus:border-gold-500 transition-colors min-h-[44px]"
              />
            </div>
            <div className="mt-2.5 p-2.5 rounded-lg bg-obsidian-900/80 border border-white/5 text-[11px] text-slate-400 space-y-1">
              <p>
                Default superadmin email: <code className="text-gold-400 font-semibold">admin@aimimages.com</code>
              </p>
              <p>
                Default master password: <code className="text-gold-400 font-semibold">aimimages2024</code>
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Studio Session...</span>
              </>
            ) : (
              <>
                <span>Enter Studio Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-500" />
            <span>Role-Based Access Control</span>
          </div>
          <Link href="/" className="hover:text-gold-400 transition-colors">
            Return to Studio
          </Link>
        </div>
      </div>
    </div>
  );
}
