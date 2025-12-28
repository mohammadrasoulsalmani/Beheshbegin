
import { EmotionType, EmotionMeta, Message, MessageSource, LocalizedString, BlogArticle } from './types';

export const EMOTIONS: EmotionMeta[] = [
  {
    type: EmotionType.SADNESS,
    label: { fa: 'غم', en: 'Sadness', ar: 'حزن' },
    color: 'from-blue-600 to-indigo-800',
    accent: '#3b82f6',
    description: {
      fa: 'زمانی که بار غصه‌ها سنگین است.',
      en: 'When the weight of sorrow is heavy.',
      ar: 'عندما يكون عبء الحزن ثقيلاً.'
    }
  },
  {
    type: EmotionType.FEAR,
    label: { fa: 'ترس', en: 'Fear', ar: 'خوف' },
    color: 'from-purple-600 to-indigo-900',
    accent: '#a855f7',
    description: {
      fa: 'وقتی اضطراب فرداها امان نمی‌دهد.',
      en: 'When anxiety about tomorrow is overwhelming.',
      ar: 'عندما يكون القلق بشأن الغد ساحقاً.'
    }
  },
  {
    type: EmotionType.ANGER,
    label: { fa: 'خشم', en: 'Anger', ar: 'غضب' },
    color: 'from-red-600 to-orange-800',
    accent: '#ef4444',
    description: {
      fa: 'زمانی که آتش درونی نیاز به سرد شدن دارد.',
      en: 'When the inner fire needs cooling.',
      ar: 'عندما يحتاج الغضب الداخلي إلى التبريد.'
    }
  },
  {
    type: EmotionType.LONELINESS,
    label: { fa: 'تنهایی', en: 'Loneliness', ar: 'وحدة' },
    color: 'from-slate-600 to-slate-800',
    accent: '#94a3b8',
    description: {
      fa: 'برای دیدنِ کسی که در انزوای خویش است.',
      en: 'For seeing someone in their isolation.',
      ar: 'لرؤية شخص في عزلته.'
    }
  },
  {
    type: EmotionType.HOPELESSNESS,
    label: { fa: 'ناامیدی', en: 'Despair', ar: 'يأس' },
    color: 'from-zinc-700 to-black',
    accent: '#52525b',
    description: {
      fa: 'وقتی تمام راه‌ها به بن‌بست رسیده است.',
      en: 'When all roads seem to lead to a dead end.',
      ar: 'عندما تبدو كل الطرق مسدودة.'
    }
  },
  {
    type: EmotionType.PEACE,
    label: { fa: 'امید و بهش بگینش', en: 'Hope & Peace', ar: 'أمل وسلام' },
    color: 'from-emerald-600 to-teal-800',
    accent: '#10b981',
    description: {
      fa: 'جشنی برای نور و بازگشت به زندگی.',
      en: 'A celebration for light and return to life.',
      ar: 'احتفال بالنور والعودة إلى الحياة.'
    }
  }
];

