
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TRANSLATIONS, BLOG_ARTICLES } from '../constants';
import { Button } from '../components/common/Button';

export const BlogPage: React.FC = () => {
  const { state, reset } = useAppState();
  const { lang, theme } = state;
  const isLight = theme === 'light';
  // Fix: Use a function for 't' to access translations correctly
  const t = (key: keyof typeof TRANSLATIONS) => TRANSLATIONS[key][lang];
  const isRtl = lang !== 'en';

  return (
     <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto w-full my-auto space-y-16 py-12">
        <div className="text-center space-y-6">
           <h2 className="font-title text-6xl md:text-8xl">{t('blogTitle')}</h2>
           <p className="text-xl md:text-2xl opacity-60 font-medium font-main">{t('blogDesc')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {BLOG_ARTICLES.map((post, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className={`p-8 rounded-[2.5rem] border space-y-6 cursor-pointer group ${isLight ? 'bg-white border-indigo-50 shadow-xl' : 'bg-white/5 border-white/5 shadow-2xl'}`}>
                 <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-600/10 w-fit px-3 py-1 rounded-full font-main">{post.tag}</div>
                 <h3 className="font-title text-2xl leading-relaxed group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                 <div className="pt-4 border-t border-black/5 dark:border-white/5 flex justify-between items-center opacity-40 text-[10px] font-bold font-main">
                    <span>{post.date}</span>
                    <ArrowLeft className="w-4 h-4" />
                 </div>
              </motion.div>
           ))}
        </div>
        <div className="text-center">
           <Button variant="ghost" onClick={reset}>
             {t('back')}
           </Button>
        </div>
     </motion.div>
  );
};
