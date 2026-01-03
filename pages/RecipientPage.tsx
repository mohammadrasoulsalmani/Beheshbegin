// import React, { useEffect, useState, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
// import { useAppState } from '../hooks/useAppState';
// import { EMOTIONS, TRANSLATIONS } from '../constants';
// import { getMessageWisdom } from '../services/geminiService';
// import { Button } from '../components/common/Button';
// import { api } from '../services/api';

// // اعتبارسنجی شماره موبایل ایرانی
// const PHONE_REGEX = /^09\d{9}$/;

// // تابع helper برای ترجمه ایمن
// const getTranslation = (key: string, lang: 'fa' | 'en' | 'ar'): string => {
//   const translation = TRANSLATIONS[key];
//   if (!translation) {
//     console.warn(`Translation key "${key}" not found in constants.ts`);
//     return key;
//   }
  
//   switch (lang) {
//     case 'fa':
//       return translation.fa;
//     case 'en':
//       return translation.en;
//     case 'ar':
//       return translation.ar;
//     default:
//       return translation.fa;
//   }
// };

// export const RecipientPage: React.FC = () => {
//   const { state, setState } = useAppState();
//   const { lang, theme, selectedMessage, selectedEmotion, recipientNumber, customSenderName, userId, userData } = state;
//   const isLight = theme === 'light';
//   const isRtl = lang !== 'en';
  
//   // تابع ترجمه ایمن
//   const t = useCallback((key: string): string => {
//     return getTranslation(key, lang);
//   }, [lang]);

//   const [aiWisdom, setAiWisdom] = useState<string | null>(null);
//   const [loadingAi, setLoadingAi] = useState(true);
//   const [recipientNumberState, setRecipientNumberState] = useState(recipientNumber);
//   const [recipientNumberError, setRecipientNumberError] = useState<string | null>(null);
//   const [isSendingSms, setIsSendingSms] = useState(false);
//   const [smsResult, setSmsResult] = useState<{
//     success: boolean;
//     message?: string;
//     error?: string;
//     data?: any;
//   } | null>(null);

//   useEffect(() => {
//     const fetchWisdom = async () => {
//       if (selectedMessage && selectedEmotion) {
//         setLoadingAi(true);
//         const emotionLabel = EMOTIONS.find(e => e.type === selectedEmotion)?.label[lang] || '';
//         // const wisdom = await getMessageWisdom(selectedMessage.text[lang], emotionLabel);
//         // setAiWisdom(wisdom);
//         setLoadingAi(false);
//       }
//     };
//     fetchWisdom();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedMessage, selectedEmotion, lang]);

//   // تبدیل اعداد فارسی به انگلیسی
//   const toEnglishNumbers = useCallback((str: string): string => {
//     const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
//     const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
//     return str.split('').map(char => {
//       const index = persianDigits.indexOf(char);
//       return index !== -1 ? englishDigits[index] : char;
//     }).join('');
//   }, []);

//   // تبدیل اعداد انگلیسی به فارسی
//   const toPersianNumbers = useCallback((str: string): string => {
//     const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//     const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
//     return str.split('').map(char => {
//       const index = englishDigits.indexOf(char);
//       return index !== -1 ? persianDigits[index] : char;
//     }).join('');
//   }, []);

//   const validateRecipientPhoneNumber = useCallback((num: string): boolean => {
//     const englishNum = toEnglishNumbers(num);
    
//     if (!englishNum.trim()) {
//       setRecipientNumberError('شماره همراه گیرنده نمی‌تواند خالی باشد.');
//       return false;
//     }
//     if (!PHONE_REGEX.test(englishNum)) {
//       setRecipientNumberError('فرمت شماره همراه گیرنده اشتباه است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
//       return false;
//     }
//     setRecipientNumberError(null);
//     return true;
//   }, [toEnglishNumbers]);

//   const handleRecipientNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
    
//     // فقط اعداد و + را بپذیر
//     value = value.replace(/[^\d۰-۹+]/, '');
    
//     // اگر با ۰۹ شروع نشده، ۰ اضافه کن
//     if (!value.startsWith('۰') && value.length === 10 && /^[۰-۹]{10}$/.test(value)) {
//       value = '۰' + value;
//     }
    
//     setRecipientNumberState(value);
//     validateRecipientPhoneNumber(value);
//     setSmsResult(null);
//   }, [validateRecipientPhoneNumber]);

//   const handleConfirm = useCallback(async () => {
//     if (!validateRecipientPhoneNumber(recipientNumberState)) {
//       return;
//     }

//     if (!userId) {
//       setSmsResult({
//         success: false,
//         error: 'لطفاً ابتدا وارد شوید'
//       });
//       return;
//     }

