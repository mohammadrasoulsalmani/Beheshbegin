
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { EmotionMeta } from '../../types';
import { useAppState } from '../../hooks/useAppState';

interface EmotionCardProps {
  emotion: EmotionMeta;
  onClick: (type: EmotionMeta['type']) => void;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({ emotion, onClick }) => {
  const { state } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';

  return (
    <motion.button
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(emotion.type)}
      className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border text-right transition-all group flex flex-col gap-4 md:gap-6 ${
        isLight ? 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/5 hover:border-indigo-300' : 'bg-zinc-900 border-white/5 hover:border-white/20'
      }`}
    >
      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-gradient-to-br ${emotion.color} flex items-center justify-center shadow-xl md:shadow-2xl`}>
        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </div>
      <div>
        <h3 className="font-title text-xl md:text-3xl mb-1 md:mb-2">{emotion.label[lang]}</h3>
        <p className="text-[10px] md:text-xs opacity-40 leading-relaxed font-medium font-main">{emotion.description[lang]}</p>
      </div>
    </motion.button>
  );
};
