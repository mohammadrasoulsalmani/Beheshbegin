
export enum EmotionType {
  SADNESS = 'SADNESS',
  FEAR = 'FEAR',
  ANGER = 'ANGER',
  LONELINESS = 'LONELINESS',
  HOPELESSNESS = 'HOPELESSNESS',
  PEACE = 'PEACE',
}

export enum MessageSource {
  QURAN = 'QURAN',
  NAHJ_AL_BALAGHA = 'NAHJ_AL_BALAGHA',
  LITERATURE = 'LITERATURE',
  ENERGY = 'ENERGY',
  AI = 'AI',
  SHAHNAMEH = 'SHAHNAMEH',
  ATTAR = 'ATTAR',
  BUDDHISM = 'BUDDHISM',
}

export type Language = 'fa' | 'en' | 'ar';

export interface LocalizedString {
  fa: string;
  en: string;
  ar: string;
}

export interface EmotionMeta {
  type: EmotionType;
  label: LocalizedString;
  color: string;
  accent: string;
  description: LocalizedString;
}

export interface Message {
  id: string;
  emotion: EmotionType;
  source: MessageSource;
  sourceLabel: LocalizedString;
  reference?: LocalizedString;
  likes: number;
  usageCount: number;
  text: LocalizedString;
}

export type AppStep =
  | 'LANDING'
  | 'AUTH'
  | 'EMOTION'
  | 'MESSAGE'
  | 'RECIPIENT'
  | 'PAYMENT'
  | 'SUCCESS'
  | 'DAILY_MESSAGES'
  | 'ABOUT'
  | 'CONTACT'
  | 'BLOG';

export interface AppState {
  step: AppStep;
  selectedEmotion: EmotionType | null;
  selectedMessage: Message | null;
  phoneNumber: string;
  recipientNumber: string;
  customSenderName: string; // New field for custom sender name
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
  lang: Language;
  sharingMessage: Message | null;
}

export interface BlogArticle {
  title: string;
  tag: string;
  date: string;
}
