import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS } from '../constants';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { api } from '../services/api';

// اعتبارسنجی شماره موبایل ایرانی
const PHONE_REGEX = /^09\d{9}$/;

// تایپ برای پاسخ API
interface RegisterResponse {
  user: {
    id: string;
    phoneNumber: string;
    balance: number;
    totalDonated: number;
    isActive: boolean;
  };
}

// تابع helper برای ترجمه ایمن
const getTranslation = (key: string, lang: 'fa' | 'en' | 'ar'): string => {
  const translation = TRANSLATIONS[key];
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

export const AuthPage: React.FC = () => {
  const { state, setState, reset } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  
  // تابع ترجمه ایمن
  const t = useCallback((key: string): string => {
    return getTranslation(key, lang);
  }, [lang]);

  const [phoneNumber, setPhoneNumber] = useState(state.phoneNumber);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validatePhoneNumber = useCallback((num: string): boolean => {
    if (!num.trim()) {
      setPhoneNumberError('شماره همراه نمی‌تواند خالی باشد.');
      return false;
    }
    if (!PHONE_REGEX.test(num)) {
      setPhoneNumberError('فرمت شماره همراه اشتباه است (مثال: 09123456789)');
      return false;
    }
    setPhoneNumberError(null);
    return true;
  }, []);

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // تبدیل اعداد فارسی به انگلیسی برای پردازش
    const persianToEnglish = (str: string): string => {
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      return str.split('').map(char => {
        const index = persianDigits.indexOf(char);
        return index !== -1 ? englishDigits[index] : char;
      }).join('');
    };
    
    value = persianToEnglish(value);
    setPhoneNumber(value);
    validatePhoneNumber(value);
    setServerError(null);
  }, [validatePhoneNumber]);

  // ثبت‌نام یا ورود کاربر
  const handleRegister = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      // استفاده از api service
      const response = await api.users.register(phoneNumber) as RegisterResponse;

      // ذخیره اطلاعات کاربر در state
      setState(s => ({
        ...s,
        phoneNumber: phoneNumber,
        userId: response.user.id,
        userData: response.user,
        step: 'EMOTION',
        isLoggedIn: true
      }));
      
      // مستقیماً به مرحله بعد برو
      setState(s => ({...s, step: 'EMOTION'}));
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'خطا در ارتباط با سرور';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.error) {
        errorMessage = error.error;
      }
      
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber, validatePhoneNumber, setState]);

  const isFormValid = phoneNumber.trim() !== '' && !phoneNumberError;

  // تابع برای نمایش اعداد فارسی
  const displayPersianNumbers = (num: string): string => {
    const englishToPersian = (str: string): string => {
      const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      
      return str.split('').map(char => {
        const index = englishDigits.indexOf(char);
        return index !== -1 ? persianDigits[index] : char;
      }).join('');
    };
    
    return englishToPersian(num);
  };

  return (
    <motion.div 
      key="auth" 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0 }} 
      className="max-w-md mx-auto w-full my-auto space-y-8 px-2"
    >
      <div className={`p-8 md:p-12 rounded-[3.5rem] border text-center ${isLight ? 'bg-white border-indigo-50 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
        <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
          <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
        </div>
        
        <h2 className="font-title text-4xl md:text-5xl mb-3 md:mb-4">
          {t('authTitle')}
        </h2>
        
        <p className="text-sm md:text-base opacity-50 mb-8 md:mb-12 font-medium font-main">
          {t('authDesc')}
        </p>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-main">{serverError}</p>
          </div>
        )}

        <div className="space-y-6 md:space-y-8">
          <div className="relative">
            <input
              type="tel"
              value={displayPersianNumbers(phoneNumber)}
              onChange={handlePhoneNumberChange}
              className={`w-full p-4 md:p-6 rounded-2xl border text-center text-xl md:text-2xl font-bold outline-none transition-all font-main
                ${isLight 
                  ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500 placeholder:text-zinc-400' 
                  : 'bg-black border-white/10 focus:border-indigo-500 placeholder:text-white/30'
                }
                ${phoneNumberError ? 'border-red-500 focus:border-red-500' : ''}
                text-right dir-rtl`}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              disabled={isLoading}
              dir="rtl" // فارسی راست‌چین
              style={{ direction: 'rtl', textAlign: 'center' }}
            />
            {phoneNumberError && (
              <p className="text-red-500 text-sm mt-2 font-main text-right" style={{ direction: 'rtl' }}>
                {phoneNumberError}
              </p>
            )}
          </div>

          <Button
            onClick={handleRegister}
            size="lg"
            className="w-full text-lg md:text-xl relative"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                در حال ورود...
              </>
            ) : (
              'ورود' // تغییر از t('verify') به 'ورود'
            )}
          </Button>
        </div>
      </div>

      <Button 
        variant="ghost" 
        onClick={reset} 
        className="w-full text-[10px] md:text-[11px] uppercase tracking-[0.2em]"
        disabled={isLoading}
      >
        {t('back')}
      </Button>

      {/* اطلاعات اتصال به API برای دیباگ */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
          <p className="font-mono">
            API URL: {process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}
          </p>
          <p className="font-mono mt-1">
            Phone: {phoneNumber} | Valid: {isFormValid.toString()}
          </p>
        </div>
      )} */}
    </motion.div>
  );
};