export const MESSAGES: Message[] = [
  {
    id: 's1',
    emotion: EmotionType.SADNESS,
    source: MessageSource.QURAN,
    sourceLabel: { fa: 'قرآن کریم', en: 'Holy Quran', ar: 'القرآن الكريم' },
    reference: { fa: 'بقره، ۱۵۵', en: 'Al-Baqarah, 155', ar: 'البقرة، ١٥٥' },
    likes: 124,
    usageCount: 850,
    text: {
      fa: 'پس از هر دشواری، آسانی است. صبور باش که وعده حق نزدیک است.',
      en: 'For indeed, with hardship [will be] ease. Be patient, for the promise of Allah is truth.',
      ar: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا. اصبر فإن وعد الله حق.'
    }
  },
  {
    id: 's2',
    emotion: EmotionType.SADNESS,
    source: MessageSource.NAHJ_AL_BALAGHA,
    sourceLabel: { fa: 'نهج‌البلاغه', en: 'Nahj al-Balagha', ar: 'نهج البلاغة' },
    reference: { fa: 'حکمت ۷۷', en: 'Wisdom 77', ar: 'حكمة ٧٧' },
    likes: 89,
    usageCount: 420,
    text: {
      fa: 'اندوه، نیمی از پیری است؛ پس مگذار قلبت پیش از موعد فرسوده شود.',
      en: 'Grief is half of old age; do not let your heart wither before its time.',
      ar: 'الهم نصف الهرم. فلا تدع قلبك يذبل قبل أوانه.'
    }
  },
  {
    id: 'p1',
    emotion: EmotionType.PEACE,
    source: MessageSource.QURAN,
    sourceLabel: { fa: 'قرآن کریم', en: 'Holy Quran', ar: 'القرآن الكريم' },
    reference: { fa: 'رعد، ۲۸', en: 'Ar-Ra\'d, 28', ar: 'الرعد، ٢٨' },
    likes: 980,
    usageCount: 9200,
    text: {
      fa: 'آگاه باشید که تنها با یاد خدا، دل‌ها بهش بگین می‌گیرند.',
      en: 'Unquestionably, by the remembrance of Allah hearts are assured.',
      ar: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ.'
    }
  },
  {
    id: 'l1',
    emotion: EmotionType.LONELINESS,
    source: MessageSource.LITERATURE,
    sourceLabel: { fa: 'ادبیات فارسی', en: 'Persian Literature', ar: 'الأدب الفارسي' },
    reference: { fa: 'رومی', en: 'Rumi', ar: 'جلال الدين الرومي' },
    likes: 670,
    usageCount: 5200,
    text: {
      fa: 'تو یک اقیانوس در یک قطره هستی. هرگز تنها نیستی.',
      en: 'You are not a drop in the ocean. You are the entire ocean in a drop.',
      ar: 'أنت لست قطرة في المحيط. أنت المحيط بأكمله في قطرة.'
    }
  },
  {
    id: 'f1',
    emotion: EmotionType.FEAR,
    source: MessageSource.ENERGY,
    sourceLabel: { fa: 'جملات بهش بگینش‌بخش', en: 'Healing Words', ar: 'كلمات شافية' },
    likes: 310,
    usageCount: 1500,
    text: {
      fa: 'ترس فقط یک وهم است، بگذار نور حقیقت آن را ذوب کند.',
      en: 'Fear is but an illusion; let the light of truth melt it away.',
      ar: 'الخوف مجرد وهم؛ دع نور الحقيقة يذيبه.'
    }
  }
];

export const DAILY_SOURCES = [
  { id: MessageSource.QURAN, label: { fa: 'قرآن کریم', en: 'Holy Quran', ar: 'القرآن الكريم' }, icon: '📖' },
  { id: MessageSource.NAHJ_AL_BALAGHA, label: { fa: 'نهج‌البلاغه', en: 'Nahj al-Balagha', ar: 'نهج البلاغة' }, icon: '⚔️' },
  { id: MessageSource.SHAHNAMEH, label: { fa: 'شاهنامه فردوسی', en: 'Shahnameh', ar: 'شاهنامة' }, icon: '🤴' },
  { id: MessageSource.ATTAR, label: { fa: 'منطق‌الطیر عطار', en: 'Attar', ar: 'عطار' }, icon: '🕊️' },
  { id: MessageSource.BUDDHISM, label: { fa: 'آموزه‌های بودا', en: 'Buddha Teachings', ar: 'تعاليم بودا' }, icon: '🧘' }
];

export const BLOG_ARTICLES: BlogArticle[] = [
  { title: 'چگونه پیام‌های ناشناس بر سلامت روان تاثیر می‌گذارند؟', tag: 'روانشناسی', date: '۱۴ آذر ۱۴۰۳' },
  { title: 'حکمت صبوری در اشعار عطار نیشابوری', tag: 'ادبیات', date: '۱۲ آذر ۱۴۰۳' },
  { title: 'بهش بگینش در دنیای دیجیتال؛ راهکارهای نوین', tag: 'تکنولوژی', date: '۱۰ آذر ۱۴۰۳' },
  { title: 'چرا نهج‌البلاغه برای امروز ما حیاتی است؟', tag: 'حکمت', date: '۸ آذر ۱۴۰۳' },
  { title: 'قدرت بخشش: مسیری به سوی صلح درونی', tag: 'اخلاق', date: '۵ آذر ۱۴۰۳' },
  { title: 'نقش کلمات در تغییر مسیر زندگی انسان', tag: 'اجتماعی', date: '۲ آذر ۱۴۰۳' }
];

