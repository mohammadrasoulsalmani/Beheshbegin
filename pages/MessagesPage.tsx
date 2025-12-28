
import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../hooks/useAppState';
import { MessageList } from '../components/messages/MessageList';
// Fix: Import Message type
import { Message } from '../types';

export const MessagesPage: React.FC = () => {
  const { state, setState } = useAppState();
  const { lang, selectedEmotion } = state;
  const isRtl = lang !== 'en';

  if (!selectedEmotion) {
    // Redirect to emotion selection if no emotion is selected
    setState(s => ({...s, step: 'EMOTION'}));
    return null;
  }

  const handleSelectMessage = (msg: Message) => {
    setState(prev => ({ ...prev, selectedMessage: msg, step: 'RECIPIENT' }));
  };

  const handleBackToEmotions = () => {
    setState(s => ({...s, step: 'EMOTION'}));
  };

  return (
    <motion.div key="message" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full max-h-[85vh]">
      <MessageList
        selectedEmotion={selectedEmotion}
        onSelectMessage={handleSelectMessage}
        onBack={handleBackToEmotions}
      />
    </motion.div>
  );
};
