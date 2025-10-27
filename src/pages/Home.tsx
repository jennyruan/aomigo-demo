import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Map, Users, Clock, Flame } from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { usePetStats } from '../hooks/usePetStats';
import { useReviews } from '../hooks/useReviews';
import { t, getCurrentLocale } from '../lib/lingo';

export function Home() {
  const { profile, updateStreak } = usePetStats();
  const { dueReviews } = useReviews(profile?.id || null);
  const locale = getCurrentLocale();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (profile) {
      updateStreak();
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const intelligencePercent = (profile.intelligence / 1000) * 100;
  const healthPercent = profile.health;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="cartoon-border bg-white px-6 py-4 rounded-3xl">
              <h1 className="text-3xl font-bold text-gray-900">
                {greeting}! 👋
              </h1>
              <p className="text-gray-700 mt-1 font-semibold">{t('home.welcome', locale)}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 cartoon-border bg-orange-400 px-5 py-3 rounded-full">
                <Flame className="w-6 h-6 text-red-600" />
                <span className="font-bold text-gray-900 text-xl">{profile.day_streak}</span>
                <span className="text-sm text-gray-900 font-bold">{t('home.dayStreak', locale)}</span>
              </div>

              <div className="cartoon-border bg-purple-500 px-5 py-3 rounded-full">
                <span className="font-bold text-white text-lg">
                  {t('home.level', locale)} {profile.level}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-300 rounded-3xl cartoon-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-gray-900">
                  🧠 {t('pet.intelligence', locale)}
                </span>
                <span className="text-base font-bold text-gray-900">
                  {profile.intelligence}/1000
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-4 border-2 border-black">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500 border-r-2 border-black"
                  style={{ width: `${intelligencePercent}%` }}
                />
              </div>
            </div>

            <div className="bg-pink-300 rounded-3xl cartoon-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-gray-900">
                  ❤️ {t('pet.health', locale)}
                </span>
                <span className="text-base font-bold text-gray-900">
                  {profile.health}/100
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-4 border-2 border-black">
                <div
                  className={`h-full rounded-full transition-all duration-500 border-r-2 border-black ${
                    healthPercent > 70 ? 'bg-green-400' : healthPercent > 40 ? 'bg-yellow-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 flex flex-col items-center gap-4">
            <PetAvatar size="large" showName />
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                Together We Got This 🐶
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/teach"
                className="bg-green-400 rounded-3xl cartoon-button p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-8 h-8 text-gray-900" strokeWidth={3} />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t('nav.teach', locale)}
                  </h3>
                </div>
                <p className="text-gray-800 text-sm font-semibold">
                  {t('home.teachButton', locale)}
                </p>
              </Link>

              <Link
                to="/summary"
                className="bg-blue-400 rounded-3xl cartoon-button p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Map className="w-8 h-8 text-gray-900" strokeWidth={3} />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t('nav.summary', locale)}
                  </h3>
                </div>
                <p className="text-gray-800 text-sm font-semibold">
                  {t('home.summaryButton', locale)}
                </p>
              </Link>

              <Link
                to="/community"
                className="bg-pink-400 rounded-3xl cartoon-button p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-gray-900" strokeWidth={3} />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t('nav.community', locale)}
                  </h3>
                </div>
                <p className="text-gray-800 text-sm font-semibold">
                  {t('home.communityButton', locale)}
                </p>
              </Link>

              <Link
                to="/reviews"
                className="bg-purple-400 rounded-3xl cartoon-button p-6 relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-8 h-8 text-gray-900" strokeWidth={3} />
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t('nav.reviews', locale)}
                  </h3>
                  {dueReviews.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-black">
                      {dueReviews.length}
                    </span>
                  )}
                </div>
                <p className="text-gray-800 text-sm font-semibold">
                  Complete your spaced repetition reviews
                </p>
              </Link>
            </div>
          </div>
        </div>

        {dueReviews.length > 0 && (
          <div className="bg-orange-400 rounded-3xl cartoon-border p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">🐶</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Time to Review!</h3>
                <p className="text-gray-800 font-semibold">
                  You have {dueReviews.length} topic{dueReviews.length !== 1 ? 's' : ''} ready for review
                </p>
              </div>
            </div>
            <Link
              to="/reviews"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-full font-bold cartoon-button"
            >
              Start Reviewing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
