
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Globe,
  ChevronDown,
  Menu,
  Calendar,
  Mail,
  Info,
  BookOpen,
} from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { TRANSLATIONS } from '../../constants';
import { Language } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  onHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHome }) => {
  const { state, setState } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langNames = { fa: 'فارسی', en: 'English', ar: 'العربية' };

  const NavLinks: React.FC<{onLinkClick: () => void}> = ({ onLinkClick }) => (
    <>
      <button onClick={() => {setState(s => ({...s, step: 'DAILY_MESSAGES'})); onLinkClick();}} className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-main">
        <Calendar className="w-4 h-4 md:hidden" /> {t('dailyMessages')}
      </button>
      <button onClick={() => {setState(s => ({...s, step: 'BLOG'})); onLinkClick();}} className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-main">
        <BookOpen className="w-4 h-4 md:hidden" /> {t('blog')}
      </button>
      <button onClick={() => {setState(s => ({...s, step: 'ABOUT'})); onLinkClick();}} className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-main">
        <Info className="w-4 h-4 md:hidden" /> {t('about')}
      </button>
      <button onClick={() => {setState(s => ({...s, step: 'CONTACT'})); onLinkClick();}} className="flex items-center gap-2 hover:text-indigo-600 transition-colors font-main">
        <Mail className="w-4 h-4 md:hidden" /> {t('contact')}
      </button>
    </>
  );

  return (
    <div className="fixed top-4 md:top-8 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
      <nav className={`pointer-events-auto flex items-center px-4 md:px-6 py-2 rounded-full border transition-all duration-300 w-full max-w-4xl relative ${
        isLight
        ? 'bg-white/90 border-indigo-50 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10'
        : 'bg-zinc-900/90 border-white/5 backdrop-blur-2xl shadow-2xl'
      } ${isRtl ? 'flex-row' : 'flex-row-reverse'}
        md:justify-between`}> {/* Add md:justify-between */}

        {/* Mobile Menu Toggle (Left on LTR, Right on RTL) */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-full ${isLight ? 'bg-zinc-50' : 'bg-white/5'}`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Logo (Centered on mobile) */}
        <div className={`flex items-center gap-2 md:gap-3 cursor-pointer ${isRtl ? 'flex-row' : 'flex-row-reverse'}
          flex-grow md:flex-grow-0 justify-center md:justify-start`} onClick={onHome}> {/* Centered on mobile */}
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Heart className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <span className={`font-title text-xl md:text-2xl sm:block ${isLight ? 'text-zinc-900' : 'text-white'}`}>آرام</span>
        </div>

        {/* Desktop Links */}
        <div className={`hidden md:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <NavLinks onLinkClick={() => setMobileMenuOpen(false)} />
        </div>

        {/* Language and Theme Toggle (Right on LTR, Left on RTL on mobile) */}
        <div className={`flex gap-2 md:gap-3 items-center ${isRtl ? 'flex-row-reverse md:flex-row' : 'flex-row md:flex-row-reverse'} ml-auto md:ml-0`}>
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all font-main ${
                isLight ? 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100' : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Globe className="w-3 h-3 opacity-50" />
              <span className="hidden xs:inline">{langNames[lang]}</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute top-full mt-3 w-32 rounded-2xl border p-1.5 shadow-2xl ${
                    isLight ? 'bg-white border-zinc-100' : 'bg-zinc-800 border-white/10'
                  } ${isRtl ? 'right-0' : 'left-0'}`}
                >
                  {(['fa', 'en', 'ar'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => { setState(s => ({...s, lang: l})); setLangOpen(false); }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition-colors font-main ${
                        lang === l ? 'bg-indigo-600 text-white' : (isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/10')
                      } ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                      {langNames[l]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`absolute top-full left-0 right-0 mt-4 mx-4 p-6 rounded-3xl border flex flex-col gap-6 font-bold text-sm overflow-hidden md:hidden ${
                isLight ? 'bg-white border-zinc-100 shadow-2xl' : 'bg-zinc-900 border-white/10 shadow-2xl'
              }`}
            >
              <NavLinks onLinkClick={() => setMobileMenuOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};
