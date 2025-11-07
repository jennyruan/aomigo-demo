import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Map, Users, Clock, LogOut, Globe, Settings, HelpCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { usePetStats } from '../hooks/usePetStats';
import { t, useLocale, setLocale } from '../lib/lingo';
import { TutorialModal } from './TutorialModal';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useStore();
  const { profile } = usePetStats();
  const locale = useLocale();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasShownTutorial, setHasShownTutorial] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const accountType = 'student';
  const accountBadge = accountType === 'student' ? '🎓' : accountType === 'parent' ? '👨‍👩‍👧' : '👨‍🏫';
  const accountLabel = accountType === 'student' ? 'Student' : accountType === 'parent' ? 'Parent' : 'Teacher';

  useEffect(() => {
    // Show tutorial once per session when visiting /home. We intentionally
    // avoid persisting this to localStorage so the app doesn't retain client
    // storage between sessions.
    if (!hasShownTutorial && location.pathname === '/home') {
      setIsTutorialOpen(true);
      setHasShownTutorial(true);
    }
  }, [location.pathname, hasShownTutorial]);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  function toggleLocale() {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(newLocale);
  }

  const navItems = [
    { path: '/home', icon: Home, label: t('nav.home', locale) },
    { path: '/teach', icon: BookOpen, label: t('nav.teach', locale) },
    { path: '/summary', icon: Map, label: t('nav.summary', locale) },
    { path: '/community', icon: Users, label: t('nav.community', locale) },
    { path: '/messages', icon: MessageCircle, label: '💬 Messages' },
    { path: '/shop', icon: ShoppingBag, label: '🛍️ Shop' },
    { path: '/reviews', icon: Clock, label: t('nav.reviews', locale) },
    { path: '/settings', icon: Settings, label: t('nav.settings', locale) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-yellow-300">
      <header className="bg-orange-400 cartoon-border md:sticky md:top-0 z-50 mb-4 mx-2 sm:mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex w-full flex-wrap md:flex-nowrap items-center gap-3 md:h-20 py-3 md:py-0">
            <Link
              to="/home"
              className="flex-shrink-0 flex items-center gap-2 cartoon-button bg-yellow-200 px-4 py-2 rounded-full"
            >
              <span className="text-3xl">🐶</span>
              <span className="text-2xl font-bold text-gray-900">
                {t('app.title', locale)}
              </span>
            </Link>

            <div className="hidden md:flex flex-1 min-w-0 items-center">
              <div className="relative w-full min-w-0">
                <nav
                  aria-label="Primary navigation"
                  className="flex w-full min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain py-2 pr-6 lg:pr-10 scrollbar-none snap-x snap-mandatory"
                >
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex-shrink-0 min-w-[90px] max-w-[14rem] snap-start flex items-center gap-2 rounded-full px-4 py-2 font-bold cartoon-button transition-transform duration-150 ${
                          isActive
                            ? 'bg-white text-gray-900'
                            : 'bg-orange-300 text-gray-900 hover:bg-orange-200'
                        }`}
                      >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="whitespace-normal break-words text-sm text-center">{item.label}</span>
                      </Link>
                    );
                  })}

                  <div className="min-w-max snap-start flex items-center gap-2 pl-4 border-l-4 border-black/40">
                    <div className="relative">
                      <button
                        onClick={() => setShowAccountMenu(!showAccountMenu)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full cartoon-button bg-white border-3 border-black hover:bg-yellow-100 transition-colors"
                        title="Account Type"
                      >
                        <span className="text-xl">{accountBadge}</span>
                        <span className="font-bold text-gray-900">{accountLabel}</span>
                      </button>

                      {showAccountMenu && (
                        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-3 border-black z-50 overflow-hidden">
                          <div className="p-4 bg-gradient-to-r from-orange-400 to-purple-400">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{accountBadge}</span>
                              <div>
                                <h3 className="font-bold text-white">{accountLabel} Account</h3>
                                <p className="text-sm text-white opacity-90">{profile?.pet_name || 'AOMIGO User'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-brown-600">🔥 Streak:</span>
                              <span className="font-bold text-brown-700">{profile?.day_streak || 0} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-brown-600">⭐ Level:</span>
                              <span className="font-bold text-brown-700">{profile?.level || 1}</span>
                            </div>
                          </div>
                          <div className="border-t border-orange-100">
                            <button
                              onClick={() => {
                                setShowAccountMenu(false);
                                navigate('/settings');
                              }}
                              className="w-full p-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-2 font-semibold text-brown-700"
                            >
                              <Settings className="w-4 h-4" />
                              Account Settings
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setIsTutorialOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full cartoon-button bg-purple-400 text-white font-bold"
                      title="Help"
                    >
                      <HelpCircle className="w-5 h-5" />
                      <span>Help</span>
                    </button>

                    <button
                      onClick={toggleLocale}
                      className="flex items-center gap-2 px-4 py-2 rounded-full cartoon-button bg-blue-400 text-white font-bold"
                    >
                      <Globe className="w-5 h-5" />
                      <span>{locale === 'en' ? '中文' : 'EN'}</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-4 py-2 rounded-full cartoon-button bg-red-500 text-white font-bold"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t-4 border-black">
          <div className="relative">
            <div className="flex items-stretch gap-3 overflow-x-auto overscroll-x-contain px-4 py-3 bg-orange-300 scrollbar-none snap-x snap-mandatory">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`snap-start flex-shrink-0 flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[84px] max-w-[9rem] rounded-xl border-4 border-black font-bold transition-colors ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-[4px_4px_0_#000]'
                        : 'bg-orange-200 text-gray-900 shadow-[2px_2px_0_#000] hover:bg-orange-100'
                    }`}
                  >
                      <Icon className="w-6 h-6 flex-shrink-0" />
                      <span className="text-xs font-bold whitespace-normal break-words text-center">{item.label}</span>
                  </Link>
                );
              })}

              <div className="snap-start flex items-center gap-2 pl-2 flex-shrink-0 min-w-[160px] max-w-[18rem]">
                <div className="relative">
                  <button
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full cartoon-button bg-white border-3 border-black text-sm"
                    title="Account Type"
                  >
                    <span className="text-lg">{accountBadge}</span>
                    <span className="font-bold text-gray-900">{accountLabel}</span>
                  </button>

                  {showAccountMenu && (
                    <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border-3 border-black z-50 overflow-hidden">
                      <div className="p-3 bg-gradient-to-r from-orange-400 to-purple-400">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{accountBadge}</span>
                          <div>
                            <h3 className="font-bold text-white text-sm">{accountLabel} Account</h3>
                            <p className="text-xs text-white/80">{profile?.pet_name || 'AOMIGO User'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-brown-600">🔥 Streak</span>
                          <span className="font-bold text-brown-700">{profile?.day_streak || 0}d</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-brown-600">⭐ Level</span>
                          <span className="font-bold text-brown-700">{profile?.level || 1}</span>
                        </div>
                      </div>
                      <div className="border-t border-orange-100">
                        <button
                          onClick={() => {
                            setShowAccountMenu(false);
                            navigate('/settings');
                          }}
                          className="w-full p-2 text-left hover:bg-orange-50 transition-colors flex items-center gap-2 font-semibold text-brown-700 text-xs"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsTutorialOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full cartoon-button bg-purple-400 text-white font-bold text-sm"
                  title="Help"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-2 px-3 py-2 rounded-full cartoon-button bg-blue-400 text-white font-bold text-sm"
                >
                  <Globe className="w-5 h-5" />
                  <span>{locale === 'en' ? '中文' : 'EN'}</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-full cartoon-button bg-red-500 text-white font-bold text-sm"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4">{children}</main>

      <footer className="bg-orange-400 cartoon-border mx-4 mb-4 rounded-2xl py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-900 font-bold">
          <p>🐶 AOMIGO - Your AI Learning Companion 🐶</p>
          <p className="mt-1">Built with love for learners everywhere</p>
          <p className="mt-2 text-orange-600 text-base font-bold">Together We Got This 🐶</p>
        </div>
      </footer>

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
