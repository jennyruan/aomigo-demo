import { useEffect, useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { usePetStats } from '../hooks/usePetStats';
import { supabase } from '../lib/supabase';
import type { CommunityPost, TeachingSession } from '../types';
import { t, getCurrentLocale } from '../lib/lingo';
import { toast } from 'sonner';

export function Community() {
  const { profile } = usePetStats();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const locale = getCurrentLocale();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function postDailyCard() {
    if (!profile || posting) return;

    setPosting(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: existingPost } = await supabase
        .from('community_posts')
        .select('*')
        .eq('user_id', profile.id)
        .eq('post_date', today)
        .maybeSingle();

      if (existingPost) {
        toast.error('You already posted today! Come back tomorrow 🐾');
        setPosting(false);
        return;
      }

      const { data: todaySessions } = await supabase
        .from('teaching_sessions')
        .select('*')
        .eq('user_id', profile.id)
        .gte('created_at', new Date(today).toISOString())
        .order('created_at', { ascending: false });

      if (!todaySessions || todaySessions.length === 0) {
        toast.error('No learning sessions today. Teach something first!');
        setPosting(false);
        return;
      }

      const allTopics = todaySessions.flatMap((s) => s.extracted_topics);
      const uniqueTopics = [...new Set(allTopics)].slice(0, 3);

      const summaryText = `${profile.pet_name} learned about ${uniqueTopics.join(', ')} today! ${
        todaySessions.length > 1 ? `Completed ${todaySessions.length} learning sessions.` : ''
      } Keep growing! 🐾`;

      const { error } = await supabase.from('community_posts').insert([
        {
          user_id: profile.id,
          pet_name: profile.pet_name,
          summary_text: summaryText,
          topics_learned: uniqueTopics,
          post_date: today,
        },
      ]);

      if (error) throw error;

      toast.success('Daily card posted! 🎉');
      await loadPosts();
    } catch (error) {
      console.error('Error posting card:', error);
      toast.error('Failed to post card. Please try again.');
    } finally {
      setPosting(false);
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-brown-700">
                {t('community.title', locale)}
              </h1>
              <p className="text-brown-600 mt-1">
                See what others are learning
              </p>
            </div>
          </div>
          <button
            onClick={postDailyCard}
            disabled={posting}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {posting ? 'Posting...' : t('community.postDaily', locale)}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🌟</span>
            <h3 className="text-xl font-bold text-brown-700 mb-2">
              No posts yet
            </h3>
            <p className="text-brown-600">
              Be the first to share your learning journey!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-2xl">
                    {post.user_id === profile.id ? '🐯' : '🐾'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-brown-700">
                      {post.pet_name}
                    </h3>
                    <p className="text-xs text-brown-600">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-brown-700 mb-4 leading-relaxed">
                  {post.summary_text}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.topics_learned.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-orange-100 flex items-center gap-2 text-sm text-brown-600">
                  <span>❤️</span>
                  <span>{post.likes_count} likes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
