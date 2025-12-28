
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { DAILY_SOURCES, TRANSLATIONS } from '../constants';
import { MessageSource } from '../types';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const DailyMessagesPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const [selectedDailySources, setSelectedDailySources] = useState<MessageSource[]>([]);

  const handleSourceToggle = (sourceId: MessageSource) => {
    setSelectedDailySources(prev =>
      prev.includes(sourceId) ? prev.filter(i => i !== sourceId) : [...prev, sourceId]
    );
  };

  return (
    <motion.div key="daily" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto w-full my-auto space-y-10 md:space-y-16">
      <div className="text-center space-y-4">
         <h2 className="font-title text-4xl md:text-7xl">{t('dailyTitle')}</h2>
         <p className="opacity-50 text-lg md:text-xl font-medium font-main">{t('dailyDesc')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
         <div className={`p-8 md:p-12 rounded-[3.5rem] border space-y-8 ${isLight ? 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
            <h3 className="font-title text-2xl mb-6">{t('selectSources')}</h3>
            <div className="grid grid-cols-1 gap-3">
               {DAILY_SOURCES.map(source => (
                  <button
                    key={source.id}
                    onClick={() => handleSourceToggle(source.id)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                       selectedDailySources.includes(source.id)
                       ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                       : (isLight ? 'bg-zinc-50 border-zinc-100' : 'bg-black border-white/5')
                    }`}
                  >
                     <span className="text-2xl font-main">{source.icon}</span>
                     <span className="font-bold flex-grow text-right font-main">{source.label[lang]}</span>
                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDailySources.includes(source.id) ? 'border-white' : 'border-zinc-300'}`}>
                        {selectedDailySources.includes(source.id) && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                     </div>
                  </button>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <div className={`p-10 rounded-[3rem] border ${isLight ? 'bg-white border-indigo-50 shadow-2xl' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
               <h3 className="font-title text-2xl mb-8 text-center">{t('phoneNumber')}</h3>
               <Input
                 dir="ltr"
                 value={state.phoneNumber}
                 onChange={e => setState(s => ({...s, phoneNumber: e.target.value}))}
                 className="text-3xl mb-8"
                 placeholder="09..."
               />
               <div className="flex justify-between items-center mb-8 px-2 font-bold font-main">
                  <span className="opacity-50">{t('dailyPrice')}</span>
                  <span className="text-indigo-600 text-3xl font-title">{t('dailyPrice')}</span>
               </div>
               <Button className="w-full text-xl py-6">
                  {t('subscribe')}
               </Button>
            </div>
            <div className="flex items-center gap-4 opacity-30 text-xs font-bold justify-center font-main">
               <ShieldCheck className="w-4 h-4" /> <span>{t('securePayment')}</span>
               <Lock className="w-4 h-4" /> <span>{t('privacyProtection')}</span>
            </div>
         </div>
      </div>
    </motion.div>
  );
};
