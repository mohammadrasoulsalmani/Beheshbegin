
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Quote,
  X,
  Layout,
  Type as TypeIcon,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas'; // Import html2canvas
import { Message, EmotionType } from '../../types';
import { EMOTIONS, TRANSLATIONS } from '../../constants';
import { useAppState } from '../../hooks/useAppState';

interface ShareModalProps {
  message: Message;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ message, onClose }) => {
  const { state } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const emotion = EMOTIONS.find(e => e.type === message.emotion);
  const isRtl = lang !== 'en';
  const [style, setStyle] = useState<'text' | 'card'>('card');
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
  const currentEmoji = getEmotionEmoji(message.emotion);

  const handleDownloadImage = async () => {
    const input = document.getElementById('share-card');
    if (input) {
      // Temporarily ensure the element is visible and has correct sizing for capture
      const originalDisplay = input.style.display;
      const originalPosition = input.style.position;
      const originalZIndex = input.style.zIndex;
      const originalOpacity = input.style.opacity;
      const originalLeft = input.style.left;
      const originalTop = input.style.top;

      input.style.display = 'block';
      input.style.position = 'fixed'; // Use fixed to ensure it's not clipped by ancestors
      input.style.zIndex = '99999'; // High z-index to be on top
      input.style.opacity = '0'; // Hide it visually during capture to avoid flicker
      input.style.left = '0';
      input.style.top = '0';


      const canvas = await html2canvas(input, {
        useCORS: true, // If images are from other domains
        scale: 3, // Increase scale for higher resolution image (e.g., 3x for ~1080p width on a 360px wide element)
        backgroundColor: null, // Allow CSS background to be captured
        logging: false, // Disable logging for cleaner console
      });

      // Restore original styles
      input.style.display = originalDisplay;
      input.style.position = originalPosition;
      input.style.zIndex = originalZIndex;
      input.style.opacity = originalOpacity;
      input.style.left = originalLeft;
      input.style.top = originalTop;

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `aram-message-${message.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-sm py-8">
        <button onClick={onClose} className="absolute top-0 right-0 p-3 text-white hover:bg-white/10 rounded-full transition-all"><X className="w-6 h-6" /></button>

        {/* Style Switcher */}
        <div className="flex justify-center mb-8 gap-4">
           <button onClick={() => setStyle('text')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all font-main ${style === 'text' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-white'}`}>
              <TypeIcon className="w-4 h-4" /> {t('textShareStyle')}
           </button>
           <button onClick={() => setStyle('card')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all font-main ${style === 'card' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-white'}`}>
              <Layout className="w-4 h-4" /> {t('cardShareStyle')}
           </button>
        </div>

        {/* Design View */}
        <div id="share-card" className={`w-full aspect-[9/16] rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl transition-all duration-500 ${isLight ? 'bg-white text-zinc-900' : 'bg-[#0a0a0a] text-white'}`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-40 ${emotion?.color}`} />

          {style === 'card' ? (
            <div className="relative z-10 flex flex-col h-full p-8 md:p-10 justify-between">
              <div className={`flex justify-between items-center ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg"><Heart className="w-4 h-4 text-white" /></div>
                  <span className="font-title text-xl md:text-2xl">آرام</span>
                (    </div>
              </div>
              <div className="flex-grow flex flex-col justify-center">
                 <div className={`p-8 rounded-[2.5rem] backdrop-blur-md ${isLight ? 'bg-indigo-50/50' : 'bg-white/5'}`}>
                    <Quote className={`w-10 h-10 opacity-10 mb-6 ${isRtl ? 'mr-0' : 'ml-0'}`} />
                    <p className="text-2xl md:text-4xl leading-relaxed font-title">{message.text[lang]}</p>
                 </div>
              </div>
              <div className={`flex flex-col gap-1.5 pt-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <span className="text-indigo-600 font-bold text-lg md:text-xl font-main">{message.sourceLabel[lang]}</span>
                {message.reference && <span className="text-[10px] md:text-xs opacity-40 font-main">{message.reference[lang]}</span>}
              </div>
              <div className="text-center pt-8">
                <div className="h-px w-16 mx-auto bg-indigo-600/20 mb-4" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 font-main">Aram.ir</p>
              </div>
            </div>
          ) : (
            // Reworked "Simple Text" Design to be a card like the Floating Cards
            <div className="relative z-10 flex flex-col h-full p-8 md:p-10 justify-between">
              <div className={`flex justify-between items-center mb-3 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="text-2xl filter drop-shadow-md">{currentEmoji}</div> {/* Emotion Emoji */}
                <Quote className="w-4 h-4 opacity-20 text-indigo-500" />
              </div>
              <div className="flex-grow flex flex-col justify-center">
                 <div className={`p-5 rounded-[2.5rem] backdrop-blur-md ${isLight ? 'bg-indigo-50/50' : 'bg-white/5'}`}> {/* Inner card styling */}
                    <p className="text-xl md:text-3xl leading-relaxed font-title">{message.text[lang]}</p> {/* Font-title for message text */}
                 </div>
              </div>
              <div className={`flex flex-col gap-1.5 pt-4 ${isRtl ? 'text-right' : 'text-left'}`}>
                <span className="text-indigo-600 font-bold text-base md:text-lg font-main">{message.sourceLabel[lang]}</span> {/* Font-main for source label */}
                {message.reference && <span className="text-[10px] md:text-xs opacity-40 font-main">{message.reference[lang]}</span>} {/* Font-main for reference */}
              </div>
              <div className="text-center pt-8">
                <div className="h-px w-16 mx-auto bg-indigo-600/20 mb-4" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 font-main">Aram.ir</p>
              </div>
            </div>
          )}
        </div>
        <button onClick={handleDownloadImage} className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all shadow-xl font-main"><Download className="w-5 h-5" /> دانلود و اشتراک‌گذاری</button>
      </div>
    </motion.div>
  );
};
