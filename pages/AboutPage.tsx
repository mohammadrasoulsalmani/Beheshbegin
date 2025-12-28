
import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';

export const AboutPage: React.FC = () => {
  const { state, reset } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const features = [
    { title: t('aboutFeature1Title'), desc: t('aboutFeature1Desc'), icon: t('aboutFeature1Icon') },
    { title: t('aboutFeature2Title'), desc: t('aboutFeature2Desc'), icon: t('aboutFeature2Icon') },
    { title: t('aboutFeature3Title'), desc: t('aboutFeature3Desc'), icon: t('aboutFeature3Icon') }
  ];

  return (
    <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto w-full my-auto space-y-16 py-12">
       <div className="text-center space-y-6">
          <h2 className="font-title text-6xl md:text-8xl">{t('aboutTitle')}</h2>
          <p className="text-xl md:text-2xl opacity-60 leading-relaxed font-medium font-main">{t('aboutDesc')}</p>
       </div>
       <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] border text-center space-y-4 ${isLight ? 'bg-white border-indigo-50 shadow-xl' : 'bg-white/5 border-white/10 shadow-2xl'}`}>
               <span className="text-5xl block mb-4 font-main">{item.icon}</span>
               <h3 className="font-title text-2xl text-indigo-600">{item.title}</h3>
               <p className="text-sm opacity-50 leading-relaxed font-medium font-main">{item.desc}</p>
            </div>
          ))}
       </div>
       <div className="text-center">
          <Button variant="ghost" onClick={reset}>
            {t('back')}
          </Button>
       </div>
    </motion.div>
  );
};
