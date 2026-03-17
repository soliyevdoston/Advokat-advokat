import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, UserRound } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import flagUz from '../../assets/flags/uz.svg';
import flagOz from '../../assets/flags/oz.svg';
import flagRu from '../../assets/flags/ru.svg';
import flagEn from '../../assets/flags/en.svg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const languageFlags = {
    uz: flagUz,
    oz: flagOz,
    ru: flagRu,
    en: flagEn,
  };

  const navLinks = user?.role === 'lawyer'
    ? [
      { name: 'Kabinet', path: '/lawyer' },
      { name: 'Chat', path: '/chat/support' },
    ]
    : [];

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md py-3 border-b border-slate-100 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to={user?.role === 'lawyer' ? '/lawyer' : '/auth'} className="flex items-center gap-2 group">
            <Logo className="w-9 h-9" color="text-[var(--color-primary)] dark:text-white" />
            <span className="text-xl font-serif font-bold text-[var(--color-primary)] dark:text-white">
              LegalLink Lawyer
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  location.pathname.startsWith(link.path)
                    ? 'text-[var(--color-primary)] dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[var(--color-primary)]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative">
              <img
                src={languageFlags[currentLanguage] || flagUz}
                alt={`${currentLanguage} flag`}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-4 rounded-[3px] object-cover pointer-events-none border border-slate-300 dark:border-slate-600"
              />
              <select
                value={currentLanguage}
                onChange={(event) => changeLanguage(event.target.value)}
                className="appearance-none bg-transparent font-medium text-sm focus:outline-none cursor-pointer py-2 pl-9 pr-8 border rounded-lg text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <Button onClick={handleLogout} variant="outline" className="border-transparent px-4 gap-2 text-red-600 hover:bg-red-50">
                <LogOut size={16} />
                Chiqish
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="btn-primary">Kirish</Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-base font-medium text-slate-700 dark:text-slate-300"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <LogOut size={16} />
                Chiqish
              </button>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full btn-primary justify-center gap-2">
                  <UserRound size={16} />
                  Kirish
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
