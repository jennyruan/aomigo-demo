import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Clock, Award } from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { usePetStats } from '../hooks/usePetStats';
import { isSupabaseConfigured } from '../lib/supabase';
import type { Topic, TeachingSession } from '../types';
import { t, getCurrentLocale } from '../lib/lingo';
import { fetchTopicsByUser } from '../lib/database/topics';
import { fetchTeachingSessionsByUser } from '../lib/database/teachingSessions';

export function Summary() {
  const { profile } = usePetStats();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = getCurrentLocale();

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  async function loadData() {
    if (!profile) return;

    try {
      if (!isSupabaseConfigured) {
        setTopics([]);
        setSessions([]);
        return;
      }

      const [topicList, sessionList] = await Promise.all([
        fetchTopicsByUser(profile.id),
        fetchTeachingSessionsByUser(profile.id, 10),
      ]);

      setTopics(topicList);
      setSessions(sessionList);
    } catch (error) {
      console.error('[Summary] Failed to load summary data', error);
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const masteredTopics = topics.filter((t) => t.mastery_level >= 3).length;
  const needReviewTopics = topics.filter(
    (t) =>
      new Date(t.last_reviewed).getTime() <
      new Date().getTime() - 7 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-brown-700">
              {t('summary.title', locale)}
            </h1>
            <p className="text-brown-600 mt-1">Track your learning progress</p>
          </div>
          <PetAvatar size="small" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-brown-700">
                {t('summary.totalTopics', locale)}
              </span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{topics.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-brown-700">
                {t('summary.mastered', locale)}
              </span>
            </div>
            <p className="text-3xl font-bold text-green-600">{masteredTopics}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-600" />
              <span className="text-sm font-medium text-brown-700">
                {t('summary.needReview', locale)}
              </span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">
              {needReviewTopics}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-brown-700">
                Avg Quality
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {sessions.length > 0
                ? Math.round(
                    sessions.reduce((sum, s) => sum + s.quality_score, 0) /
                      sessions.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <h2 className="text-xl font-bold text-brown-700 mb-4">
              Your Topics
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : topics.length === 0 ? (
              <p className="text-brown-600 text-center py-8">
                No topics yet. Start teaching Aomigo! 📚
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border border-orange-200 rounded-xl p-4 hover:border-orange-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-brown-700">
                        {topic.topic_name}
                      </h3>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                        Depth {topic.depth}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-brown-600">
                      <span>
                        Reviews: {topic.review_count}
                      </span>
                      <span>
                        Last: {new Date(topic.last_reviewed).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-purple-100 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(topic.mastery_level / 5) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6">
            <h2 className="text-xl font-bold text-brown-700 mb-4">
              Recent Sessions
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-brown-600 text-center py-8">
                No sessions yet. Go teach something! 🚀
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-purple-200 rounded-xl p-4 hover:border-purple-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-600 uppercase">
                        {session.input_type}
                      </span>
                      <span className="text-xs text-brown-600">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-brown-700 mb-2 line-clamp-2">
                      {session.raw_input}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {session.extracted_topics.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    {session.quality_score > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brown-600">Quality:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              session.quality_score > 80
                                ? 'bg-green-500'
                                : session.quality_score > 60
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${session.quality_score}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-brown-700">
                          {session.quality_score}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