//     if (!selectedMessage) {
//       setSmsResult({
//         success: false,
//         error: 'پیامی انتخاب نشده است'
//       });
//       return;
//     }

//     setIsSendingSms(true);
//     setSmsResult(null);

//     try {
//       // ارسال SMS با استفاده از API
//       const englishPhone = toEnglishNumbers(recipientNumberState);
      
//       console.log('Sending SMS with params:', {
//         userId,
//         toPhoneNumber: englishPhone,
//         messageId: selectedMessage.code || selectedMessage.id,
//         language: lang as 'fa' | 'en' | 'ar'
//       });

//       const response = await api.request<any>('POST', '/users/send-message', {
//         userId,
//         toPhoneNumber: englishPhone,
//         messageId: selectedMessage.code,
//         language: lang as 'fa' | 'en' | 'ar'
//       });

//       console.log('SMS API Response:', response);

//       if (response?.success) {
//         setSmsResult({
//           success: true,
//           message: `پیام با موفقیت ارسال شد!`,
//           data: response.data
//         });
        
//         // آپدیت موجودی کاربر
//         if (response.data?.remainingBalance !== undefined) {
//           setState(s => ({
//             ...s,
//             userData: {
//               ...s.userData!,
//               balance: response.data.remainingBalance
//             }
//           }));
//         }
//       } else {
//         setSmsResult({
//           success: false,
//           error: response?.error || 'خطا در ارسال پیام'
//         });
//       }
//     } catch (error: any) {
//       console.error('SMS send error:', error);
//       setSmsResult({
//         success: false,
//         error: error.message || 'خطای سرور در ارسال پیام'
//       });
//     } finally {
//       setIsSendingSms(false);
//     }
//   }, [
//     recipientNumberState, 
//     userId, 
//     selectedMessage, 
//     lang, 
//     validateRecipientPhoneNumber, 
//     toEnglishNumbers, 
//     setState, 
//     userData?.balance
//   ]);

//   const isFormValid = recipientNumberState.trim() !== '' && !recipientNumberError;

//   if (!selectedMessage) {
//     setState(s => ({...s, step: 'MESSAGE'}));
//     return null;
//   }

//   // نمایش شماره به فارسی
//   const displayRecipientNumber = toPersianNumbers(recipientNumberState);

//   return (
//     <motion.div 
//       key="recipient" 
//       initial={{ opacity: 0, scale: 0.98 }} 
//       animate={{ opacity: 1, scale: 1 }} 
//       exit={{ opacity: 0 }} 
//       className="max-w-lg mx-auto w-full my-auto space-y-6 px-3 py-4"
//     >
//       {/* دکمه بازگشت */}
//       <button 
//         onClick={() => setState(s => ({...s, step: 'MESSAGE'}))} 
//         className="flex items-center gap-1.5 font-medium text-xs opacity-60 hover:opacity-100 transition-opacity"
//       >
//         {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />} 
//         {t('back')}
//       </button>

//       {/* بخش تحلیل */}
//       <div className={`p-5 rounded-2xl border-l-4 md:border-l-6 border-emerald-500 shadow-lg ${
//         isLight ? 'bg-white border-zinc-50' : 'bg-zinc-900 border-white/5'
//       }`}>
//         <div className={`flex items-start gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//           <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0">
//             <Sparkles className="w-5 h-5 text-emerald-500" />
//           </div>
//           <div className={isRtl ? 'text-right' : 'text-left'}>
//             <h4 className="font-title text-lg md:text-xl text-emerald-600 mb-1.5">{t('aramAnalysis')}</h4>
//             <p className="text-sm opacity-80 leading-relaxed italic font-medium">
//               {loadingAi ? t('fetchingInsight') : aiWisdom}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* فرم دریافت‌کننده */}
//       <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-indigo-50 shadow-lg' : 'bg-zinc-900 border-white/5'}`}>
//         <h3 className="font-title text-xl md:text-2xl mb-6 text-center">{t('recipient')}</h3>
//         <div className="space-y-6">
//           {/* شماره دریافت‌کننده */}
//           <div className="space-y-3">
//             <label className="block text-xs uppercase font-bold tracking-widest opacity-50 mb-1.5">
//               {t('recipientNumber')}
//             </label>
//             <input
//               type="tel"
//               value={displayRecipientNumber}
//               onChange={handleRecipientNumberChange}
//               className={`w-full p-3.5 rounded-xl border text-lg text-center font-medium outline-none transition-all
//                 ${isLight 
//                   ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500 placeholder:text-zinc-400' 
//                   : 'bg-black border-white/10 focus:border-indigo-500 placeholder:text-white/30'
//                 }
//                 ${recipientNumberError ? '!border-red-500 focus:!border-red-500' : ''}
//                 text-right dir-rtl`}
//               placeholder="۰۹۱۲۳۴۵۶۷۸۹"
//               style={{ direction: 'rtl', textAlign: 'right' }}
//             />
//             {recipientNumberError && (
//               <p className="text-red-500 text-xs mt-1 text-center" style={{ direction: 'rtl' }}>
//                 {recipientNumberError}
//               </p>
//             )}
//           </div>

