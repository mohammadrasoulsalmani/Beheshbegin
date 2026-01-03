
// import React from 'react';
// import { motion } from 'framer-motion';
// import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
// import { useAppState } from '../hooks/useAppState';
// import { TRANSLATIONS } from '../constants';
// import { PreviewMessage } from '../components/messages/PreviewMessage';
// import { Button } from '../components/common/Button';

// export const PaymentPage: React.FC = () => {
//   const { state, setState } = useAppState();
//   const { lang, theme } = state;
//   const isLight = theme === 'light';
//   const isRtl = lang !== 'en';
//   // Fix: Use a function for 't' to access translations correctly
//   const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

//   if (!state.selectedMessage || !state.recipientNumber) {
//     setState(s => ({...s, step: 'RECIPIENT'}));
//     return null;
//   }

//   return (
//     <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl mx-auto w-full my-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center px-2">
//       <PreviewMessage />
//       <div className="flex-grow space-y-8 md:space-y-10 w-full">
//          <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border shadow-2xl ${isLight ? 'bg-white border-indigo-50 shadow-indigo-500/5' : 'bg-white/5 border-white/10'}`}>
//             <h4 className="font-title text-2xl md:text-4xl mb-6 md:mb-10 flex items-center gap-4 md:gap-5">
//               <CreditCard className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" /> {t('billDetails')}
//             </h4>
//             <div className="space-y-6 md:space-y-8 text-base md:text-lg font-bold font-main">
//               <div className="flex justify-between border-b border-zinc-100 dark:border-white/5 pb-4 md:pb-6 opacity-40">
//                 <span>{t('recipientNumber')}</span>
//                 <span dir="ltr">{state.recipientNumber}</span>
//               </div>
//               <div className="flex justify-between pt-6 md:pt-8 text-4xl md:text-6xl font-title">
//                 <span>{t('totalAmount')}</span>
//                 <span className="text-indigo-600">{t('totalPrice')}</span>
//               </div>
//             </div>
//          </div>
//          <Button
//            onClick={() => setState(s => ({...s, step: 'SUCCESS'}))}
//            size="lg"
//            className="w-full text-2xl md:text-3xl rounded-[1.5rem] md:rounded-[2.5rem]"
//          >
//            {t('payButton')}
//          </Button>
//          <div className="flex items-center gap-4 opacity-30 text-xs font-bold justify-center font-main">
//             <ShieldCheck className="w-4 h-4" /> <span>{t('securePayment')}</span>
//             <Lock className="w-4 h-4" /> <span>{t('privacyProtection')}</span>
//          </div>
//       </div>
//     </motion.div>
//   );
// };


import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';
import { PreviewMessage } from '@/components/messages/PreviewMessage';

// تابع helper برای ترجمه ایمن
const getTranslation = (key: string, lang: 'fa' | 'en' | 'ar'): string => {
  const translation = TRANSLATIONS[key as keyof typeof TRANSLATIONS];
  if (!translation) {
    console.warn(`Translation key "${key}" not found in constants.ts`);
    return key;
  }
  
  switch (lang) {
    case 'fa':
      return translation.fa;
    case 'en':
      return translation.en;
    case 'ar':
      return translation.ar;
    default:
      return translation.fa;
  }
};

