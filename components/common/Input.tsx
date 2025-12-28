
import React from 'react';
import { useAppState } from '../../hooks/useAppState';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  const { state } = useAppState();
  const { theme } = state;
  const isLight = theme === 'light';

  return (
    <div>
      {label && (
        <label className="block text-[10px] md:text-[12px] uppercase font-bold tracking-[0.2em] opacity-30 mb-2 md:mb-3 font-main"> {/* Adjusted mb-4 to mb-2/3 */}
          {label}
        </label>
      )}
      <input
        className={`w-full p-4 md:p-6 rounded-2xl border text-center text-xl md:text-2xl font-bold outline-none transition-all font-main ${ // Added font-main here
          isLight ? 'bg-zinc-50 border-zinc-100 focus:border-indigo-500' : 'bg-black border-white/10 focus:border-indigo-500'
        } ${className}`}
        {...props}
      />
    </div>
  );
};
