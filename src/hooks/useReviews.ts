import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Review } from '../types';
import { getNextReviewDate, isReviewOverdue } from '../lib/forgettingCurve';

export function useReviews(userId: string | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dueReviews, setDueReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadReviews();
    }
  }, [userId]);

  async function loadReviews() {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .is('completed_at', null)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      setReviews(data || []);

      const due = (data || []).filter(review =>
        isReviewOverdue(review.scheduled_date)
      );
      setDueReviews(due);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function scheduleReview(topicId: string, intervalIndex: number = 0) {
    if (!userId) return;

    const intervals = [0, 1, 3, 7, 14, 30, 60];
    const scheduledDate = new Date();

    if (intervalIndex === 0) {
      scheduledDate.setMinutes(scheduledDate.getMinutes() + 10);
    } else {
      scheduledDate.setDate(scheduledDate.getDate() + intervals[intervalIndex]);
    }

    try {
      const { error } = await supabase.from('reviews').insert([
        {
          user_id: userId,
          topic_id: topicId,
          scheduled_date: scheduledDate.toISOString(),
          interval_days: intervals[intervalIndex],
        },
      ]);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
    }
  }

  async function completeReview(
    reviewId: string,
    result: 'good' | 'poor',
    topicId: string,
    currentIntervalIndex: number
  ) {
    if (!userId) return;

    try {
      const nextReview = getNextReviewDate(currentIntervalIndex, result);

      await supabase
        .from('reviews')
        .update({
          completed_at: new Date().toISOString(),
          result,
          next_review_date: nextReview.date.toISOString(),
        })
        .eq('id', reviewId);

      const intervals = [0, 1, 3, 7, 14, 30, 60];
      const newIntervalIndex = result === 'good'
        ? Math.min(currentIntervalIndex + 1, intervals.length - 1)
        : Math.max(0, currentIntervalIndex - 1);

      await supabase.from('reviews').insert([
        {
          user_id: userId,
          topic_id: topicId,
          scheduled_date: nextReview.date.toISOString(),
          interval_days: intervals[newIntervalIndex],
        },
      ]);

      await supabase
        .from('topics')
        .update({
          last_reviewed: new Date().toISOString(),
        })
        .eq('id', topicId);

      await loadReviews();
    } catch (error) {
    }
  }

  return {
    reviews,
    dueReviews,
    loading,
    scheduleReview,
    completeReview,
    refresh: loadReviews,
  };
}
