// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Heart,
//   Quote,
//   X,
//   Layout,
//   Type as TypeIcon,
//   Download
// } from 'lucide-react';
// import html2canvas from 'html2canvas';

// import { Message, EmotionType } from '../../types';
// import { EMOTIONS, TRANSLATIONS } from '../../constants';
// import { useAppState } from '../../hooks/useAppState';
// import { FloatingCard } from '../landing/FloatingCard';

// interface ShareModalProps {
//   message: Message;
//   onClose: () => void;
// }

// export const ShareModal: React.FC<ShareModalProps> = ({ message, onClose }) => {
//   const { state } = useAppState();
//   const { lang, theme } = state;
//   const isLight = theme === 'light';
//   const isRtl = lang !== 'en';

//   const [style, setStyle] = useState<'text' | 'card'>('card');
//   const downloadRef = useRef<HTMLDivElement>(null);

//   const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

//   const getEmotionEmoji = (emotionType: EmotionType): string => {
//     switch (emotionType) {
//       case EmotionType.SADNESS: return '🌧️';
//       case EmotionType.FEAR: return '👻';
//       case EmotionType.ANGER: return '🔥';
//       case EmotionType.LONELINESS: return '👤';
//       case EmotionType.HOPELESSNESS: return '🖤';
//       case EmotionType.PEACE: return '🕊️';
//       default: return '✨';
//     }
//   };

//   const currentEmoji = getEmotionEmoji(message.emotion);
//   const emotion = EMOTIONS.find(e => e.type === message.emotion);

//   const handleDownloadImage = async () => {
//     if (!downloadRef.current) return;

//     const canvas = await html2canvas(downloadRef.current, {
//       scale: 3,
//       backgroundColor: null,
//       useCORS: true,
//     });

//     const image = canvas.toDataURL('image/png');
//     const link = document.createElement('a');
//     link.href = image;
//     link.download = `aram-message-${message.id}.png`;
//     link.click();
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto"
//     >
//       <div className="relative w-full max-w-sm py-8">
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-0 right-0 p-3 text-white hover:bg-white/10 rounded-full"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         {/* Style Switch */}
//         <div className="flex justify-center mb-8 gap-4">
//           <button
//             onClick={() => setStyle('text')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border
//               ${style === 'text'
//                 ? 'bg-indigo-600 border-indigo-600 text-white'
//                 : 'bg-white/5 border-white/10 text-white'
//               }`}
//           >
//             <TypeIcon className="w-4 h-4" />
//             {t('textShareStyle')}
//           </button>

//           <button
//             onClick={() => setStyle('card')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border
//               ${style === 'card'
//                 ? 'bg-indigo-600 border-indigo-600 text-white'
//                 : 'bg-white/5 border-white/10 text-white'
//               }`}
//           >
//             <Layout className="w-4 h-4" />
//             {t('cardShareStyle')}
//           </button>
//         </div>

//         {/* Preview Area */}
//         <div
//           className={`w-full aspect-[9/16] rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl
//             ${isLight ? 'bg-white text-zinc-900' : 'bg-[#0a0a0a] text-white'}
//           `}
//         >
//           <div
//             className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-40 ${emotion?.color}`}
//           />

//           {style === 'card' ? (
//             /* ---------- CARD STYLE ---------- */
//             <div className="relative z-10 flex flex-col h-full p-8 justify-between">
//               <div className={`flex justify-between ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
//                     <Heart className="w-4 h-4 text-white" />
//                   </div>
//                   <span className="font-title text-xl">بهش بگین</span>
//                 </div>
//               </div>

//               <div className="flex-grow flex items-center">
//                 <div className={`p-8 rounded-[2.5rem] backdrop-blur-md ${isLight ? 'bg-indigo-50/50' : 'bg-white/5'}`}>
//                   <Quote className="w-10 h-10 opacity-10 mb-6" />
//                   <p className="text-2xl leading-relaxed font-title">
//                     {message.text[lang]}
//                   </p>
//                 </div>
//               </div>

