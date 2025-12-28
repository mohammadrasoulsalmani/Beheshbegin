
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { PreviewMessage } from '../components/messages/PreviewMessage';
import { Button } from '../components/common/Button';

export const PaymentPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  if (!state.selectedMessage || !state.recipientNumber) {
    setState(s => ({...s, step: 'RECIPIENT'}));
    return null;
  }

  return (
    <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto w-full my-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center px-2">
      <PreviewMessage />
      <div className="flex-grow space-y-8 md:space-y-10 w-full">
         <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border shadow-2xl ${isLight ? 'bg-white border-indigo-50 shadow-indigo-500/5' : 'bg-white/5 border-white/10'}`}>
            <h4 className="font-title text-2xl md:text-4xl mb-6 md:mb-10 flex items-center gap-4 md:gap-5">
              <CreditCard className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" /> {t('billDetails')}
            </h4>
            <div className="space-y-6 md:space-y-8 text-base md:text-lg font-bold font-main">
              <div className="flex justify-between border-b border-zinc-100 dark:border-white/5 pb-4 md:pb-6 opacity-40">
                <span>{t('recipientNumber')}</span>
                <span dir="ltr">{state.recipientNumber}</span>
              </div>
              <div className="flex justify-between pt-6 md:pt-8 text-4xl md:text-6xl font-title">
                <span>{t('totalAmount')}</span>
                <span className="text-indigo-600">{t('totalPrice')}</span>
              </div>
            </div>
         </div>
         <Button
           onClick={() => setState(s => ({...s, step: 'SUCCESS'}))}
           size="lg"
           className="w-full text-2xl md:text-3xl rounded-[1.5rem] md:rounded-[2.5rem]"
         >
           {t('payButton')}
         </Button>
         <div className="flex items-center gap-4 opacity-30 text-xs font-bold justify-center font-main">
            <ShieldCheck className="w-4 h-4" /> <span>{t('securePayment')}</span>
            <Lock className="w-4 h-4" /> <span>{t('privacyProtection')}</span>
         </div>
      </div>
    </motion.div>
  );
};
