
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  loading = false,
  ...props
}) => {
  let baseStyles = "flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed font-main"; // Added font-main
  let variantStyles = '';
  let sizeStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700';
      break;
    case 'secondary':
      variantStyles = 'bg-white text-black border-2 border-zinc-100 shadow-xl hover:bg-zinc-50';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent opacity-30 hover:opacity-100 underline decoration-indigo-500 underline-offset-8';
      break;
    case 'gradient':
      variantStyles = 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl';
      break;
  }

  switch (size) {
    case 'sm':
      sizeStyles = 'px-4 py-2 text-sm rounded-xl';
      break;
    case 'md':
      sizeStyles = 'px-7 py-2.5 text-md rounded-full';
      break;
    case 'lg':
      sizeStyles = 'px-10 py-4 text-lg rounded-full';
      break;
  }

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1116 0A8 8 0 014 12z"></path>
        </svg>
      ) : (
        children
      )}
    </motion.button>
  );
};
