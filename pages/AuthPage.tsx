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
    firstName?: string;
    lastName?: string;
    balance: number;
    totalDonated: number;
    isActive: boolean;
  };
  verificationSent: boolean;
}

// تابع helper برای ترجمه ایمن
const getTranslation = (key: string, lang: 'fa' | 'en' | 'ar'): string => {
  const translation = TRANSLATIONS[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found in constants.ts`);
    return key; // اگر کلید وجود نداشت، خود کلید را برگردان
  }
  
  // بازگشت ترجمه بر اساس زبان
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
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validatePhoneNumber = useCallback((num: string): boolean => {
    if (!num.trim()) {
      setPhoneNumberError('شماره همراه نمی‌تواند خالی باشد.'); // متن فارسی مستقیم
      return false;
    }
    if (!PHONE_REGEX.test(num)) {
      setPhoneNumberError('فرمت شماره همراه اشتباه است (مثال: 09123456789)'); // متن فارسی مستقیم
      return false;
    }
    setPhoneNumberError(null);
    return true;
  }, []); // حذف وابستگی به t

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    validatePhoneNumber(value);
    setServerError(null);
  }, [validatePhoneNumber]);

  const handleVerificationCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  }, []);

  // ثبت‌نام یا ورود کاربر با استفاده از api service
  const handleRegister = useCallback(async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      // استفاده از api service جدید
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
      
      // اگر ارسال کد تایید موفق بود
      if (response.verificationSent) {
        setShowVerification(true);
      } else {
        // مستقیماً به مرحله بعد برو
        setState(s => ({...s, step: 'EMOTION'}));
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'خطا در ارتباط با سرور'; // متن فارسی مستقیم
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setServerError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber, validatePhoneNumber, setState]);

  // تایید کد verification
  const handleVerifyCode = useCallback(() => {
    if (verificationCode.length !== 5) {
      setServerError('کد تایید باید ۵ رقمی باشد'); // متن فارسی مستقیم
      return;
    }

    // در اینجا باید API verify را فراخوانی کنید
    // فعلاً مستقیماً به مرحله بعد می‌رویم
    setState(s => ({
      ...s,
      phoneNumber: phoneNumber,
      step: 'EMOTION',
      isLoggedIn: true
    }));
  }, [verificationCode, phoneNumber, setState]);

  // ورود سریع (برای تست)
  const handleQuickLogin = useCallback(() => {
    const testPhone = '09123456789';
    setPhoneNumber(testPhone);
    
    if (validatePhoneNumber(testPhone)) {
      setState(s => ({
        ...s,
        phoneNumber: testPhone,
        userId: 'test-user-id',
        userData: {
          id: 'test-user-id',
          phoneNumber: testPhone,
          balance: 10000,
          totalDonated: 5000,
          isActive: true
        },
        step: 'EMOTION',
        isLoggedIn: true
      }));
    }
  }, [setState, validatePhoneNumber]);

  const isFormValid = phoneNumber.trim() !== '' && !phoneNumberError;

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
          {showVerification ? 'تایید کد' : t('authTitle')}
        </h2>
        
        <p className="text-sm md:text-base opacity-50 mb-8 md:mb-12 font-medium font-main">
          {showVerification 
            ? 'کد ۵ رقمی ارسال شده به شماره خود را وارد کنید' 
            : t('authDesc')
          }
        </p>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 text-sm font-main">{serverError}</p>
          </div>
        )}

        <div className="space-y-6 md:space-y-8">
          {!showVerification ? (
            <>
              <div className="relative">
                <Input
                  dir="ltr"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className={`text-2xl md:text-3xl ${phoneNumberError ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="09..."
                  disabled={isLoading}
                />
                {phoneNumberError && (
                  <p className="text-red-500 text-sm mt-2 font-main text-right">{phoneNumberError}</p>
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
                    در حال پردازش...
                  </>
                ) : (
                  t('verify')
                )}
              </Button>

              {/* دکمه تست برای توسعه */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outline"
                  onClick={handleQuickLogin}
                  size="lg"
                  className="w-full text-lg md:text-xl"
                >
                  ورود آزمایشی
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-lg mb-2 font-main">
                  کد به شماره زیر ارسال شد:
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-main">
                  {phoneNumber}
                </p>
              </div>

              <Input
                dir="ltr"
                type="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="text-3xl text-center tracking-widest"
                placeholder="12345"
                maxLength={5}
                disabled={isLoading}
              />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowVerification(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {t('back')}
                </Button>
                
                <Button
                  onClick={handleVerifyCode}
                  size="lg"
                  className="flex-1"
                  disabled={verificationCode.length !== 5 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      در حال تایید...
                    </>
                  ) : (
                    t('confirm')
                  )}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowVerification(false);
                    handleRegister();
                  }}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-main"
                  disabled={isLoading}
                >
                  ارسال مجدد کد
                </button>
              </div>
            </>
          )}
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
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs">
          <p className="font-mono">
            API URL: {process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}
          </p>
          <p className="font-mono mt-1">
            Phone: {phoneNumber} | Valid: {isFormValid.toString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};