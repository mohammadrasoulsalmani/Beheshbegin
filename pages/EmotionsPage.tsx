
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';
import { EMOTIONS, TRANSLATIONS } from '../constants';
import { EmotionType } from '../types';
import { EmotionCard } from '../components/emotions/EmotionCard';

export const EmotionsPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme } = state;
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const handleSelectEmotion = useCallback((type: EmotionType) => {
    setState(prev => ({ ...prev, selectedEmotion: type, step: 'MESSAGE' }));
  }, [setState]);

  return (
    <motion.div key="emotion" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="my-auto space-y-10 md:space-y-16">
      <div className="text-center px-2">
        <h2 className="font-title text-4xl md:text-7xl mb-4 md:mb-6">{t('emotionTitle')}</h2>
        <p className="opacity-40 text-base md:text-xl font-medium font-main">{t('empathyStep')}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto px-2">
        {EMOTIONS.map(e => (
          <EmotionCard key={e.type} emotion={e} onClick={handleSelectEmotion} />
        ))}
      </div>
    </motion.div>
  );
};
