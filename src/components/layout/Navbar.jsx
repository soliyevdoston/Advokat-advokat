import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, UserRound, X } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import flagUz from '../../assets/flags/uz.svg';
import flagOz from '../../assets/flags/oz.svg';
import flagRu from '../../assets/flags/ru.svg';
import flagEn from '../../assets/flags/en.svg';

const languageFlags = {
  uz: flagUz,
  oz: flagOz,
  ru: flagRu,
  en: flagEn,
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shellClass = useMemo(() => {
    return scrolled
      ? 'bg-white/95 dark:bg-slate-900/92 border-b border-slate-200/70 dark:border-slate-700/80 backdrop-blur-md shadow-sm py-3'
      : 'bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/60 dark:border-slate-700/70 backdrop-blur-md py-4';
  }, [scrolled]);

  const navLinks = user?.role === 'lawyer'
    ? [
      { name: 'Kabinet', path: '/lawyer' },
      { name: 'Suhbatlar', path: '/chat/support' },
    ]
    : [];

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${shellClass}`}>
      <div className="section-wrap">
        <div className="flex items-center justify-between">
          <Link to={user?.role === 'lawyer' ? '/lawyer' : '/auth'} className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 dark:bg-slate-800">
              <Logo className="w-7 h-7" color="text-[var(--color-primary)] dark:text-white" />
            </span>
            <span className="text-xl font-serif font-bold text-slate-900 dark:text-white">LegalLink Lawyer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'text-[var(--color-primary)] dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[var(--color-primary)] dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSelect
              currentLanguage={currentLanguage}
              changeLanguage={changeLanguage}
              languages={languages}
            />

            {user ? (
              <Button onClick={handleLogout} variant="outline" className="gap-2 px-4 border-red-200 text-red-600 hover:bg-red-50">
                <LogOut size={16} />
                Chiqish
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="gap-2">
                  <UserRound size={16} />
                  Kirish
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSelect
              currentLanguage={currentLanguage}
              changeLanguage={changeLanguage}
              languages={languages}
              compact
            />
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="section-wrap py-4 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary)] dark:bg-slate-800 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <LogOut size={16} />
                Chiqish
              </button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button className="w-full justify-center gap-2">
                  <UserRound size={16} />
                  Kirish
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageSelect({ currentLanguage, changeLanguage, languages, compact = false }) {
  return (
    <div className="relative">
      <img
        src={languageFlags[currentLanguage] || flagUz}
        alt={`${currentLanguage} flag`}
        className={`absolute left-2.5 top-1/2 -translate-y-1/2 object-cover rounded-sm pointer-events-none border ${
          compact ? 'w-4 h-3' : 'w-5 h-4'
        } border-slate-300 dark:border-slate-600`}
      />
      <select
        value={currentLanguage}
        onChange={(event) => changeLanguage(event.target.value)}
        className={`appearance-none rounded-lg border text-xs font-semibold focus:outline-none ${
          compact ? 'py-2 pl-7 pr-6' : 'py-2.5 pl-9 pr-7'
        } bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200`}
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
          >
            {compact ? lang.code.toUpperCase() : lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