export const PaymentPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme, recipientNumber, selectedMessage } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  
  // تابع ترجمه ایمن
  const t = (key: string): string => {
    return getTranslation(key, lang);
  };

  if (!selectedMessage || !recipientNumber) {
    setState(s => ({...s, step: 'RECIPIENT'}));
    return null;
  }

  const handleBack = () => {
    setState(s => ({...s, step: 'RECIPIENT'}));
  };

  return (
    <motion.div 
      key="payment" 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }} 
      className="max-w-5xl mx-auto w-full my-auto flex flex-col lg:flex-row gap-8 md:gap-16 items-center  pt-6"
    >
     <PreviewMessage />
      {/* سمت چپ: متن پیام */}
{/* <div className="flex-1 w-full lg:w-1/2">
  <div
    className={`p-5 md:p-8 rounded-3xl border shadow-xl ${
      isLight ? 'bg-white border-indigo-50' : 'bg-white/5 border-white/10'
    }`}
  >
    <div className="mb-4">
      <h3 className="font-title text-lg md:text-2xl text-center mb-2 md:mb-3">
        متن پیام
      </h3>

      {selectedMessage.author && (
        <p className="text-center text-xs md:text-sm opacity-60 mb-4">
          از طرف: {selectedMessage.author[lang]}
        </p>
      )}
    </div>

    <div
      className={`p-4 md:p-5 rounded-2xl ${
        isLight ? 'bg-indigo-50' : 'bg-white/5'
      }`}
    >
      <p className="text-sm font-bold opacity-60 mb-2 text-center">
        بهش بگین:
      </p>

      <p
        className="text-base md:text-xl text-center leading-relaxed md:leading-relaxed font-medium"
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        {selectedMessage.text[lang]}
      </p>
    </div>
  </div>
</div> */}

{/* سمت راست: جزئیات پرداخت */}
<div className="flex-1 w-full lg:w-1/2 space-y-6">
  {/* دکمه بازگشت */}
  <button
    onClick={handleBack}
    className="flex items-center gap-1.5 font-medium text-xs md:text-sm opacity-60 hover:opacity-100 transition-opacity"
  >
    {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
    {t('back')}
  </button>

  {/* جزئیات پرداخت */}
  <div
    className={`p-5 md:p-8 rounded-3xl border shadow-xl ${
      isLight ? 'bg-white border-indigo-50' : 'bg-white/5 border-white/10'
    }`}
  >
    <h4 className="font-title text-lg md:text-2xl mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
      <CreditCard className="w-6 h-6 md:w-7 md:h-7 text-indigo-500" />
      جزئیات صورتحساب
    </h4>

    <div className="space-y-5 md:space-y-6 font-main">
      {/* شماره گیرنده */}
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-wider opacity-40 font-bold">
          شماره گیرنده
        </span>
        <div className="flex justify-between border-b border-zinc-100 dark:border-white/5 pb-2">
          <span className="text-xs opacity-60">
            پیام به این شماره ارسال می‌شود
          </span>
          <span
            dir="ltr"
            className="font-bold text-base md:text-lg"
          >
            {recipientNumber}
          </span>
        </div>
      </div>

      {/* هزینه سرویس */}
      <div className="flex justify-between border-b border-zinc-100 dark:border-white/5 pb-3 text-sm md:text-base">
        <span className="opacity-60">هزینه ارسال پیامک</span>
        <span className="text-indigo-600 font-semibold">
          ۱,۵۰۰ تومان
        </span>
      </div>

      {/* مجموع */}
      <div className="flex justify-between pt-3 md:pt-4 font-title">
        <span className="text-lg md:text-2xl">
          مبلغ قابل پرداخت
        </span>
        <span className="text-indigo-600 text-2xl md:text-3xl">
          ۱,۵۰۰ تومان
        </span>
      </div>
    </div>
  </div>

  {/* دکمه پرداخت */}
  <Button
    onClick={() => setState(s => ({ ...s, step: 'SUCCESS' }))}
    size="lg"
    className="w-full text-lg md:text-xl py-4 md:py-5 rounded-2xl"
  >
    پرداخت و ارسال
  </Button>

  {/* اطمینان‌بخشی */}
  <div className="flex flex-wrap items-center justify-center gap-5 opacity-50 text-xs md:text-sm font-bold font-main mt-4 md:mt-6">
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-4 h-4" />
      <span>پرداخت امن</span>
    </div>
    <div className="flex items-center gap-2">
      <Lock className="w-4 h-4" />
      <span>حفظ حریم خصوصی</span>
    </div>
  </div>
</div>

    </motion.div>
  );
};