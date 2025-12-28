
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Sparkles, Search, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { EmotionType, MessageSource, Message } from '../../types';
import { MESSAGES, EMOTIONS, TRANSLATIONS } from '../../constants';
import { searchAiMessages } from '../../services/geminiService';
import { MessageCard } from './MessageCard';
import { Input } from '../common/Input';
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
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];

  const [activeSource, setActiveSource] = useState<MessageSource | 'ALL' | 'AI'>('ALL');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiResults, setAiResults] = useState<Message[]>([]);
  const [searchingAi, setSearchingAi] = useState(false);

  useEffect(() => {
    // Reset AI search when emotion changes or component mounts
    setAiSearchQuery('');
    setAiResults([]);
    setSearchingAi(false);
    setActiveSource('ALL');
  }, [selectedEmotion]);

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
        likes: Math.floor(Math.random() * 100), // Simulate likes
        usageCount: Math.floor(Math.random() * 200), // Simulate usage
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
      <div className="shrink-0 mb-6 md:mb-10 px-2">
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
          <Button variant={activeSource === 'AI' ? 'gradient' : 'secondary'} size="sm" onClick={() => setActiveSource('AI')} className="flex-shrink-0 flex items-center gap-1.5 md:gap-2.5">
            <Sparkles className="w-3.5 md:w-4 h-3.5 md:h-4" /> {t('aiTab')}
          </Button>
        </div>
      </div>

      {activeSource === 'AI' && (
        <div className="mb-6 md:mb-10 space-y-4 md:space-y-5 px-2">
          {/* Reworked AI Search Design - Chat-like input bar */}
          <div className={`relative flex items-center rounded-full overflow-hidden shadow-xl ${isLight ? 'bg-white border border-indigo-100' : 'bg-zinc-800 border border-white/5'}`}>
            <Input
              type="text"
              value={aiSearchQuery}
              onChange={e => setAiSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
              className={`flex-grow p-3 md:p-4 text-sm md:text-base ${isRtl ? 'text-right' : 'text-left'} !border-none !rounded-none focus:ring-0 font-main`}
              placeholder={t('aiPlaceholder')}
            />
            <Button
              onClick={handleAiSearch}
              loading={searchingAi}
              className={`flex-shrink-0 p-2 md:p-3 rounded-full m-1 md:m-2 ${isLight ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`}
              size="sm"
            >
              {searchingAi ? null : <Search className="w-4 h-4 md:w-5 md:h-5" />}
              <span className="sr-only">{t('aiSearchBtn')}</span> {/* SR only for accessibility */}
            </Button>
          </div>
          {searchingAi && <div className={`text-center text-[11px] md:text-[13px] font-bold animate-pulse font-main ${isLight ? 'text-indigo-600' : 'text-indigo-400'} mt-3`}>{t('aiFinding')}</div>}
        </div>
      )}

      <div className="flex-grow overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pb-10 px-2">
        {filteredMessages.map(msg => <MessageCard key={msg.id} msg={msg} onClick={onSelectMessage} onShare={handleShareMessage} />)}
      </div>
    </div>
  );
};