//               <div className={isRtl ? 'text-right' : 'text-left'}>
//                 <span className="text-indigo-600 font-bold">
//                   {message.sourceLabel[lang]}
//                 </span>
//               </div>
//             </div>
//           ) : (
//             /* ---------- TEXT STYLE = FLOATING CARD ---------- */
//             <div className="flex items-center justify-center h-full">
//               <FloatingCard
//                 msg={message}
//                 lang={lang}
//                 isLight={isLight}
//                 emoji={currentEmoji}
//                 style={{ position: 'relative' }}
//                 className="pointer-events-auto"
//               />
//             </div>
//           )}
//         </div>

//         {/* Download */}
//         <button
//           onClick={handleDownloadImage}
//           className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3"
//         >
//           <Download className="w-5 h-5" />
//           دانلود و اشتراک‌گذاری
//         </button>
//       </div>

//       {/* ---------- HIDDEN DOWNLOAD CARD ---------- */}
//       <div
//         ref={downloadRef}
//         className="fixed -left-[2000px] top-0 z-[-1]"
//       >
//         <FloatingCard
//           msg={message}
//           lang={lang}
//           isLight={isLight}
//           emoji={currentEmoji}
//           style={{}}
//           className="pointer-events-auto w-[360px]"
//         />
//       </div>
//     </motion.div>
//   );
// };



import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Quote,
  X,
  Layout,
  Type as TypeIcon,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas';

import { Message, EmotionType } from '../../types';
import { EMOTIONS, TRANSLATIONS } from '../../constants';
import { useAppState } from '../../hooks/useAppState';

interface ShareModalProps {
  message: Message;
  onClose: () => void;
}

// کامپوننت کارت دانلود برای حالت متن
interface DownloadCardStyleProps {
  msg: Message;
  lang: 'fa' | 'en';
  isLight: boolean;
  emoji: string;
}

const DownloadCardStyle: React.FC<DownloadCardStyleProps> = ({ msg, lang, isLight, emoji }) => (
  <div className={`
    relative flex flex-col p-8 rounded-[2.5rem] border-2 w-[400px] min-h-[260px]
    ${isLight
      ? 'bg-white border-indigo-50 shadow-xl'
      : 'bg-black/95 border-white/10 shadow-xl'
    }
  `}>
    <div className="flex justify-between items-start mb-6">
      <div className="text-5xl filter drop-shadow-lg">{emoji}</div>
      <Quote className="w-7 h-7 opacity-30 text-indigo-500 mt-1" />
    </div>
    
    <p className={`text-xl leading-relaxed font-bold flex-grow ${isLight ? 'text-zinc-900' : 'text-white'}`}>
      {msg.text[lang]}
    </p>
  </div>
);

// کامپوننت کارت دانلود برای حالت کارت اصلی
interface DownloadMainCardProps {
  msg: Message;
  lang: 'fa' | 'en';
  isLight: boolean;
  emotionColor: string;
}

const DownloadMainCard: React.FC<DownloadMainCardProps> = ({ msg, lang, isLight, emotionColor }) => (
  <div className={`
    relative w-[340px] aspect-[9/16] rounded-[2.5rem] overflow-hidden flex flex-col
    ${isLight ? 'bg-white text-zinc-900' : 'bg-[#0a0a0a] text-white'}
  `}>
    {/* Background Blur */}
    <div
      className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-30 ${emotionColor}`}
    />
    
    {/* Content */}
    <div className="relative z-10 flex flex-col h-full p-6">
      {/* Header - بالاتر رفته */}
      <div className="flex justify-between items-center pt-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-title text-xl font-bold">بهش بگین</span>
        </div>
      </div>

      {/* Main Message - فاصله بهتر */}
      <div className="flex-grow flex items-center justify-center px-2 py-4">
        <div className={`p-6 rounded-[2rem] backdrop-blur-md w-full ${isLight ? 'bg-indigo-50/60' : 'bg-white/5'}`}>
          <Quote className="w-10 h-10 opacity-20 mb-6 text-indigo-500 mx-auto" />
          <p className="text-2xl leading-relaxed font-bold font-title text-center">
            {msg.text[lang]}
          </p>
        </div>
      </div>

      {/* Footer - فاصله کمتر از پایین */}
      <div className="text-center pb-6">
        <p className={`text-sm font-medium ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
          {msg.sourceLabel[lang]}
        </p>
      </div>
    </div>
  </div>
);

