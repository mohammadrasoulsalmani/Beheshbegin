
import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const ContactPage: React.FC = () => {
  const { state } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  return (
     <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto w-full my-auto space-y-12">
        <div className="text-center space-y-6">
           <h2 className="font-title text-5xl md:text-7xl">{t('contactTitle')}</h2>
           <p className="opacity-50 text-xl font-medium font-main">{t('contactDesc')}</p>
        </div>
        <div className={`p-10 rounded-[3.5rem] border space-y-8 ${isLight ? 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
           <div className="grid md:grid-cols-2 gap-6">
              <Input className={`p-5 rounded-2xl border bg-transparent font-bold outline-none focus:border-indigo-600 ${isLight ? 'border-zinc-100' : 'border-white/5'}`} placeholder={t('contactNamePlaceholder')} />
              <Input className={`p-5 rounded-2xl border bg-transparent font-bold outline-none focus:border-indigo-600 ${isLight ? 'border-zinc-100' : 'border-white/5'}`} placeholder={t('contactEmailPhonePlaceholder')} />
           </div>
           <textarea rows={5} className={`w-full p-5 rounded-2xl border bg-transparent font-bold outline-none focus:border-indigo-600 font-main ${isLight ? 'border-zinc-100' : 'border-white/5'}`} placeholder={t('contactMessagePlaceholder')} />
           <Button className="w-full py-5 text-lg">
             {t('sendContactMessage')}
           </Button>
        </div>
        <div className="flex justify-center gap-10 opacity-30 font-bold text-sm font-main">
           <span>info@aram.ir</span>
           <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
        </div>
     </motion.div>
  );
};
