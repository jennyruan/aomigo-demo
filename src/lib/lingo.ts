const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY || '';

export type Locale = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const FALLBACK_TRANSLATIONS: Translations = {
  'app.title': { en: 'Aomigo', zh: 'Aomigo' },
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.teach': { en: 'Teach', zh: '教学' },
  'nav.summary': { en: 'Summary', zh: '总结' },
  'nav.community': { en: 'Community', zh: '社区' },
  'nav.reviews': { en: 'Reviews', zh: '复习' },
  'nav.settings': { en: 'Settings', zh: '设置' },

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
  'teach.processing': { en: 'Processing...', zh: '处理中...' },

  'review.title': { en: 'Review Time!', zh: '复习时间！' },
  'review.submit': { en: 'Submit Answer', zh: '提交答案' },
  'review.noReviews': { en: 'No reviews due!', zh: '没有需要复习的！' },
  'review.great': { en: 'Great job!', zh: '做得好！' },

  'community.title': { en: 'Community Feed', zh: '社区动态' },
  'community.postDaily': { en: 'Post Daily Card', zh: '发布每日卡片' },
  'community.loading': { en: 'Loading...', zh: '加载中...' },

  'summary.title': { en: 'Your Knowledge', zh: '你的知识' },
  'summary.totalTopics': { en: 'Total Topics', zh: '总话题数' },
  'summary.mastered': { en: 'Mastered', zh: '已掌握' },
  'summary.needReview': { en: 'Need Review', zh: '需要复习' },
  'summary.recentSessions': { en: 'Recent Sessions', zh: '最近的学习' },
  'summary.knowledgeMap': { en: 'Knowledge Map', zh: '知识地图' },

  'pet.intelligence': { en: 'Intelligence', zh: '智力' },
  'pet.health': { en: 'Health', zh: '健康' },
  'pet.level': { en: 'Level', zh: '等级' },
  'pet.mood.sleepy': { en: 'Sleepy', zh: '困倦' },
  'pet.mood.happy': { en: 'Happy', zh: '开心' },
  'pet.mood.excited': { en: 'Excited', zh: '兴奋' },
  'pet.mood.energized': { en: 'Energized', zh: '充满活力' },

  'auth.login': { en: 'Login', zh: '登录' },
  'auth.signup': { en: 'Sign Up', zh: '注册' },
  'auth.demoMode': { en: 'Continue as Demo User', zh: '以演示用户身份继续' },
  'auth.email': { en: 'Email', zh: '电子邮箱' },
  'auth.password': { en: 'Password', zh: '密码' },
  'auth.signOut': { en: 'Sign Out', zh: '登出' },
  'auth.magicLink': { en: 'Sign in with magic link', zh: '使用魔法链接登录' },

  'actions.send': { en: 'Send', zh: '发送' },
  'actions.save': { en: 'Save', zh: '保存' },
  'actions.cancel': { en: 'Cancel', zh: '取消' },
  'actions.delete': { en: 'Delete', zh: '删除' },
  'actions.edit': { en: 'Edit', zh: '编辑' },
  'actions.close': { en: 'Close', zh: '关闭' },
  'actions.confirm': { en: 'Confirm', zh: '确认' },

  'status.success': { en: 'Success!', zh: '成功！' },
  'status.error': { en: 'Error', zh: '错误' },
  'status.loading': { en: 'Loading...', zh: '加载中...' },
  'status.saved': { en: 'Saved', zh: '已保存' },

  'settings.title': { en: 'Settings', zh: '设置' },
  'settings.apiStatus': { en: 'API Integration Status', zh: 'API集成状态' },
  'settings.connected': { en: 'Connected', zh: '已连接' },
  'settings.demoMode': { en: 'Demo Mode', zh: '演示模式' },
  'settings.localStorage': { en: 'Using localStorage', zh: '使用本地存储' },
  'settings.fallback': { en: 'Using fallback dictionary', zh: '使用备用字典' },
  'settings.simulated': { en: 'Simulated mode', zh: '模拟模式' },
  'settings.testConnection': { en: 'Test Connection', zh: '测试连接' },
  'settings.lastSync': { en: 'Last sync', zh: '最后同步' },
};

class LingoClient {
  private apiKey: string;
  private useFallback: boolean;
  private cache: Map<string, Translations>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || LINGO_API_KEY;
    this.useFallback = !this.apiKey;
    this.cache = new Map();

    if (this.useFallback) {
      console.log('[Lingo.dev] No API key provided, using fallback dictionary');
    } else {
      console.log('[Lingo.dev] Initialized with API key');
    }
  }

  async translate(key: string, locale: Locale): Promise<string> {
    if (this.useFallback || !this.apiKey) {
      return this.getFallbackTranslation(key, locale);
    }

    try {
      if (this.cache.has(key)) {
        const cached = this.cache.get(key)!;
        return cached[locale] || cached.en;
      }

      const response = await fetch('https://api.lingo.dev/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          key,
          locales: ['en', 'zh'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Lingo API error: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(key, data.translations);

      return data.translations[locale] || data.translations.en;
    } catch (error) {
      console.error('[Lingo] API error, falling back to dictionary:', error);
      return this.getFallbackTranslation(key, locale);
    }
  }

  private getFallbackTranslation(key: string, locale: Locale): string {
    const translation = FALLBACK_TRANSLATIONS[key];
    if (!translation) {
      console.warn(`[Lingo] Translation missing for key: ${key}`);
      return key;
    }
    return translation[locale] || translation.en;
  }

  t(key: string, locale: Locale = 'en'): string {
    return this.getFallbackTranslation(key, locale);
  }
}

export const lingoClient = new LingoClient();

export function t(key: string, locale: Locale = 'en'): string {
  return lingoClient.t(key, locale);
}

export function getCurrentLocale(): Locale {
  const stored = localStorage.getItem('aomigo_locale');
  return (stored === 'zh' ? 'zh' : 'en') as Locale;
}

export function setLocale(locale: Locale): void {
  localStorage.setItem('aomigo_locale', locale);
  window.location.reload();
}
