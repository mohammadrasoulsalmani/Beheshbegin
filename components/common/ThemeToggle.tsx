
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';

export const ThemeToggle: React.FC = () => {
  const { state, toggleTheme } = useAppState();
  const { theme } = state;
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className={`p-1.5 md:p-2 rounded-full border transition-all ${
        isLight ? 'bg-zinc-50 border-zinc-100 text-zinc-600 hover:bg-zinc-100 shadow-sm' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
      }`}
    >
      {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
};
