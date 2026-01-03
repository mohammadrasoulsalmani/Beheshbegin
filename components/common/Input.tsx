import React from 'react';
import { useAppState } from '../../hooks/useAppState';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  className, 
  dir = 'auto', // تغییر از ltr به auto
  placeholder,
  type = 'text',
  ...props 
}) => {
  const { state } = useAppState();
  const { theme } = state;
  const isLight = theme === 'light';

  // تعیین dir بر اساس type
  const getDir = () => {
    if (dir !== 'auto') return dir;
    
    // برای شماره تلفن و اعداد از ltr استفاده کن
    if (type === 'tel' || type === 'number') {
      return 'ltr';
    }
    // برای بقیه موارد از rtl استفاده کن (مخصوصاً فارسی)
    return 'rtl';
  };

  // تعیین placeholder بر اساس زبان
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    // اگر placeholder نداریم و input برای شماره تلفن است
    if (type === 'tel') {
      return '۰۹۱۲۳۴۵۶۷۸۹'; // شماره فارسی
    }
    
    return undefined;
  };

  return (
    <div>
      {label && (
        <label className="block text-[10px] md:text-[12px] uppercase font-bold tracking-[0.2em] opacity-30 mb-2 md:mb-3 font-main">
          {label}
        </label>
      )}
      <input
        type={type}
        dir={getDir()}
        placeholder={getPlaceholder()}
        className={`w-full p-4 md:p-6 rounded-2xl border text-center text-xl md:text-2xl font-bold outline-none transition-all font-main
          ${isLight 
            ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500 placeholder:text-zinc-400' 
            : 'bg-black border-white/10 focus:border-indigo-500 placeholder:text-white/30'
          } 
          ${className}`}
        {...props}
      />
    </div>
  );
};