import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Map, Users, Clock, LogOut, Globe, Settings, HelpCircle } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { t, getCurrentLocale, setLocale } from '../lib/lingo';
import { TutorialModal } from './TutorialModal';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useStore();
  const locale = getCurrentLocale();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('tutorialCompleted');
    if (isFirstVisit && location.pathname === '/home') {
      setIsTutorialOpen(true);
    }
  }, [location.pathname]);

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
    { path: '/reviews', icon: Clock, label: t('nav.reviews', locale) },
    { path: '/settings', icon: Settings, label: t('nav.settings', locale) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-yellow-300">
      <header className="bg-orange-400 cartoon-border sticky top-0 z-50 mb-4 mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/home" className="flex items-center gap-2 cartoon-button bg-yellow-200 px-4 py-2 rounded-full">
              <span className="text-3xl">🐶</span>
              <span className="text-2xl font-bold text-gray-900">
                {t('app.title', locale)}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold cartoon-button ${
                      isActive
                        ? 'bg-white text-gray-900'
                        : 'bg-orange-300 text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTutorialOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full cartoon-button bg-purple-400 text-white font-bold"
                title="Help"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Help</span>
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
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t-4 border-black">
          <div className="flex items-center justify-around py-3 bg-orange-300">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl ${
                    isActive
                      ? 'bg-white text-gray-900 cartoon-border'
                      : 'text-gray-900'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4">{children}</main>

      <footer className="bg-orange-400 cartoon-border mx-4 mb-4 rounded-2xl py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-900 font-bold">
          <p>🐶 AOMIGO - Your AI Learning Companion 🐶</p>
          <p className="mt-1">Built with love for learners everywhere</p>
        </div>
      </footer>

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
