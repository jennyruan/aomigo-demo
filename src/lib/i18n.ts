type Locale = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const translations: Translations = {
  'app.title': { en: 'Aomigo', zh: 'Aomigo' },
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.teach': { en: 'Teach', zh: '教学' },
  'nav.summary': { en: 'Summary', zh: '总结' },
  'nav.community': { en: 'Community', zh: '社区' },
  'nav.reviews': { en: 'Reviews', zh: '复习' },
  'home.welcome': { en: 'Welcome back! Ready to learn?', zh: '欢迎回来！准备学习了吗？' },
  'home.teachButton': { en: 'Share what you learned today', zh: '分享你今天学到的东西' },
  'home.summaryButton': { en: 'View your knowledge map', zh: '查看你的知识地图' },
  'home.communityButton': { en: 'See what others are learning', zh: '看看别人在学什么' },
  'home.reviewsButton': { en: 'Reviews', zh: '复习' },
  'home.dayStreak': { en: 'Day Streak', zh: '连续天数' },
  'home.level': { en: 'Level', zh: '等级' },
  'teach.title': { en: 'Teach Aomigo', zh: '教Aomigo' },
  'teach.placeholder': { en: 'Today I learned about...', zh: '今天我学到了...' },
  'teach.submit': { en: 'Teach', zh: '提交' },
  'teach.voiceButton': { en: 'Voice Input', zh: '语音输入' },
  'teach.imageButton': { en: 'Upload Photo', zh: '上传照片' },
  'review.title': { en: 'Review Time!', zh: '复习时间！' },
  'review.submit': { en: 'Submit Answer', zh: '提交答案' },
  'community.title': { en: 'Community Feed', zh: '社区动态' },
  'community.postDaily': { en: 'Post Daily Card', zh: '发布每日卡片' },
  'summary.title': { en: 'Your Knowledge', zh: '你的知识' },
  'summary.totalTopics': { en: 'Total Topics', zh: '总话题数' },
  'summary.mastered': { en: 'Mastered', zh: '已掌握' },
  'summary.needReview': { en: 'Need Review', zh: '需要复习' },
  'pet.intelligence': { en: 'Intelligence', zh: '智力' },
  'pet.health': { en: 'Health', zh: '健康' },
  'auth.login': { en: 'Login', zh: '登录' },
  'auth.signup': { en: 'Sign Up', zh: '注册' },
  'auth.demoMode': { en: 'Continue as Demo User', zh: '以演示用户身份继续' },
};

export function t(key: string, locale: Locale = 'en'): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  return translation[locale] || translation.en;
}

export function getCurrentLocale(): Locale {
  const stored = localStorage.getItem('aomigo_locale');
  return (stored === 'zh' ? 'zh' : 'en') as Locale;
}

export function setLocale(locale: Locale): void {
  localStorage.setItem('aomigo_locale', locale);
  window.location.reload();
}
