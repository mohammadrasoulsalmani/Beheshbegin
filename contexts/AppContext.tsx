
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { AppState, AppStep, EmotionType, Message, Language } from '../types';

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  reset: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    step: 'LANDING',
    selectedEmotion: null,
    selectedMessage: null,
    phoneNumber: '',
    recipientNumber: '',
    customSenderName: '',
    isLoggedIn: false,
    theme: 'light',
    lang: 'fa',
    sharingMessage: null,
  });

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      step: 'LANDING',
      selectedEmotion: null,
      selectedMessage: null,
      phoneNumber: '',
      recipientNumber: '',
      customSenderName: '',
      isLoggedIn: false,
      sharingMessage: null,
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const value = { state, setState, reset, toggleTheme };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext };
