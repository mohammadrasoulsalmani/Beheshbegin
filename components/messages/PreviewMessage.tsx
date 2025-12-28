
import React from 'react';
import { useAppState } from '../../hooks/useAppState';
import { TRANSLATIONS } from '../../constants';

export const PreviewMessage: React.FC = () => {
  const { state } = useAppState();
  const { lang, theme, selectedMessage, customSenderName } = state; // Removed customMessageText
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  // Construct the full message to display in the preview
  // Removed customMessageText from the preview logic
  const previewMessageText = `${selectedMessage?.text[lang] || ''}${customSenderName ? `\n\n(${customSenderName})` : ''}`;

  return (
    <div className="w-full max-w-[280px] md:max-w-sm shrink-0">
      <p className="text-center mb-4 md:mb-8 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.3em] opacity-30 font-main">
        {t('previewLabel')}
      </p>
      <div className={`p-4 md:p-8 rounded-[3rem] md:rounded-[4rem] border-[8px] md:border-[14px] aspect-[9/18.5] relative flex flex-col justify-end shadow-3xl ${isLight ? 'bg-zinc-200 border-zinc-300 shadow-zinc-300/30' : 'bg-zinc-900 border-zinc-800'}`}>
        <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 w-12 md:w-20 h-3 md:h-5 bg-black rounded-full z-20" />
        <div className="flex-grow flex flex-col justify-center p-3 md:p-5">
          <div className={`p-4 md:p-7 rounded-[1.5rem] md:rounded-[2rem] rounded-br-none shadow-2xl ${isLight ? 'bg-white text-zinc-800 shadow-indigo-500/5' : 'bg-zinc-800 text-white'}`}>
            <p className={`text-xs md:text-base leading-relaxed font-medium font-main ${isRtl ? 'text-right' : 'text-left'}`}>
              {previewMessageText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