// Refactored TRANSLATIONS object to map translation keys directly to LocalizedString objects
export const TRANSLATIONS: { [key: string]: LocalizedString } = {
  heroTitleTop: {
    fa: 'فرصتی برای',
    en: 'A Chance for',
    ar: 'فرصة لـ',
  },
  heroTitleBottom: {
    fa: 'بهش بگینش یک قلب',
    en: 'A Heart\'s Peace',
    ar: 'راحة القلب',
  },
  heroDesc: {
    fa: 'پیام‌های ناشناس هدفمند که بر پایه متون عمیق انسانی و روانشناسی بنا شده‌اند.',
    en: 'Targeted anonymous messages based on profound human texts and psychology.',
    ar: 'رسائل مجهولة هادفة مبنية على نصوص إنسانية عميقة وعلم النفس.',
  },
  cta: {
    fa: 'ارسال پیام بهش بگینش‌بخش',
    en: 'Send a Peaceful Message',
    ar: 'أرسل رسالة سلام',
  },
  changeEmotion: {
    fa: 'تغییر حس انتخابی',
    en: 'Change Emotion',
    ar: 'تغيير الشعور',
  },
  selectMessage: {
    fa: 'انتخاب پیام',
    en: 'Select Message',
    ar: 'اختر الرسالة',
  },
  aiTab: {
    fa: 'کشف با هوش مصنوعی',
    en: 'AI Discovery',
    ar: 'اكتشاف الذكاء الاصطناعي',
  },
  aiPlaceholder: {
    fa: 'مثلاً: آیه صبوری یا جمله‌ای از مولانا...',
    en: 'e.g. A verse about patience or a Rumi quote...',
    ar: 'مثلاً: آية عن الصبر أو قول لمولانا جلال الدين الرومي...',
  },
  aiFinding: {
    fa: 'در حال جستجو در میان حکیمان...',
    en: 'Searching through wisdom...',
    ar: 'جاري البحث في الحكمة...',
  },
  back: {
    fa: 'بازگشت',
    en: 'Back',
    ar: 'رجوع',
  },
  recipient: {
    fa: 'گیرنده',
    en: 'Recipient',
    ar: 'المستلم',
  },
  phoneNumber: {
    fa: 'شماره همراه شما',
    en: 'Your Mobile Number',
    ar: 'رقم جوالك',
  },
  recipientNumber: {
    fa: 'شماره همراه گیرنده',
    en: 'Recipient Number',
    ar: 'رقم جوال المستلم',
  },
  confirm: {
    fa: 'تایید و پیش‌نمایش',
    en: 'Confirm & Preview',
    ar: 'تأكيد ومعاينة',
  },
  payment: {
    fa: 'پرداخت',
    en: 'Payment',
    ar: 'دفع',
  },
  success: {
    fa: 'ارسال شد',
    en: 'Sent Successfully',
    ar: 'تم الإرسال',
  },
  history: {
    fa: 'تاریخچه',
    en: 'History',
    ar: 'تاريخ',
  },
  privacy: {
    fa: 'حریم خصوصی',
    en: 'Privacy',
    ar: 'خصوصية',
  },
  terms: {
    fa: 'قوانین',
    en: 'Terms',
    ar: 'شروط',
  },
  usage: {
    fa: 'استفاده',
    en: 'Uses',
    ar: 'استخدام',
  },
  likes: {
    fa: 'پسند',
    en: 'Likes',
    ar: 'إعجاب',
  },
  billDetails: {
    fa: 'جزئیات فاکتور',
    en: 'Bill Details',
    ar: 'تفاصيل الفاتورة',
  },
  totalPrice: {
    fa: '۹,۰۰۰ تومان',
    en: '9,000 Toman',
    ar: '٩,٠٠٠ تومان',
  },
  payButton: {
    fa: 'تایید و پرداخت آنلاین',
    en: 'Confirm & Pay Online',
    ar: 'تأكيد والدفع عبر الإنترنت',
  },
  aiSearchBtn: {
    fa: 'جستجو',
    en: 'Search',
    ar: 'بحث',
  },
  emotionTitle: {
    fa: 'وضعیت قلب گیرنده را انتخاب کنید',
    en: 'Select the state of the heart',
    ar: 'اختر حالة القلب',
  },
  previewLabel: {
    fa: 'پیش‌نمایش پیامک',
    en: 'SMS Preview',
    ar: 'معاينة الرسالة',
  },
  blog: {
    fa: 'وبلاگ',
    en: 'Blog',
    ar: 'مدونة',
  },
  about: {
    fa: 'درباره ما',
    en: 'About Us',
    ar: 'من نحن',
  },
  contact: {
    fa: 'ارتباط با ما',
    en: 'Contact Us',
    ar: 'اتصل بنا',
  },
  authTitle: {
    fa: 'ورود به بهش بگین',
    en: 'Login to Aram',
    ar: 'تسجيل الدخول',
  },
  authDesc: {
    fa: 'لطفاً برای شروع، شماره موبایل خود را وارد کنید.',
    en: 'Please enter your mobile number to get started.',
    ar: 'الرجاء إدخال رقم هاتفك المحمول للبدء.',
  },
  verify: {
    fa: 'دریافت کد تایید',
    en: 'Verify Number',
    ar: 'تأكيد الرقم',
  },
  dailyMessages: {
    fa: 'ارسال پیام‌های روزانه',
    en: 'Daily Messages',
    ar: 'الرسائل اليومية',
  },
  dailyTitle: {
    fa: 'سرویس پیام روزانه',
    en: 'Daily Wisdom Service',
    ar: 'خدمة الحكمة اليومية',
  },
  dailyDesc: {
    fa: 'هر روز صبح، یک پیام بهش بگینش‌بخش از منابع انتخابی خود دریافت کنید.',
    en: 'Receive a peaceful message from your selected sources every morning.',
    ar: 'احصل على رسالة سلام من مصادرك المختارة كل صباح.',
  },
  selectSources: {
    fa: 'انتخاب منابع الهام',
    en: 'Select Inspiration Sources',
    ar: 'اختر مصادر الإلهام',
  },
  dailyPrice: {
    fa: '۱۸۰,۰۰۰ تومان',
    en: '180,000 Toman',
    ar: '١٨٠,٠٠٠ تومان',
  },
  subscribe: {
    fa: 'اشتراک سالانه',
    en: 'Annual Subscription',
    ar: 'اشتراك سنوي',
  },
  contactTitle: {
    fa: 'با ما در ارتباط باشید',
    en: 'Get in Touch',
    ar: 'اتصل بنا',
  },
  contactDesc: {
    fa: 'نظرات و پیشنهادات شما، مسیر ما را روشن می‌کند.',
    en: 'Your feedback lights our path forward.',
    ar: 'ملاحظاتك تنير طريقنا.',
  },
  aboutTitle: {
    fa: 'داستان بهش بگین',
    en: 'The Story of Aram',
    ar: 'قصة بهش بگین',
  },
  aboutDesc: {
    fa: 'بهش بگین فراتر از یک اپلیکیشن، یک جنبش برای بازگشت به انسانیت و بهش بگینش در دنیای شلوغ امروز است.',
    en: 'Aram is more than an app; it is a movement to return to humanity and peace in today\'s loud world.',
    ar: 'بهش بگین أكثر من مجرد تطبيق، إنها حركة للعودة إلى الإنسانية والسكينة.',
  },
  blogTitle: {
    fa: 'وبلاگ بهش بگینش',
    en: 'Peace Blog',
    ar: 'مدونة السكينة',
  },
  blogDesc: {
    fa: 'خواندنی‌هایی برای ذهن و روح',
    en: 'Readings for the mind and soul',
    ar: 'قراءات للعقل والروح',
  },
  customSenderIntro: { // Changed from customMessageIntro
    fa: 'نام فرستنده (اختیاری):', // Updated text for clarity
    en: 'Sender Name (Optional):', // Updated text for clarity
    ar: 'اسم المرسل (اختياري):', // Updated text for clarity
  },
  customSenderPlaceholder: {
    fa: 'مثلاً: از طرف م.م یا دوستت',
    en: 'e.g. From M.M. or Your friend',
    ar: 'مثلاً: من م.م أو صديقك',
  },
  empathyStep: {
    fa: 'درک حس طرف مقابل، اولین قدم برای بهش بگینش است.',
    en: 'Empathy is the first step toward peace.',
    ar: 'فهم شعور الطرف الآخر، هو الخطوة الأولى نحو السلام.',
  },
  aramAnalysis: {
    fa: 'تحلیل بهش بگین',
    en: 'Aram Analysis',
    ar: 'تحليل بهش بگین',
  },
  fetchingInsight: {
    fa: 'در حال دریافت بینش...',
    en: 'Fetching insight...',
    ar: 'جاري جلب الرؤى...',
  },
  totalAmount: {
    fa: 'مبلغ نهایی:',
    en: 'Total:',
    ar: 'المبلغ الإجمالي:',
  },
  securePayment: {
    fa: 'پرداخت امن زرین‌پال',
    en: 'Secure payment by ZarinPal',
    ar: 'دفع آمن بواسطة زرين بال',
  },
  privacyProtection: {
    fa: 'حفظ حریم خصوصی',
    en: 'Privacy Protection',
    ar: 'حماية الخصوصية',
  },
  messageQueue: {
    fa: 'پیام شما در صف ارسال قرار گرفت. امروز دلی را شاد کردید.',
    en: 'Your message has been queued. You\'ve brightened a heart today.',
    ar: 'رسالتك في قائمة الانتظار. لقد أسعدت قلباً اليوم.',
  },
  goHome: {
    fa: 'بازگشت',
    en: 'Go Home',
    ar: 'العودة إلى الصفحة الرئيسية',
  },
  contactNamePlaceholder: {
    fa: 'نام و نام خانوادگی',
    en: 'Full Name',
    ar: 'الاسم الكامل',
  },
  contactEmailPhonePlaceholder: {
    fa: 'ایمیل یا شماره موبایل',
    en: 'Email or Mobile Number',
    ar: 'البريد الإلكتروني أو رقم الجوال',
  },
  contactMessagePlaceholder: {
    fa: 'پیام شما...',
    en: 'Your Message...',
    ar: 'رسالتك...',
  },
  sendContactMessage: {
    fa: 'ارسال پیام',
    en: 'Send Message',
    ar: 'إرسال الرسالة',
  },
  aboutFeature1Title: {
    fa: 'اصالت',
    en: 'Authenticity',
    ar: 'الأصالة',
  },
  aboutFeature1Desc: {
    fa: 'استخراج حکمت از متون باستانی برای انسان مدرن.',
    en: 'Extracting wisdom from ancient texts for modern humans.',
    ar: 'استخراج الحكمة من النصوص القديمة للإنسان الحديث.',
  },
  aboutFeature1Icon: {
    fa: '📜',
    en: '📜',
    ar: '📜',
  },
  aboutFeature2Title: {
    fa: 'ناشناسی',
    en: 'Anonymity',
    ar: 'عدم الكشف عن الهوية',
  },
  aboutFeature2Desc: {
    fa: 'ارتباطی فراتر از نام‌ها و قضاوت‌ها.',
    en: 'A connection beyond names and judgments.',
    ar: 'اتصال يتجاوز الأسماء والأحكام.',
  },
  aboutFeature2Icon: {
    fa: '🎭',
    en: '🎭',
    ar: '🎭',
  },
  aboutFeature3Title: {
    fa: 'بهش بگینش',
    en: 'Peace',
    ar: 'السكينة',
  },
  aboutFeature3Desc: {
    fa: 'ساختن دنیایی که در آن هر پیام، یک هدیه است.',
    en: 'Building a world where every message is a gift.',
    ar: 'بناء عالم تكون فيه كل رسالة هدية.',
  },
  aboutFeature3Icon: {
    fa: '🌬️',
    en: '🌬️',
    ar: '🌬️',
  },
  textShareStyle: { // New translation key
    fa: 'ساده',
    en: 'Simple',
    ar: 'بسيط',
  },
  cardShareStyle: { // New translation key
    fa: 'کارت بهش بگین',
    en: 'Aram Card',
    ar: 'بطاقة بهش بگین',
  },
};
