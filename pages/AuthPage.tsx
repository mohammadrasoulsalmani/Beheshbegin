
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

// Basic phone number validation for Iranian numbers (starts with 09, 11 digits)
const PHONE_REGEX = /^09\d{9}$/;

export const AuthPage: React.FC = () => {
  const { state, setState, reset } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const [phoneNumber, setPhoneNumber] = useState(state.phoneNumber);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);

  const validatePhoneNumber = useCallback((num: string): boolean => {
    if (!num.trim()) {
      setPhoneNumberError(lang === 'fa' ? 'شماره همراه نمی‌تواند خالی باشد.' : lang === 'ar' ? 'لا يمكن أن يكون رقم الهاتف فارغاً.' : 'Phone number cannot be empty.');
      return false;
    }
    if (!PHONE_REGEX.test(num)) {
      setPhoneNumberError(lang === 'fa' ? 'فرمت شماره همراه اشتباه است (مثال: 09123456789)' : lang === 'ar' ? 'تنسيق رقم الهاتف غير صحيح (مثال: 09123456789)' : 'Invalid phone number format (e.g., 09123456789)');
      return false;
    }
    setPhoneNumberError(null);
    return true;
  }, [lang]);

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhoneNumber(value);
  }, [validatePhoneNumber]);

  const handleVerify = useCallback(() => {
    if (validatePhoneNumber(phoneNumber)) {
      setState(s => ({...s, phoneNumber: phoneNumber, step: 'EMOTION', isLoggedIn: true}));
    }
  }, [phoneNumber, validatePhoneNumber, setState]);

  const isFormValid = phoneNumber.trim() !== '' && !phoneNumberError;

  return (
    <motion.div key="auth" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-md mx-auto w-full my-auto space-y-8 px-2">
      <div className={`p-8 md:p-12 rounded-[3.5rem] border text-center ${isLight ? 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
          <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
        </div>
        <h2 className="font-title text-4xl md:text-5xl mb-3 md:mb-4">{t('authTitle')}</h2>
        <p className="text-sm md:text-base opacity-50 mb-8 md:mb-12 font-medium font-main">{t('authDesc')}</p>
        <div className="space-y-6 md:space-y-8">
          <Input
            dir="ltr"
            type="tel" // Use type="tel" for phone numbers
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className={`text-2xl md:text-3xl ${phoneNumberError ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="09..."
          />
          {phoneNumberError && (
            <p className="text-red-500 text-sm mt-2 font-main">{phoneNumberError}</p>
          )}
          <Button
            onClick={handleVerify}
            size="lg"
            className="w-full text-lg md:text-xl"
            disabled={!isFormValid}
          >
            {t('verify')}
          </Button>
        </div>
      </div>
      <Button variant="ghost" onClick={reset} className="w-full text-[10px] md:text-[11px] uppercase tracking-[0.2em]">
        {t('back')}
      </Button>
    </motion.div>
  );
};
