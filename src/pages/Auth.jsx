import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Scale } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { useAuth } from '../context/AuthContext';

const FALLBACK_LAWYER_EMAIL = 'lawyer@legallink.uz';
const FALLBACK_LAWYER_PASSWORD = 'lawyer12345';

export default function Auth() {
  const navigate = useNavigate();
  const { login, localFallbackEnabled } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const session = await login(String(email || '').trim(), String(password || '').trim());
      if (session?.user?.role !== 'lawyer') {
        setError('Bu portal faqat advokat akkauntlari uchun.');
        return;
      }
      navigate('/lawyer', { replace: true });
    } catch (err) {
      setError(err?.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700/60 mb-5">
            <Logo className="w-9 h-9" color="text-[var(--color-primary)] dark:text-blue-300" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">Advokat kirish</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Login va parol admin tomonidan beriladi.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-2">
            <Scale size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="lawyer@mail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Parol</span>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </label>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-base font-bold btn-primary flex items-center justify-center"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Kabinetga kirish'}
          </Button>
        </form>

        {localFallbackEnabled && (
          <div className="mt-5 rounded-xl border border-blue-200/70 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-900/20 px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
            <p className="font-bold mb-1">Frontend fallback advokat</p>
            <p>Email: <span className="font-semibold">{FALLBACK_LAWYER_EMAIL}</span></p>
            <p>Parol: <span className="font-semibold">{FALLBACK_LAWYER_PASSWORD}</span></p>
            <button
              type="button"
              onClick={() => {
                setEmail(FALLBACK_LAWYER_EMAIL);
                setPassword(FALLBACK_LAWYER_PASSWORD);
                setError('');
              }}
              className="mt-2 inline-flex items-center rounded-lg border border-blue-300/70 dark:border-blue-700 px-2.5 py-1 font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/30 transition-colors"
            >
              Loginni avtomatik to‘ldirish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
