import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Loader2, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { EmotionType, MessageSource, Message } from '../../types';
import { MESSAGES, EMOTIONS, TRANSLATIONS } from '../../constants';
import { searchAiMessages } from '../../services/geminiService';
import { MessageCard } from './MessageCard';
import { Button } from '../common/Button';

interface MessageListProps {
  selectedEmotion: EmotionType;
  onSelectMessage: (msg: Message) => void;
  onBack: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  selectedEmotion,
  onSelectMessage,
  onBack,
}) => {
  const { state, setState } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];
  const aiTabRef = useRef<HTMLButtonElement>(null);

  const [activeSource, setActiveSource] = useState<MessageSource | 'ALL' | 'AI'>('ALL');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiResults, setAiResults] = useState<Message[]>([]);
  const [searchingAi, setSearchingAi] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  useEffect(() => {
    setAiSearchQuery('');
    setAiResults([]);
    setSearchingAi(false);
    setInputFocused(false);
    setActiveSource('ALL');
  }, [selectedEmotion]);

  // Scroll to AI tab when it's selected on mobile
  useEffect(() => {
    if (activeSource === 'AI' && aiTabRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        aiTabRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }, 100);
    }
  }, [activeSource]);

  const handleAiSearch = useCallback(async () => {
    if (!aiSearchQuery.trim() || !selectedEmotion) return;
    setSearchingAi(true);
    const emotionLabel = EMOTIONS.find(e => e.type === selectedEmotion)?.label[lang] || '';
    try {
      const results = await searchAiMessages(aiSearchQuery, emotionLabel, lang);
      const formatted = results.map((r, idx) => ({
        id: `ai-${idx}-${Date.now()}`,
        text: r.text,
        source: MessageSource.AI,
        sourceLabel: r.sourceLabel,
        reference: r.reference,
        emotion: selectedEmotion,
        likes: Math.floor(Math.random() * 100),
        usageCount: Math.floor(Math.random() * 200),
      }));
      setAiResults(formatted);
    } catch (error) {
      console.error("Failed to fetch AI messages:", error);
      setAiResults([]);
    } finally {
      setSearchingAi(false);
    }
  }, [aiSearchQuery, selectedEmotion, lang]);

  const filteredMessages = useMemo(() => {
    if (activeSource === 'AI') return aiResults;
    return MESSAGES.filter(m => {
      const matchEmotion = m.emotion === selectedEmotion;
      const matchSource = activeSource === 'ALL' || m.source === activeSource;
      return matchEmotion && matchSource;
    });
  }, [selectedEmotion, activeSource, aiResults]);

  const availableSources = useMemo(() => {
    const sources = MESSAGES
      .filter(m => m.emotion === selectedEmotion)
      .map(m => ({ id: m.source, label: m.sourceLabel[lang] }));
    const unique = Array.from(new Map(sources.map(item => [item.id, item])).values());
    return unique;
  }, [selectedEmotion, lang]);

  const handleShareMessage = useCallback((msg: Message) => {
    setState(s => ({...s, sharingMessage: msg}));
  }, [setState]);

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      <div className="shrink-0 mb-6 md:mb-10 px-4 md:px-2">
        <button onClick={onBack} className="flex items-center gap-1 md:gap-2 mb-4 md:mb-8 font-bold text-[11px] md:text-sm opacity-40 hover:opacity-100 transition-opacity font-main">
          {isRtl ? <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />} {t('changeEmotion')}
        </button>
        <h2 className="font-title text-3xl md:text-6xl mb-6 md:mb-8">{t('selectMessage')}</h2>
        <div className={`flex items-center gap-2 p-1.5 md:p-2 rounded-3xl w-full max-w-full overflow-x-auto no-scrollbar ${isLight ? 'bg-indigo-50/60' : 'bg-white/5'}`}>
          <Button variant={activeSource === 'ALL' ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveSource('ALL')} className="flex-shrink-0">
            {isRtl ? 'همه منابع' : 'All Sources'}
          </Button>
          {availableSources.map(s => (
            <Button key={s.id} variant={activeSource === s.id ? 'primary' : 'secondary'} size="sm" onClick={() => setActiveSource(s.id as any)} className="flex-shrink-0">
              {s.label}
            </Button>
          ))}
          <Button 
            ref={aiTabRef}
            variant={activeSource === 'AI' ? 'gradient' : 'secondary'} 
            size="sm" 
            onClick={() => setActiveSource('AI')} 
            className="flex-shrink-0 flex items-center gap-1.5 md:gap-2.5"
          >
            <Sparkles className="w-3.5 md:w-4 h-3.5 md:h-4" /> {t('aiTab')}
          </Button>
        </div>
      </div>

      {activeSource === 'AI' && (
        <div className="mb-6 md:mb-10 space-y-4 md:space-y-5 px-4 md:px-2">
          {/* DeepSeek-like Chat Input Design */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-2xl shadow-lg transition-all duration-300 ${
              inputFocused 
                ? `${isLight 
                    ? 'ring-2 ring-indigo-400/50 bg-white border border-indigo-200' 
                    : 'ring-2 ring-indigo-500/30 bg-zinc-900/80 border border-zinc-700'}`
                : `${isLight 
                    ? 'bg-white border border-gray-200' 
                    : 'bg-zinc-900/60 border border-zinc-800'}`
            }`}
            style={{
              minHeight: '80px',
            }}
          >
            {/* Sparkles icon in top right corner */}
            <div className="absolute top-3 right-3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight 
                  ? 'bg-gradient-to-br from-indigo-100 to-purple-100' 
                  : 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
              }`}>
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
            </div>

            {/* Custom DeepSeek-like Input */}
            <div className="px-4 pt-14 pb-5 pl-8">
              <textarea
                value={aiSearchQuery}
                onChange={e => setAiSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiSearch();
                  }
                }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`w-full resize-none text-sm md:text-base font-main bg-transparent outline-none placeholder-gray-500 ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
                placeholder={t('aiPlaceholder')}
                rows={3}
                style={{
                  minHeight: '60px',
                }}
              />
            </div>
            
            {/* Send Button in bottom left corner */}
            <div className="absolute bottom-3 left-3">
              <motion.button
                onClick={handleAiSearch}
                disabled={!aiSearchQuery.trim() || searchingAi}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                  !aiSearchQuery.trim() || searchingAi
                    ? `${isLight 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`
                    : `${isLight 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg'}`
                }`}
              >
                {searchingAi ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                ) : (
                  <ArrowUp className={`w-4 h-4 ${!aiSearchQuery.trim() ? 'opacity-50' : ''}`} />
                )}
                <span className="sr-only">{t('aiSearchBtn')}</span>
              </motion.button>
            </div>
          </motion.div>
          
          {/* Quick suggestions (optional) */}
          <div className="flex flex-wrap gap-2 justify-center px-1">
            {['سلام', 'چطوری؟', 'خوشحالم', 'دوستت دارم'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setAiSearchQuery(suggestion);
                  setTimeout(() => {
                    const textarea = document.querySelector('textarea');
                    if (textarea) {
                      textarea.focus();
                    }
                  }, 100);
                }}
                className={`px-3 py-1.5 text-xs md:text-sm rounded-full transition-colors font-main ${
                  isLight
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
          
          {/* Searching status */}
          {searchingAi && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-xs md:text-sm font-medium font-main ${isLight ? 'text-indigo-500' : 'text-indigo-400'} flex items-center justify-center gap-2`}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('aiFinding')}
            </motion.div>
          )}
        </div>
      )}

      <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pb-10 px-4 md:px-2">
        {filteredMessages.map(msg => <MessageCard key={msg.id} msg={msg} onClick={onSelectMessage} onShare={handleShareMessage} />)}
      </div>
    </div>
  );
};