//           {/* نام سفارشی فرستنده */}
//           <div className="space-y-3">
//             <label className="block text-xs uppercase font-bold tracking-widest opacity-50 mb-1.5">
//               {t('customSenderIntro')}
//             </label>
//             <input
//               value={customSenderName}
//               onChange={e => setState(s => ({...s, customSenderName: e.target.value}))}
//               className={`w-full p-3.5 rounded-xl border text-center text-sm font-medium outline-none transition-all
//                 ${isLight 
//                   ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500 placeholder:text-zinc-400' 
//                   : 'bg-black border-white/10 focus:border-indigo-500 placeholder:text-white/30'
//                 }
//                 text-right dir-rtl`}
//               placeholder={t('customSenderPlaceholder')}
//               style={{ direction: 'rtl', textAlign: 'right' }}
//             />
//           </div>

//           {/* نتیجه ارسال SMS */}
//           {smsResult && (
//             <div className={`p-3 rounded-lg ${smsResult.success 
//               ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
//               : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
//             }`}>
//               <p className={`text-center text-sm ${smsResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
//                 {smsResult.success ? smsResult.message : smsResult.error}
//               </p>
//             </div>
//           )}

//           {/* دکمه ارسال */}
//           <Button
//             onClick={handleConfirm}
//             size="md"
//             className="w-full text-base relative"
//             disabled={!isFormValid || isSendingSms}
//           >
//             {isSendingSms ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
//                 در حال ارسال...
//               </>
//             ) : (
//               t('confirm')
//             )}
//           </Button>

//           {/* اطلاعات کاربر */}
//           {/* {userId && userData && (
//             <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
//               موجودی شما: <span className="font-bold">{userData.balance?.toLocaleString() || 0}</span> تومان
//             </div>
//           )} */}
//           {!userId && (
//             <p className="text-center text-xs text-yellow-600 dark:text-yellow-400">
//               برای ارسال پیام باید وارد شوید
//             </p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };


import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';

// اعتبارسنجی شماره موبایل ایرانی
const PHONE_REGEX = /^09\d{9}$/;

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

