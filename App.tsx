
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppState } from './hooks/useAppState';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { EmotionsPage } from './pages/EmotionsPage';
import { MessagesPage } from './pages/MessagesPage';
import { RecipientPage } from './pages/RecipientPage';
import { PaymentPage } from './pages/PaymentPage';
import { SuccessPage } from './pages/SuccessPage';
import { DailyMessagesPage } from './pages/DailyMessagesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { ShareModal } from './components/messages/ShareModal';

const App: React.FC = () => {
  const { state, setState, reset, toggleTheme } = useAppState();
  const { step, lang, theme, sharingMessage } = state;
  const isLight = theme === 'light';
  const isRtl = lang !== 'en';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`min-h-screen transition-colors duration-500 flex flex-col relative font-main overflow-x-hidden ${ // Applied font-main here
        isLight ? 'bg-[#fcfcff] text-zinc-900' : 'bg-[#050505] text-zinc-100'
      }`}
    >
      <Navbar onHome={reset} />

      <AnimatePresence>
        {sharingMessage && (
          <ShareModal message={sharingMessage} onClose={() => setState(s => ({...s, sharingMessage: null}))} />
        )}
      </AnimatePresence>

      <main className="flex-grow w-full max-w-5xl mx-auto px-4 md:px-6 pt-24 md:pt-36 pb-12 z-10 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {step === 'LANDING' && <LandingPage key="landing" />}
          {step === 'AUTH' && <AuthPage key="auth" />}
          {step === 'EMOTION' && <EmotionsPage key="emotion" />}
          {step === 'MESSAGE' && <MessagesPage key="message" />}
          {step === 'RECIPIENT' && <RecipientPage key="recipient" />}
          {step === 'PAYMENT' && <PaymentPage key="payment" />}
          {step === 'SUCCESS' && <SuccessPage key="success" />}
          {step === 'DAILY_MESSAGES' && <DailyMessagesPage key="daily" />}
          {step === 'ABOUT' && <AboutPage key="about" />}
          {step === 'CONTACT' && <ContactPage key="contact" />}
          {step === 'BLOG' && <BlogPage key="blog" />}
        </AnimatePresence>
      </main>

      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isLight ? '#d4d4d8' : '#27272a'}; border-radius: 20px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .text-shadow-glow { text-shadow: 0 0 40px rgba(99, 102, 241, 0.4); }
        /* Removed font-title here, as it's defined in index.html, preventing conflict. */
        body { transition: background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1); background-color: ${isLight ? '#fdfdff' : '#050505'}; }
        ::selection { background: #4f46e5; color: white; }
        @media (max-width: 480px) {
          .font-title { letter-spacing: -0.01em; }
        }
      `}</style>
    </div>
  );
};

export default App;
