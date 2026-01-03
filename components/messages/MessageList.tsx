import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Loader2, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppState } from '../../hooks/useAppState';
import { EmotionType, MessageSource, Message } from '../../types';
import { EMOTIONS, TRANSLATIONS } from '../../constants';
import { searchAiMessages } from '../../services/geminiService';
import { api } from '../../services/api';
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [activeSource, setActiveSource] = useState<MessageSource | 'ALL' | 'AI'>('ALL');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiResults, setAiResults] = useState<Message[]>([]);
  const [searchingAi, setSearchingAi] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sources, setSources] = useState<Array<{id: string | MessageSource, label: string}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [allMessagesCache, setAllMessagesCache] = useState<Message[]>([]);

  // Fetch all messages initially and cache them
  const fetchAllMessages = useCallback(async () => {
    setLoadingMessages(true);
    setError(null);
    
    try {
      const params: any = {
        emotion: selectedEmotion,
        limit: 100,
        sortBy: 'usageCount',
        sortOrder: 'desc'
      };

      const response = await api.messages.getMessages(params);
      console.log("All messages API Response:", response);
      
      let allMessages: Message[] = [];
      
      if (Array.isArray(response)) {
        allMessages = response.map((msg: any) => ({
          id: msg.id || msg.code,
          code: msg.code,
          emotion: msg.emotion,
          source: msg.source,
          sourceLabel: msg.sourceLabel,
          reference: msg.reference,
          likes: msg.likes,
          usageCount: msg.usageCount,
          text: msg.text,
          tags: msg.tags || [],
          category: msg.category,
          isActive: msg.isActive,
        }));
      } else if (response && response.data && Array.isArray(response.data)) {
        allMessages = response.data.map((msg: any) => ({
          id: msg.id || msg.code,
          code: msg.code,
          emotion: msg.emotion,
          source: msg.source,
          sourceLabel: msg.sourceLabel,
          reference: msg.reference,
          likes: msg.likes,
          usageCount: msg.usageCount,
          text: msg.text,
          tags: msg.tags || [],
          category: msg.category,
          isActive: msg.isActive,
        }));
      }
      
      setAllMessagesCache(allMessages);
      setMessages(allMessages);
      
      // استخراج منابع منحصر به فرد
      const uniqueSources = Array.from(
        new Map(
          allMessages.map((m: any) => [m.source, {
            id: m.source,
            label: typeof m.sourceLabel === 'object' 
              ? m.sourceLabel[lang] 
              : m.sourceLabel || m.source
          }])
        ).values()
      );
      setSources(uniqueSources);
      
    } catch (error: any) {
      console.error('Error loading all messages:', error);
      setError(error.message || 'خطا در دریافت پیام‌ها');
      setAllMessagesCache([]);
      setMessages([]);
      setSources([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedEmotion, lang]);

  // Initial load and when emotion changes
  useEffect(() => {
    fetchAllMessages();
    
    // Reset states
    setAiSearchQuery('');
    setAiResults([]);
    setSearchingAi(false);
    setInputFocused(false);
    setActiveSource('ALL');
  }, [fetchAllMessages]);

  // Handle source change - use cache for filtering
  useEffect(() => {
    if (activeSource === 'AI') {
      return; // AI handled separately
    }
    
    if (activeSource === 'ALL') {
      setMessages(allMessagesCache);
    } else {
      // Filter from cache
      const filtered = allMessagesCache.filter(msg => msg.source === activeSource);
      setMessages(filtered);
    }
  }, [activeSource, allMessagesCache]);

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

  // Reset scroll position when source changes
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [activeSource]);

  const handleAiSearch = useCallback(async () => {
    if (!aiSearchQuery.trim() || !selectedEmotion) return;
    
    setSearchingAi(true);
    setError(null);
    
    const emotionLabel = EMOTIONS.find(e => e.type === selectedEmotion)?.label[lang] || '';
    
    try {
      const results = await searchAiMessages(aiSearchQuery, emotionLabel, lang);
      
      const formatted = results.map((r, idx) => ({
        id: `ai-${idx}-${Date.now()}`,
        code: `ai-${Date.now()}-${idx}`,
        text: r.text,
        source: MessageSource.AI,
        sourceLabel: r.sourceLabel,
        reference: r.reference,
        emotion: selectedEmotion,
        likes: Math.floor(Math.random() * 100),
        usageCount: Math.floor(Math.random() * 200),
        tags: ['ai-generated'],
        category: 'ai',
        isActive: true,
      })) as Message[];
      
      setAiResults(formatted);
      setMessages(formatted);
      
    } catch (error: any) {
      console.error("Failed to fetch AI messages:", error);
      setError(error.message || 'خطا در تولید پیام هوش مصنوعی');
      setAiResults([]);
      setMessages([]);
    } finally {
      setSearchingAi(false);
    }
  }, [aiSearchQuery, selectedEmotion, lang]);

  const filteredMessages = useMemo(() => {
    if (activeSource === 'AI') return aiResults;
    return messages;
  }, [activeSource, messages, aiResults]);

  const handleShareMessage = useCallback((msg: Message) => {
    setState(s => ({...s, sharingMessage: msg}));
  }, [setState]);

  const handleMessageLike = useCallback(async (messageCode: string) => {
    try {
      const response = await api.messages.likeMessage(messageCode);
      if (response?.success) {
        // به‌روزرسانی تعداد لایک‌ها در state
        const updatedLikes = response.likes || (() => {
          const msg = messages.find(m => m.code === messageCode);
          return msg ? msg.likes + 1 : 0;
        })();
        
        setMessages(prev => prev.map(msg => 
          msg.code === messageCode 
            ? { ...msg, likes: updatedLikes } 
            : msg
        ));
        
        setAllMessagesCache(prev => prev.map(msg => 
          msg.code === messageCode 
            ? { ...msg, likes: updatedLikes } 
            : msg
        ));
        
        setAiResults(prev => prev.map(msg => 
          msg.code === messageCode 
            ? { ...msg, likes: updatedLikes } 
            : msg
        ));
      }
    } catch (error) {
      console.error('Failed to like message:', error);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed */}
      <div className="shrink-0 mb-6 md:mb-10 px-4 md:px-2">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 md:gap-2 mb-4 md:mb-8 font-bold text-[11px] md:text-sm opacity-40 hover:opacity-100 transition-opacity font-main"
        >
          {isRtl ? <ArrowRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />} 
          {t('changeEmotion')}
        </button>
        
        <h2 className="font-title text-3xl md:text-6xl mb-6 md:mb-8">
          {t('selectMessage')}
        </h2>
        
        {/* Source Tabs */}
        <div className={`flex items-center gap-2 p-1.5 md:p-2 rounded-3xl w-full max-w-full overflow-x-auto no-scrollbar ${
          isLight ? 'bg-indigo-50/60' : 'bg-white/5'
        }`}>
          <Button 
            variant={activeSource === 'ALL' ? 'primary' : 'secondary'} 
            size="sm" 
            onClick={() => setActiveSource('ALL')} 
            className="flex-shrink-0"
          >
            {isRtl ? 'همه منابع' : 'All Sources'}
          </Button>
          
          {sources.map(s => (
            <Button 
              key={s.id} 
              variant={activeSource === s.id ? 'primary' : 'secondary'} 
              size="sm" 
              onClick={() => setActiveSource(s.id as MessageSource)} 
              className="flex-shrink-0"
            >
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
            <Sparkles className="w-3.5 md:w-4 h-3.5 md:h-4" /> 
            {t('aiTab')}
          </Button>
        </div>
      </div>

      {/* AI Search Section */}
      {activeSource === 'AI' && (
        <div className="shrink-0 mb-6 md:mb-10 space-y-4 md:space-y-5 px-4 md:px-2">
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
            style={{ minHeight: '80px' }}
          >
            <div className="absolute top-3 right-3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isLight 
                  ? 'bg-gradient-to-br from-indigo-100 to-purple-100' 
                  : 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30'
              }`}>
                <Sparkles className="w-4 h-4 text-indigo-500" />
              </div>
            </div>

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
                style={{ minHeight: '60px' }}
              />
            </div>
            
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
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <ArrowUp className={`w-4 h-4 ${!aiSearchQuery.trim() ? 'opacity-50' : ''}`} />
                )}
                <span className="sr-only">{t('aiSearchBtn')}</span>
              </motion.button>
            </div>
          </motion.div>
          
          <div className="flex flex-wrap gap-2 justify-center px-1">
            {['امید', 'صبر', 'آرامش', 'عشق'].map((suggestion) => (
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
          
          {searchingAi && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center text-xs md:text-sm font-medium font-main ${
                isLight ? 'text-indigo-500' : 'text-indigo-400'
              } flex items-center justify-center gap-2`}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('aiFinding')}
            </motion.div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="shrink-0 mx-4 md:mx-2 mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Messages List - Scrollable Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pb-10 px-4 md:px-2"
        style={{ 
          maxHeight: 'calc(100vh - 300px)', // Adjust based on your header height
          minHeight: '200px'
        }}
      >
        {loadingMessages ? (
          <div className="flex flex-col justify-center items-center h-48 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
            <p className="text-gray-500 dark:text-gray-400">
              {isRtl ? 'در حال دریافت پیام‌ها...' : 'Loading messages...'}
            </p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-lg mb-2">
              {activeSource === 'AI' 
                ? t('aiPlaceholder')
                : isRtl ? 'هیچ پیامی یافت نشد' : 'No messages found'}
            </p>
            {activeSource === 'AI' && (
              <p className="text-sm opacity-75">
                {isRtl ? 'یک موضوع بنویسید تا هوش مصنوعی برایتان پیام تولید کند' : 'Type a topic to generate AI messages'}
              </p>
            )}
          </div>
        ) : (
          filteredMessages.map(msg => (
            <MessageCard 
              key={msg.id || msg.code} 
              msg={msg} 
              onClick={onSelectMessage} 
              onShare={handleShareMessage}
              onLike={handleMessageLike}
            />
          ))
        )}
      </div>
    </div>
  );
};