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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-brown-700">
                {greeting}! 👋
              </h1>
              <p className="text-brown-600 mt-1">{t('home.welcome', locale)}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                <Flame className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-brown-700">{profile.day_streak}</span>
                <span className="text-sm text-brown-600">{t('home.dayStreak', locale)}</span>
              </div>

              <div className="bg-purple-100 px-4 py-2 rounded-full">
                <span className="font-bold text-purple-700">
                  {t('home.level', locale)} {profile.level}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brown-700">
                  🧠 {t('pet.intelligence', locale)}
                </span>
                <span className="text-sm font-bold text-orange-600">
                  {profile.intelligence}/1000
                </span>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${intelligencePercent}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-brown-700">
                  ❤️ {t('pet.health', locale)}
                </span>
                <span className="text-sm font-bold text-red-600">
                  {profile.health}/100
                </span>
              </div>
              <div className="w-full bg-red-100 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    healthPercent > 70 ? 'bg-green-500' : healthPercent > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 flex justify-center">
            <PetAvatar size="large" showName />
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/teach"
                className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 hover:scale-105 transition-transform group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-brown-700">
                    {t('nav.teach', locale)}
                  </h3>
                </div>
                <p className="text-brown-600 text-sm">
                  {t('home.teachButton', locale)}
                </p>
              </Link>

              <Link
                to="/summary"
                className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 hover:scale-105 transition-transform group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Map className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-brown-700">
                    {t('nav.summary', locale)}
                  </h3>
                </div>
                <p className="text-brown-600 text-sm">
                  {t('home.summaryButton', locale)}
                </p>
              </Link>

              <Link
                to="/community"
                className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 hover:scale-105 transition-transform group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-bold text-brown-700">
                    {t('nav.community', locale)}
                  </h3>
                </div>
                <p className="text-brown-600 text-sm">
                  {t('home.communityButton', locale)}
                </p>
              </Link>

              <Link
                to="/reviews"
                className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 hover:scale-105 transition-transform group relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-brown-700">
                    {t('nav.reviews', locale)}
                  </h3>
                  {dueReviews.length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {dueReviews.length}
                    </span>
                  )}
                </div>
                <p className="text-brown-600 text-sm">
                  Complete your spaced repetition reviews
                </p>
              </Link>
            </div>
          </div>
        </div>

        {dueReviews.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🐶</span>
              <div>
                <h3 className="text-xl font-bold">Time to Review!</h3>
                <p className="text-orange-100">
                  You have {dueReviews.length} topic{dueReviews.length !== 1 ? 's' : ''} ready for review
                </p>
              </div>
            </div>
            <Link
              to="/reviews"
              className="inline-block bg-white text-orange-600 px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Start Reviewing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
