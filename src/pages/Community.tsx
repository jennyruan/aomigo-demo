/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';
import { Users, Plus, Heart, MessageCircle, Share2, Edit2, Trash2 } from 'lucide-react';
import { PostCreationModal, type PostData } from '../components/PostCreationModal';
import { usePetStats } from '../hooks/usePetStats';
import type { CommunityPost, PostComment } from '../types';
import { t, getCurrentLocale } from '../lib/lingo';
import { toast } from 'sonner';

interface ExamplePost extends Partial<CommunityPost> {
  user_type?: 'student' | 'parent' | 'teacher';
  user_details?: string;
}

const SAMPLE_POSTS: ExamplePost[] = [
  {
    pet_name: 'Luna',
    user_type: 'student',
    user_details: 'Sarah Martinez, 13',
    content: 'Just learned about photosynthesis! 🌱 Plants make their own food from sunlight! Mind blown 🤯\n\nAnyone else studying biology? Would love to quiz each other before the test!',
    summary_text: 'Luna learned about photosynthesis!',
    topics_learned: ['Biology', 'Science'],
    likes_count: 24,
    comment_count: 8,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    pet_name: 'Mama Ruan\'s Pet',
    user_type: 'parent',
    user_details: 'Lisa Chen',
    content: 'My daughter has been so stressed about finals 😰 She studies 4-5 hours a day but feels like she\'s not retaining anything. Any advice from other parents?\n\nI want to help but don\'t want to add more pressure...',
    summary_text: 'Parent seeking advice about study stress',
    topics_learned: ['Parenting', 'Education'],
    likes_count: 47,
    comment_count: 23,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    pet_name: 'Ms. Johnson',
    user_type: 'teacher',
    user_details: 'Verified Math Teacher',
    content: '💡 Study Tip Tuesday! 💡\n\nWhen you\'re stuck on a problem, try this:\n\n1️⃣ Explain it to your AOMIGO pet out loud\n2️⃣ If you can\'t explain it, you don\'t fully understand\n3️⃣ The act of teaching reveals your knowledge gaps!\n\nThis is called the "Feynman Technique" and it WORKS! 🎯\n\nTry it with your next homework problem! 📝',
    summary_text: 'Teacher shares study technique',
    topics_learned: ['Study Skills', 'Education'],
    likes_count: 312,
    comment_count: 67,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    pet_name: 'Mochi',
    user_type: 'student',
    user_details: 'Alex Chen, 14',
    content: '📚 STUDY GROUP FORMING! 📚\n\nSubject: Biology (Chapter 6-8)\nWhen: Saturday 2:00 PM PST\nWhere: Video call (link in group chat)\n\nWe\'re 3 people so far. Need 2-3 more!\n\nTopics: Cell structure, photosynthesis, respiration\n\nComment below if you want to join! 🙋',
    summary_text: 'Student forming study group',
    topics_learned: ['Biology', 'Collaboration'],
    likes_count: 18,
    comment_count: 12,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    pet_name: 'Buddy',
    user_type: 'student',
    user_details: 'Emma Wilson, 12',
    content: 'Finally mastered long division! My human taught me the steps and now I can solve any problem. 🎉\n\nPractice really does make perfect!',
    summary_text: 'Buddy mastered long division!',
    topics_learned: ['Math'],
    likes_count: 23,
    comment_count: 7,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export function Community() {
  const { profile } = usePetStats();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const locale = getCurrentLocale();

  const loadPosts = useCallback(() => {
    setLoading(true);
    try {
      const samplePosts = SAMPLE_POSTS.map((post, index) => ({
        id: `sample_${index}`,
        user_id: `sample_user_${index}`,
        pet_name: post.pet_name ?? `Friend ${index + 1}`,
        content: post.content ?? post.summary_text ?? '',
        summary_text: post.summary_text ?? post.content?.slice(0, 100) ?? '',
        topics_learned: post.topics_learned ?? [],
        post_date: new Date().toISOString().split('T')[0],
        likes_count: post.likes_count ?? 0,
        comment_count: post.comment_count ?? 0,
        reaction_counts: post.reaction_counts ?? {},
        created_at: post.created_at ?? new Date().toISOString(),
        privacy: 'public' as const,
        image_url: post.image_url,
      })) as CommunityPost[];
      setPosts(samplePosts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function loadComments(postId: string) {
    setComments(prev => ({ ...prev, [postId]: prev[postId] ?? [] }));
  }

  async function handleCreatePost(postData: PostData) {
    if (!profile) return;

    try {
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        user_id: profile.id,
        pet_name: profile.pet_name,
        content: postData.content,
        summary_text: postData.content.substring(0, 100),
        topics_learned: postData.topics,
        image_url: postData.image_url,
        privacy: postData.privacy,
        post_date: new Date().toISOString().split('T')[0],
        likes_count: 0,
        comment_count: 0,
        reaction_counts: {},
        created_at: new Date().toISOString(),
      };
      setPosts(prev => [newPost, ...prev]);

      toast.success('Posted!');
    } catch (error) {
      toast.error('Failed to create post');
      console.error('[Community] Failed to create post', error);
      throw error;
    }
  }

  async function handleLike(postId: string) {
    if (!profile) return;

    const isLiked = userLikes.has(postId);

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, likes_count: Math.max(0, post.likes_count + (isLiked ? -1 : 1)) }
        : post
    ));
    setUserLikes(prev => {
      const next = new Set(prev);
      isLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
  }

  async function handleAddComment(postId: string) {
    if (!profile || !newComment[postId]?.trim()) return;

    const content = newComment[postId].trim();

    const newCommentObj: PostComment = {
      id: `comment_${Date.now()}`,
      post_id: postId,
      user_id: profile.id,
      pet_name: profile.pet_name,
      content,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newCommentObj]
    }));
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comment_count: (post.comment_count || 0) + 1 }
        : post
    ));

    setNewComment(prev => ({ ...prev, [postId]: '' }));
    toast.success('Comment added!');
  }

  function toggleComments(postId: string) {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
        if (!comments[postId]) {
          loadComments(postId);
        }
      }
      return next;
    });
  }

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
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
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Share What I Learned Today!
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg shadow-orange-100">
            <span className="text-6xl mb-4 block">⭐</span>
            <h3 className="text-xl font-bold text-brown-700 mb-2">
              No posts yet
            </h3>
            <p className="text-brown-600 mb-4">
              Be the first to share your learning journey!
            </p>
            <p className="text-xl font-bold text-orange-600 mb-6">
              Together We Got This 🐶
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Plus className="w-6 h-6" />
              Share What I Learned Today!
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const isOwnPost = post.user_id === profile.id;
              const isLiked = userLikes.has(post.id);
              const isExpanded = expandedComments.has(post.id);
              const examplePost = post as ExamplePost;
              const userBadge = examplePost.user_type === 'teacher' ? '🎓' :
                               examplePost.user_type === 'parent' ? '👨‍👩‍👧' : '🎓';
              const userIcon = examplePost.user_type === 'teacher' ? '🎓' : '🐶';

              return (
                <div
                  key={post.id}
                  className={`bg-white rounded-2xl shadow-lg shadow-orange-100 overflow-hidden transition-all hover:shadow-xl ${
                    isOwnPost ? 'border-l-4 border-orange-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-2xl">
                          {isOwnPost ? '🐯' : userIcon}
                        </div>
                        <div>
                          <h3 className="font-bold text-brown-700 flex items-center gap-2 flex-wrap">
                            {userBadge} {post.pet_name}
                            {examplePost.user_type === 'teacher' && (
                              <span className="text-xs">✅</span>
                            )}
                            {isOwnPost && (
                              <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                                Your Post
                              </span>
                            )}
                          </h3>
                          {examplePost.user_details && (
                            <p className="text-xs text-brown-600 mb-1">
                              {examplePost.user_details} · {examplePost.user_type === 'student' ? 'Student' :
                               examplePost.user_type === 'parent' ? 'Parent' : 'Teacher'}
                            </p>
                          )}
                          <p className="text-sm text-brown-600">
                            Posted {formatTimeAgo(post.created_at)}
                          </p>
                        </div>
                      </div>
                      {isOwnPost && (
                        <div className="flex gap-2">
                          <button className="text-brown-600 hover:text-orange-600 transition-colors p-2">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="text-brown-600 hover:text-red-600 transition-colors p-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-brown-700 mb-4 leading-relaxed whitespace-pre-wrap">
                      {post.content || post.summary_text}
                    </p>

                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="w-full rounded-xl mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    )}

                    {post.topics_learned.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.topics_learned.map((topic, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-700 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t border-orange-100 flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 text-sm font-medium transition-all ${
                          isLiked
                            ? 'text-red-500 scale-110'
                            : 'text-brown-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        {post.likes_count} likes
                      </button>
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-sm font-medium text-brown-600 hover:text-orange-600 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {post.comment_count || 0} comments
                      </button>
                      <button className="flex items-center gap-2 text-sm font-medium text-brown-600 hover:text-orange-600 transition-colors ml-auto">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-orange-100 space-y-4 animate-slide-down">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center text-lg flex-shrink-0">
                              🐶
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm text-brown-700">
                                  {comment.pet_name}
                                </span>
                                <span className="text-xs text-brown-600">
                                  {formatTimeAgo(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-brown-700">{comment.content}</p>
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-lg flex-shrink-0">
                            🐯
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={newComment[post.id] || ''}
                              onChange={(e) => setNewComment(prev => ({
                                ...prev,
                                [post.id]: e.target.value.slice(0, 200)
                              }))}
                              placeholder={`Reply as ${profile.pet_name}...`}
                              className="flex-1 px-4 py-2 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(post.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                              className="px-4 py-2 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PostCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
        petName={profile.pet_name}
      />
    </div>
  );
}
