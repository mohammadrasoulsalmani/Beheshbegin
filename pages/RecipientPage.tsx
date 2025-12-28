
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { EMOTIONS, TRANSLATIONS } from '../constants';
import { getMessageWisdom } from '../services/geminiService';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

// Basic phone number validation for Iranian numbers (starts with 09, 11 digits)
const PHONE_REGEX = /^09\d{9}$/;

export const RecipientPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme, selectedMessage, selectedEmotion, recipientNumber, customSenderName } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const [aiWisdom, setAiWisdom] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(true);
  const [recipientNumberState, setRecipientNumberState] = useState(recipientNumber);
  const [recipientNumberError, setRecipientNumberError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWisdom = async () => {
      if (selectedMessage && selectedEmotion) {
        setLoadingAi(true);
        const emotionLabel = EMOTIONS.find(e => e.type === selectedEmotion)?.label[lang] || '';
        const wisdom = await getMessageWisdom(selectedMessage.text[lang], emotionLabel);
        setAiWisdom(wisdom);
        setLoadingAi(false);
      }
    };
    fetchWisdom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMessage, selectedEmotion, lang]);

  const validateRecipientPhoneNumber = useCallback((num: string): boolean => {
    if (!num.trim()) {
      setRecipientNumberError(lang === 'fa' ? 'شماره همراه گیرنده نمی‌تواند خالی باشد.' : lang === 'ar' ? 'لا يمكن أن يكون رقم هاتف المستلم فارغاً.' : 'Recipient phone number cannot be empty.');
      return false;
    }
    if (!PHONE_REGEX.test(num)) {
      setRecipientNumberError(lang === 'fa' ? 'فرمت شماره همراه گیرنده اشتباه است (مثال: 09123456789)' : lang === 'ar' ? 'تنسيق رقم هاتف المستلم غير صحيح (مثال: 09123456789)' : 'Invalid recipient phone number format (e.g., 09123456789)');
      return false;
    }
    setRecipientNumberError(null);
    return true;
  }, [lang]);

  const handleRecipientNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipientNumberState(value);
    validateRecipientPhoneNumber(value);
  }, [validateRecipientPhoneNumber]);

  const handleConfirm = useCallback(() => {
    if (validateRecipientPhoneNumber(recipientNumberState)) {
      setState(s => ({...s, recipientNumber: recipientNumberState, step: 'PAYMENT'}));
    }
  }, [recipientNumberState, validateRecipientPhoneNumber, setState]);

  const isFormValid = recipientNumberState.trim() !== '' && !recipientNumberError;

  if (!selectedMessage) {
    setState(s => ({...s, step: 'MESSAGE'}));
    return null;
  }

  return (
    <motion.div key="recipient" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto w-full my-auto space-y-10 md:space-y-12 px-2">
      <Button variant="ghost" onClick={() => setState(s => ({...s, step: 'MESSAGE'}))} className="flex items-center gap-2 font-bold text-[11px] md:text-sm">
        {isRtl ? <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />} {t('back')}
      </Button>

      <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-l-[8px] md:border-l-[12px] border-emerald-500 shadow-2xl ${isLight ? 'bg-white border-zinc-50' : 'bg-zinc-900 border-white/5'}`}>
        <div className={`flex items-start gap-4 md:gap-8 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="p-3 md:p-5 bg-emerald-500/10 rounded-2xl md:rounded-3xl shrink-0"><Sparkles className="w-6 h-6 md:w-9 md:h-9 text-emerald-500" /></div>
          <div className={isRtl ? 'text-right' : 'text-left'}>
            <h4 className="font-title text-xl md:text-3xl text-emerald-600 mb-2 md:mb-3">{t('aramAnalysis')}</h4> {/* Adjusted font size */}
            <p className="text-sm md:text-lg opacity-80 leading-relaxed italic font-medium font-main">{loadingAi ? t('fetchingInsight') : aiWisdom}</p> {/* Adjusted font size */}
          </div>
        </div>
      </div>

      <div className={`p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border ${isLight ? 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/10' : 'bg-zinc-900 border-white/5'}`}>
        <h3 className="font-title text-3xl md:text-4xl mb-8 md:mb-12 text-center">{t('recipient')}</h3>
        <div className="space-y-8 md:space-y-12">
           <Input
             dir="ltr"
             label={t('recipientNumber')}
             type="tel" // Use type="tel" for phone numbers
             value={recipientNumberState}
             onChange={handleRecipientNumberChange}
             className={`text-2xl md:text-4xl ${recipientNumberError ? '!border-red-500 focus:!border-red-500' : ''}`}
             placeholder="09..."
           />
           {recipientNumberError && (
              <p className="text-red-500 text-sm mt-2 text-center font-main">{recipientNumberError}</p>
           )}

          {/* Custom Sender Name Field (optional) */}
          <div className="space-y-4">
            <label className="block text-[10px] md:text-[12px] uppercase font-bold tracking-[0.2em] opacity-30 mb-2 md:mb-3 font-main"> {/* Adjusted mb-4 to mb-2/3 */}
              {t('customSenderIntro')}
            </label>
            <Input
              value={customSenderName}
              onChange={e => setState(s => ({...s, customSenderName: e.target.value}))}
              className="text-base md:text-lg text-center" // Centered text for sender name
              placeholder={t('customSenderPlaceholder')}
            />
          </div>

           <Button
             onClick={handleConfirm}
             size="lg"
             className="w-full text-xl md:text-2xl"
             disabled={!isFormValid}
           >
             {t('confirm')}
           </Button>
        </div>
      </div>
    </motion.div>
  );
};
