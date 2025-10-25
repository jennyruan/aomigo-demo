import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Map, Users, Clock, LogOut, Globe, Settings } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { t, getCurrentLocale, setLocale } from '../lib/lingo';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useStore();
  const locale = getCurrentLocale();

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
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md shadow-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/home" className="flex items-center gap-2">
              <span className="text-3xl">🐶</span>
              <span className="text-2xl font-bold text-orange-600">
                {t('app.title', locale)}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-brown-700 hover:bg-orange-100'
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
                onClick={toggleLocale}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">{locale === 'en' ? '中文' : 'EN'}</span>
              </button>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t border-orange-100">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-orange-600'
                      : 'text-brown-600 hover:text-orange-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-orange-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-brown-600">
          <p>🐶 Aomigo - Your AI Learning Companion 🐶</p>
          <p className="mt-1">Built with love for learners everywhere</p>
        </div>
      </footer>
    </div>
  );
}
