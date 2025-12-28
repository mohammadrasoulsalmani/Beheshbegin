
import React from 'react';
import { Heart } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { TRANSLATIONS } from '../../constants';

export const Footer: React.FC = () => {
  const { state } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  return (
    <footer className={`w-full py-10 md:py-16 px-6 md:px-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 mt-auto opacity-40 text-[10px] md:text-[12px] font-bold font-main ${isLight ? 'bg-white border-zinc-100 shadow-inner' : 'bg-black/60 border-white/5'}`}>
      <div className="flex items-center gap-3"><Heart className="w-4 h-4 text-indigo-500" /> <span>Aram.ir</span></div>
      <div className={`flex gap-6 md:gap-12 uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <span>{t('privacy')}</span>
        <span>{t('terms')}</span>
        <span>{t('history')}</span>
      </div>
      <div className="font-mono opacity-60">© 2025 ARAM</div>
    </footer>
  );
};