export const ShareModal: React.FC<ShareModalProps> = ({ message, onClose }) => {
  const { state } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';

  const [style, setStyle] = useState<'text' | 'card'>('card');
  const downloadRef = useRef<HTMLDivElement>(null);

  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

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
  const emotion = EMOTIONS.find(e => e.type === message.emotion);

  const handleDownloadImage = async () => {
    if (!downloadRef.current) return;

    try {
      const canvas = await html2canvas(downloadRef.current, {
        scale: 4,
        backgroundColor: isLight ? '#ffffff' : '#0a0a0a',
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `aram-message-${message.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-sm py-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-3 text-white hover:bg-white/10 rounded-full z-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Style Switch */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => setStyle('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border
              ${style === 'text'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white/5 border-white/10 text-white'
              }`}
          >
            <TypeIcon className="w-4 h-4" />
            {t('textShareStyle')}
          </button>

          <button
            onClick={() => setStyle('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border
              ${style === 'card'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white/5 border-white/10 text-white'
              }`}
          >
            <Layout className="w-4 h-4" />
            {t('cardShareStyle')}
          </button>
        </div>

        {/* Preview Area */}
        <div
          className={`w-full aspect-[9/16] rounded-[2.5rem] overflow-hidden relative flex flex-col shadow-2xl
            ${isLight ? 'bg-white text-zinc-900' : 'bg-[#0a0a0a] text-white'}
          `}
        >
          {/* Background Effect */}
          <div
            className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 ${emotion?.color}`}
          />

          {style === 'card' ? (
            /* ---------- CARD STYLE PREVIEW ---------- */
            <div className="relative z-10 flex flex-col h-full p-6">
              {/* Header - بالاتر */}
              <div className="flex justify-between items-center pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-title text-xl">بهش بگین</span>
                </div>
              </div>

              {/* Main Message - فاصله بهتر */}
              <div className="flex-grow flex items-center justify-center px-2 py-4">
                <div className={`p-6 rounded-[2rem] backdrop-blur-md w-full ${isLight ? 'bg-indigo-50/50' : 'bg-white/5'}`}>
                  <Quote className="w-10 h-10 opacity-10 mb-6 text-indigo-500 mx-auto" />
                  <p className="text-2xl leading-relaxed font-title text-center">
                    {message.text[lang]}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pb-6">
                <p className={`text-sm font-medium ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>
                  {message.sourceLabel[lang]}
                </p>
              </div>
            </div>
          ) : (
            /* ---------- TEXT STYLE PREVIEW ---------- */
            <div className="flex items-center justify-center h-full p-4">
              <div className={`
                relative flex flex-col p-6 rounded-[2.5rem] border-2 w-full max-w-xs backdrop-blur-lg
                ${isLight
                  ? 'bg-white border-indigo-100 shadow-xl'
                  : 'bg-white/5 border-white/10 shadow-xl'
                }
              `}>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-3xl filter drop-shadow-lg">{currentEmoji}</div>
                  <Quote className="w-5 h-5 opacity-30 text-indigo-500 mt-1" />
                </div>
                <p className={`text-lg leading-relaxed font-bold ${isLight ? 'text-zinc-800' : 'text-white'}`}>
                  {message.text[lang]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadImage}
          className="mt-8 w-full py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors shadow-lg active:scale-95"
        >
          <Download className="w-5 h-5" />
          دانلود و اشتراک‌گذاری
        </button>
      </div>

      {/* ---------- HIDDEN DOWNLOAD CARD ---------- */}
      <div
        ref={downloadRef}
        className="fixed -left-[2000px] top-0 z-[-1] p-4"
        style={{
          background: isLight ? '#ffffff' : '#0a0a0a',
        }}
      >
        {style === 'card' ? (
          <DownloadMainCard
            msg={message}
            lang={lang}
            isLight={isLight}
            emotionColor={emotion?.color || 'bg-indigo-500'}
          />
        ) : (
          <DownloadCardStyle
            msg={message}
            lang={lang}
            isLight={isLight}
            emoji={currentEmoji}
          />
        )}
      </div>
    </motion.div>
  );
};