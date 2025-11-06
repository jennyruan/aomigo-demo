const LINGO_API_KEY = import.meta.env.VITE_LINGO_API_KEY || '';

export type Locale = 'en' | 'zh';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const FALLBACK_TRANSLATIONS: Translations = {
  'app.title': { en: 'AOMIGO', zh: 'AOMIGO' },
  'nav.home': { en: '🏠 Home', zh: '🏠 首页' },
  'nav.teach': { en: '📚 Teach', zh: '📚 教学' },
  'nav.summary': { en: '🗺️ Summary', zh: '🗺️ 总结' },
  'nav.community': { en: '👥 Community', zh: '👥 社区' },
  'nav.reviews': { en: '⏰ Reviews', zh: '⏰ 复习' },
  'nav.settings': { en: '⚙️ Settings', zh: '⚙️ 设置' },

  'home.welcome': { en: 'Ready to teach me something cool?', zh: '准备教我一些酷炫的东西吗？' },
  'home.teachButton': { en: 'Tell me what you learned!', zh: '告诉我你学到了什么！' },
  'home.summaryButton': { en: 'See your brain map!', zh: '查看你的大脑地图！' },
  'home.communityButton': { en: 'See what friends are learning!', zh: '看看朋友们在学什么！' },
  'home.reviewsButton': { en: 'Practice what you learned!', zh: '复习你学过的！' },
  'home.dayStreak': { en: '🔥 Daily Streak', zh: '🔥 连续天数' },
  'home.level': { en: '⭐ Level', zh: '⭐ 等级' },

  'teach.title': { en: 'Teach Your Pet! 🐾', zh: '教你的宠物！🐾' },
  'teach.placeholder': { en: 'I learned something cool! It\'s about...', zh: '我学到了很酷的东西！关于...' },
  'teach.submit': { en: 'Send! 🚀', zh: '发送！🚀' },
  'teach.voiceButton': { en: '🎤 Say It', zh: '🎤 说出来' },
  'teach.imageButton': { en: '📸 Show It', zh: '📸 拍照' },
  'teach.textButton': { en: '✏️ Type It', zh: '✏️ 打字' },
  'teach.processing': { en: 'Getting ready...', zh: '准备中...' },

  'review.title': { en: 'Practice Time! 🎯', zh: '练习时间！🎯' },
  'review.submit': { en: 'Send! 🚀', zh: '发送！🚀' },
  'review.noReviews': { en: 'You remembered everything! Come back later! 🎉', zh: '你记住了所有东西！稍后再来！🎉' },
  'review.great': { en: 'Awesome! 🎉', zh: '太棒了！🎉' },
  'review.subtitle': { en: 'Let\'s see what you remember!', zh: '让我们看看你记得什么！' },
  'review.goHome': { en: 'Back to My Pet! 🏠', zh: '回到我的宠物！🏠' },

  'community.title': { en: 'Learning Friends! 👥', zh: '学习伙伴！👥' },
  'community.subtitle': { en: 'Check out what your learning buddies are up to!', zh: '看看你的学习伙伴们在做什么！' },
  'community.postDaily': { en: 'Share What I Learned Today! ✨', zh: '分享我今天学到的！✨' },
  'community.loading': { en: 'Loading...', zh: '加载中...' },
  'community.empty': { en: 'Be the first to share something cool you learned! 🌟', zh: '成为第一个分享你学到的酷东西的人！🌟' },

  'summary.title': { en: 'Your Brain Map! 🗺️', zh: '你的大脑地图！🗺️' },
  'summary.subtitle': { en: 'See how smart you\'re getting!', zh: '看看你变得有多聪明！' },
  'summary.totalTopics': { en: '🎯 Things You Know', zh: '🎯 你知道的事情' },
  'summary.mastered': { en: '⭐ Totally Got It', zh: '⭐ 完全掌握' },
  'summary.needReview': { en: '⏰ Time to Practice', zh: '⏰ 练习时间' },
  'summary.avgQuality': { en: '📊 How Well You Explain', zh: '📊 你解释得有多好' },
  'summary.recentSessions': { en: 'Recent Sessions', zh: '最近的学习' },
  'summary.knowledgeMap': { en: 'Knowledge Map', zh: '知识地图' },
  'summary.empty': { en: 'Nothing here yet! Go teach me something awesome! 🚀', zh: '这里还没有东西！去教我一些很棒的东西！🚀' },

  'pet.intelligence': { en: 'Brain Power', zh: '脑力' },
  'pet.health': { en: 'Energy', zh: '能量' },
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
  // cache holds a simple translation pair for each key
  private cache: Map<string, { en: string; zh: string }>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || LINGO_API_KEY;
    this.useFallback = !this.apiKey;
    this.cache = new Map();

    // Avoid noisy console output in the demo app; use centralized logger if needed.
    // Logging is intentionally silent by default.
    
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
      // swallow API errors and fall back to built-in dictionary
      return this.getFallbackTranslation(key, locale);
    }
  }

  private getFallbackTranslation(key: string, locale: Locale): string {
    const translation = FALLBACK_TRANSLATIONS[key];
    if (!translation) {
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
  // Prefer a runtime override, then the browser language. We intentionally
  // avoid localStorage persistence here.
  const runtime = (window as any).__AOMIGO_LOCALE as Locale | undefined;
  if (runtime) return runtime;
  const nav = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return nav && nav.startsWith('zh') ? 'zh' : 'en';
}

export function setLocale(locale: Locale): void {
  // Set an in-memory/runtime override and reload so UI updates. This does
  // not persist to localStorage by design.
  (window as any).__AOMIGO_LOCALE = locale;
  window.location.reload();
}
