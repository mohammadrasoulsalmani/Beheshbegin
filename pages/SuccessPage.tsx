
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';

export const SuccessPage: React.FC = () => {
  const { state, reset } = useAppState();
  const { lang, theme } = state;
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  return (
    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-10 md:space-y-16 my-auto px-4">
      <div className="w-36 h-36 md:w-48 md:h-48 bg-emerald-500/10 rounded-[3.5rem] md:rounded-[5rem] flex items-center justify-center mx-auto border-4 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
        <CheckCircle className="w-20 h-20 md:w-28 md:h-28 text-emerald-500" />
      </div>
      <h1 className="font-title text-7xl md:text-9xl leading-none">{t('success')}</h1>
      <p className="text-lg md:text-2xl max-w-xl mx-auto opacity-40 font-medium leading-relaxed font-main">{t('messageQueue')}</p>
      <Button variant="secondary" onClick={reset} size="lg">
        {t('goHome')}
      </Button>
    </motion.div>
  );
};