export const RecipientPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme, selectedMessage, selectedEmotion, recipientNumber, customSenderName } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  
  // تابع ترجمه ایمن
  const t = useCallback((key: string): string => {
    return getTranslation(key, lang);
  }, [lang]);

  const [aiWisdom, setAiWisdom] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(true);
  const [recipientNumberState, setRecipientNumberState] = useState(recipientNumber);
  const [recipientNumberError, setRecipientNumberError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const fetchWisdom = async () => {
      if (selectedMessage && selectedEmotion) {
        setLoadingAi(true);
        setLoadingAi(false);
      }
    };
    fetchWisdom();
  }, [selectedMessage, selectedEmotion, lang]);

  // تبدیل اعداد فارسی به انگلیسی
  const toEnglishNumbers = useCallback((str: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    return str.split('').map(char => {
      const index = persianDigits.indexOf(char);
      return index !== -1 ? englishDigits[index] : char;
    }).join('');
  }, []);

  // تبدیل اعداد انگلیسی به فارسی
  const toPersianNumbers = useCallback((str: string): string => {
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
    return str.split('').map(char => {
      const index = englishDigits.indexOf(char);
      return index !== -1 ? persianDigits[index] : char;
    }).join('');
  }, []);

  const validateRecipientPhoneNumber = useCallback((num: string): boolean => {
    const englishNum = toEnglishNumbers(num);
    
    if (!englishNum.trim()) {
      setRecipientNumberError('شماره همراه گیرنده نمی‌تواند خالی باشد.');
      return false;
    }
    if (!PHONE_REGEX.test(englishNum)) {
      setRecipientNumberError('فرمت شماره همراه گیرنده اشتباه است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return false;
    }
    setRecipientNumberError(null);
    return true;
  }, [toEnglishNumbers]);

  const handleRecipientNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // فقط اعداد و + را بپذیر
    value = value.replace(/[^\d۰-۹+]/, '');
    
    // اگر با ۰۹ شروع نشده، ۰ اضافه کن
    if (!value.startsWith('۰') && value.length === 10 && /^[۰-۹]{10}$/.test(value)) {
      value = '۰' + value;
    }
    
    setRecipientNumberState(value);
    validateRecipientPhoneNumber(value);
  }, [validateRecipientPhoneNumber]);

  const handleConfirm = useCallback(async () => {
    setIsValidating(true);
    
    if (!validateRecipientPhoneNumber(recipientNumberState)) {
      setIsValidating(false);
      return;
    }

    // ذخیره شماره گیرنده و رفتن به صفحه پرداخت
    setState(s => ({
      ...s,
      step: 'PAYMENT',
      recipientNumber: recipientNumberState
    }));
    
    setIsValidating(false);
  }, [
    recipientNumberState, 
    validateRecipientPhoneNumber, 
    setState
  ]);

  const isFormValid = recipientNumberState.trim() !== '' && !recipientNumberError;

  if (!selectedMessage) {
    setState(s => ({...s, step: 'MESSAGE'}));
    return null;
  }

  // نمایش شماره به فارسی
  const displayRecipientNumber = toPersianNumbers(recipientNumberState);

  return (
    <motion.div 
      key="recipient" 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0 }} 
      className="max-w-lg mx-auto w-full my-auto space-y-6 px-3 py-4"
    >
      {/* دکمه بازگشت */}
      <button 
        onClick={() => setState(s => ({...s, step: 'MESSAGE'}))} 
        className="flex items-center gap-1.5 font-medium text-sm opacity-60 hover:opacity-100 transition-opacity"
      >
        {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} 
        {t('back')}
      </button>

      {/* بخش تحلیل */}
      <div className={`p-5 rounded-2xl border-l-4 border-emerald-500 shadow-lg ${
        isLight ? 'bg-white border-zinc-50' : 'bg-zinc-900 border-white/5'
      }`}>
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-title text-lg text-emerald-600 mb-1.5">
              تحلیل بهش‌بگین
            </h4>
            <p className="text-sm opacity-80 leading-relaxed italic font-medium">
              {loadingAi ? 'در حال دریافت بینش...' : aiWisdom || 'این پیام انتخابی شما می‌تواند تأثیر عمیقی بر مخاطب بگذارد.'}
            </p>
          </div>
        </div>
      </div>

      {/* فرم دریافت‌کننده */}
      <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-indigo-50 shadow-lg' : 'bg-zinc-900 border-white/5'}`}>
        <h3 className="font-title text-xl md:text-2xl mb-6 text-center">
          {t('recipient')}
        </h3>
        <div className="space-y-6">
          {/* شماره دریافت‌کننده */}
          <div className="space-y-3">
            <label className="block text-xs uppercase font-bold tracking-widest opacity-50 mb-1.5">
              شماره همراه گیرنده
            </label>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center" style={{ direction: 'rtl' }}>
              شماره گیرنده را وارد کنید
            </div>
            <input
              type="tel"
              value={displayRecipientNumber}
              onChange={handleRecipientNumberChange}
              className={`w-full p-3.5 rounded-xl border text-lg text-center font-medium outline-none transition-all
                ${isLight 
                  ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500 placeholder:text-zinc-400' 
                  : 'bg-black border-white/10 focus:border-indigo-500 placeholder:text-white/30'
                }
                ${recipientNumberError ? '!border-red-500 focus:!border-red-500' : ''}
                text-right dir-rtl`}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              style={{ direction: 'rtl', textAlign: 'right' }}
            />
            {recipientNumberError && (
              <p className="text-red-500 text-xs mt-1 text-center" style={{ direction: 'rtl' }}>
                {recipientNumberError}
              </p>
            )}
          </div>

          {/* نام سفارشی فرستنده */}
          <div className="space-y-3">
            <label className="block text-xs uppercase font-bold tracking-widest opacity-50 mb-1.5">
              نام سفارشی فرستنده (اختیاری)
            </label>
            <input
              value={customSenderName}
              onChange={e => setState(s => ({...s, customSenderName: e.target.value}))}
              className={`w-full p-3.5 rounded-xl border text-center text-sm font-medium outline-none transition-all
                ${isLight 
                  ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500 placeholder:text-zinc-400' 
                  : 'bg-black border-white/10 focus:border-indigo-500 placeholder:text-white/30'
                }
                text-right dir-rtl`}
              placeholder="مثلاً: دوستت"
              style={{ direction: 'rtl', textAlign: 'right' }}
            />
          </div>

          {/* دکمه ادامه به پرداخت */}
          <Button
            onClick={handleConfirm}
            size="md"
            className="w-full text-base relative"
            disabled={!isFormValid || isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                در حال بررسی...
              </>
            ) : (
              'ادامه به پرداخت'
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};