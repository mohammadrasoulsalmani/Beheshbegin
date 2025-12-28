
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Share2 } from 'lucide-react';
import { Message } from '../../types';
import { useAppState } from '../../hooks/useAppState';
import { TRANSLATIONS } from '../../constants';
import { Button } from '../common/Button';

interface MessageCardProps {
  msg: Message;
  onClick: (msg: Message) => void;
  onShare: (msg: Message) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ msg, onClick, onShare }) => {
  const { state } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const [liked, setLiked] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`group w-full ${isRtl ? 'text-right' : 'text-left'} p-5 md:p-6 rounded-[2.5rem] border transition-all relative flex flex-col gap-3 md:gap-4 ${
        isLight ? 'bg-white border-indigo-50 shadow-xl shadow-indigo-500/5 hover:border-indigo-200' : 'bg-[#121212] border-white/5 hover:border-white/10 shadow-lg'
      }`}>
      <div className={`flex justify-between items-center ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-center gap-2.5 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className={`text-[9px] px-3 py-1 rounded-full font-bold uppercase tracking-wider font-main ${isLight ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-800 text-zinc-400'}`}>
            {msg.sourceLabel[lang]}
          </span>
          {msg.reference && <span className="text-[8px] md:text-[9px] font-medium opacity-30 font-main">{msg.reference[lang]}</span>}
        </div>
        <div className={`flex items-center gap-1 md:gap-2 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <button onClick={(e) => { e.stopPropagation(); onShare(msg); }} className="p-2 text-zinc-400 hover:text-indigo-500 transition-colors"><Share2 className="w-4 h-4 md:w-4.5 md:h-4.5" /></button>
          <button onClick={(e) => {e.stopPropagation(); setLiked(!liked)}} className={`p-2 transition-colors ${liked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'}`}><Heart className={`w-4 h-4 md:w-4.5 md:h-4.5 ${liked ? 'fill-current' : ''}`} /></button>
        </div>
      </div>
      <p onClick={() => onClick(msg)} className={`text-lg md:text-2xl leading-relaxed font-medium cursor-pointer py-1 md:py-2 font-main ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>
        {msg.text[lang]}
      </p>
      <div className={`flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex items-center gap-3 md:gap-5 text-[9px] md:text-[10px] font-bold opacity-30 font-main ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="flex items-center gap-1.5"><Users className="w-3 md:w-3.5 h-3 md:h-3.5" />{msg.usageCount} {t('usage')}</span>
          <span className="flex items-center gap-1.5"><Heart className="w-3 md:w-3.5 h-3 md:h-3.5" />{msg.likes + (liked ? 1 : 0)} {t('likes')}</span>
        </div>
        <Button onClick={() => onClick(msg)} size="sm">
          {t('selectMessage')}
        </Button>
      </div>
    </motion.div>
  );
};
