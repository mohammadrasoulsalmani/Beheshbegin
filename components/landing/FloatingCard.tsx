
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Message, Language } from '../../types';

interface FloatingCardProps {
  msg: Message;
  lang: Language;
  isLight: boolean;
  style: React.CSSProperties;
  emoji: string;
  mobileRotation?: string; // New prop for mobile rotation
  mobileHidden?: boolean; // New prop to hide on mobile if needed
  className?: string;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({ msg, lang, isLight, style, emoji, mobileRotation, mobileHidden = false  , className= '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: [0.7, 1, 0.7],
      y: [0, -20, 0],
      rotate: [0, 2, -2, 0]
    }}
    transition={{ duration: 7 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
    style={style}
    className={`absolute pointer-events-none flex-col p-4 sm:p-5 rounded-[2rem] sm:rounded-[2.5rem] border w-40 sm:w-48 backdrop-blur-md z-0
      ${className}
      ${isLight
      ? 'bg-white/70 border-indigo-100 shadow-2xl shadow-indigo-500/10'
      : 'bg-white/5 border-white/10 shadow-2xl'
    } ${mobileRotation || ''} lg:w-60 lg:text-[11px] lg:p-5 lg:rounded-[2.5rem]`}> {/* Adjusted sizes and padding for mobile, added mobileRotation */}
    <div className="flex justify-between items-center mb-2 sm:mb-3">
      <div className="text-xl sm:text-2xl filter drop-shadow-md">{emoji}</div> {/* Adjusted emoji size for mobile */}
      <Quote className="w-3 h-3 sm:w-4 sm:h-4 opacity-20 text-indigo-500" /> {/* Adjusted quote icon size for mobile */}
    </div>
    <p className={`text-[10px] sm:text-[11px] leading-relaxed line-clamp-3 font-medium font-main ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}> {/* Adjusted text size for mobile */}
      {msg.text[lang]}
    </p>
  </motion.div>
);
