import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { usePetStats } from '../hooks/usePetStats';
import { useReviews } from '../hooks/useReviews';
import { useStore } from '../hooks/useStore.tsx';
import { evaluateReview } from '../lib/openai';
import type { Topic } from '../types';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';

export function Review() {
  const { profile, addIntelligence, addHealth } = usePetStats();
  const { dueReviews, completeReview } = useReviews(profile?.id || null);
  const { firebaseUser } = useStore();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<'good' | 'poor' | null>(null);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (dueReviews.length > 0 && currentReviewIndex < dueReviews.length) {
      loadCurrentTopic();
    }
  }, [dueReviews, currentReviewIndex]);

  async function loadCurrentTopic() {
    if (!dueReviews[currentReviewIndex]) return;

    try {
      if (!firebaseUser) {
        setCurrentTopic(null);
        return;
      }

      const topic = await apiClient.withAuth<Topic>(
        firebaseUser,
        `/api/v1/topics/${dueReviews[currentReviewIndex].topic_id}`
      );

      if (topic) {
        setCurrentTopic(topic);
      }
    } catch (error) {
      console.error('[Review] Failed to load topic', error);
    }
  }

  async function handleSubmit() {
    if (!userAnswer.trim() || !currentTopic || !profile) return;

    setIsSubmitting(true);

    try {
      const evaluation = await evaluateReview(currentTopic.topic_name, userAnswer);

      setResult(evaluation.result);
      setFeedback(evaluation.feedback);
      setShowResult(true);

      const currentReview = dueReviews[currentReviewIndex];
      const intervalIndex = Math.floor(currentReview.interval_days / 7);

      await completeReview(
        currentReview.id,
        evaluation.result,
        intervalIndex
      );

      if (evaluation.result === 'good') {
        await addIntelligence(5);
        await addHealth(3);
        toast.success('+5 Intelligence! Great review!');
      } else {
        await addIntelligence(2);
        toast.success('+2 Intelligence! Keep practicing!');
      }

      setTimeout(() => {
        setShowResult(false);
        setUserAnswer('');
        setResult(null);
        setFeedback('');

        if (currentReviewIndex + 1 < dueReviews.length) {
          setCurrentReviewIndex(currentReviewIndex + 1);
        } else {
          navigate('/home');
          toast.success('All reviews completed! Well done!');
        }
      }, 3500);
    } catch (error) {
      console.error('[Review] Failed to submit review', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (dueReviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <PetAvatar size="large" showName />
          <h2 className="text-2xl font-bold text-brown-700 mt-6 mb-2">
            All Caught Up! 🎉
          </h2>
          <p className="text-brown-600 mb-4">
            No reviews due right now. Come back later!
          </p>
          <p className="text-xl font-bold text-orange-600 mb-6">
            Together We Got This 🐶
          </p>
          <button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentTopic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-cream-50 to-purple-50">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-brown-700">Review Time!</h1>
              <p className="text-brown-600 mt-1">
                Question {currentReviewIndex + 1} of {dueReviews.length}
              </p>
            </div>
          </div>
          <PetAvatar size="small" />
        </div>

        <div className="mb-4">
          <div className="w-full bg-orange-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${((currentReviewIndex + 1) / dueReviews.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {!showResult ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-orange-100 p-8">
            <div className="mb-6">
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm">
                Topic: {currentTopic.topic_name}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-brown-700 mb-4">
                Explain what you know about this topic
              </h2>
              <p className="text-brown-600">
                Share your understanding in your own words. Include key concepts,
                examples, and how it relates to other topics.
              </p>
            </div>

            <div className="space-y-4">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[200px] text-brown-700"
                disabled={isSubmitting}
              />

              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Answer'
                )}
              </button>
            </div>

            <div className="mt-6 text-sm text-brown-600 bg-orange-50 p-4 rounded-xl">
              <p className="font-medium mb-1">💡 Tips for a great answer:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Explain in your own words</li>
                <li>Include examples or use cases</li>
                <li>Connect to related concepts</li>
                <li>Be detailed and specific</li>
              </ul>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-2xl shadow-lg p-8 text-white ${
              result === 'good'
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            }`}
          >
            <div className="flex items-start gap-4">
              {result === 'good' ? (
                <CheckCircle className="w-12 h-12 flex-shrink-0 mt-1" />
              ) : (
                <XCircle className="w-12 h-12 flex-shrink-0 mt-1" />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">
                  {result === 'good' ? 'Excellent!' : 'Keep Practicing!'}
                </h3>
                <p className="text-white/95 text-lg leading-relaxed">
                  {feedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
