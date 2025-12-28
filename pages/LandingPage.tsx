
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS, MESSAGES, EMOTIONS } from '../constants';
import { FloatingCard } from '../components/landing/FloatingCard';
import { Button } from '../components/common/Button';
import { EmotionType } from '../types';

export const LandingPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  // Function to get emoji based on emotion type
  const getEmotionEmoji = (emotionType: EmotionType): string => {
    switch (emotionType) {
      case EmotionType.SADNESS: return '🌧️';
      case EmotionType.FEAR: return '👻';
      case EmotionType.ANGER: return '🔥';
      case EmotionType.LONELINESS: return '👤';
      case EmotionType.HOPELESSNESS: return '🖤';
      case EmotionType.PEACE: return '🕊️';
      default: return '✨';
    }
  };

  return (
    <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-12 md:space-y-20 my-auto relative">
      {/* Mobile Floating Cards */}
      <FloatingCard
        msg={MESSAGES[0]} // Sadness
        lang={lang}
        isLight={isLight}
        emoji={getEmotionEmoji(MESSAGES[0].emotion)}
        style={{ top: '-25%', right: '0%', transform: 'rotate(5deg)' }}
        mobileRotation="rotate-[-5deg] md:rotate-0" // Slightly rotate on mobile
        mobileHidden={false} // Always visible on mobile
        className="block sm:block lg:hidden"
      />
      <FloatingCard
        msg={MESSAGES[2]} // Peace
        lang={lang}
        isLight={isLight}
        emoji={getEmotionEmoji(MESSAGES[2].emotion)}
        style={{ top: '100%', left: '0%', transform: 'rotate(-7deg)' }}
        mobileRotation="rotate-[7deg] md:rotate-0" // Slightly rotate on mobile
        mobileHidden={false} // Always visible on mobile
        className="block sm:block lg:hidden"
      />

      {/* Desktop Floating Cards (hidden on mobile) */}
      <FloatingCard msg={MESSAGES[0]} lang={lang} isLight={isLight} emoji={getEmotionEmoji(MESSAGES[0].emotion)} style={{ top: '-10%', left: '0%' }} mobileHidden={true} className="hidden lg:flex" />
      <FloatingCard msg={MESSAGES[1]} lang={lang} isLight={isLight} emoji={getEmotionEmoji(MESSAGES[1].emotion)} style={{ top: '-20%', right: '-8%' }} mobileHidden={true} className="hidden lg:flex" />
      <FloatingCard msg={MESSAGES[2]} lang={lang} isLight={isLight} emoji={getEmotionEmoji(MESSAGES[2].emotion)} style={{ bottom: '0%', left: '-10%' }} mobileHidden={true} className="hidden lg:flex" />
      <FloatingCard msg={MESSAGES[3]} lang={lang} isLight={isLight} emoji={getEmotionEmoji(MESSAGES[3].emotion)} style={{ bottom: '-15%', right: '5%' }} mobileHidden={true} className="hidden lg:flex" />
      <FloatingCard msg={MESSAGES[4] || MESSAGES[0]} lang={lang} isLight={isLight} emoji={getEmotionEmoji(MESSAGES[4]?.emotion || MESSAGES[0].emotion)} style={{ top: '50%', right: '-15%' }} mobileHidden={true} className="hidden lg:flex" />


      <div className="relative z-20 space-y-6 md:space-y-10">
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-title text-5xl md:text-9xl leading-[1.1] md:leading-[1]">
          {t('heroTitleTop')} <br />
          <span className={isLight ? 'text-indigo-600' : 'text-indigo-400 text-shadow-glow'}>{t('heroTitleBottom')}</span>
        </motion.h1>
        <p className={`text-lg md:text-3xl max-w-2xl mx-auto opacity-60 leading-relaxed font-medium font-main px-4 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          {t('heroDesc')}
        </p>
        <Button
          onClick={() => setState(s => ({...s, step: 'AUTH'}))}
          size="lg"
          className="mx-auto flex items-center gap-4 md:gap-5"
        >
          {t('cta')} {isRtl ? <ArrowLeft className="w-6 h-6 md:w-7 md:h-7" /> : <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />}
        </Button>
      </div>
    </motion.div>
  );
};
