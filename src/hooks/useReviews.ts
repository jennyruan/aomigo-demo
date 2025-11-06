import { useState, useEffect } from 'react';
import type { Review } from '../types';
import { getNextReviewDate, isReviewOverdue } from '../lib/forgettingCurve';
import {
  completeReviewEntry,
  fetchOpenReviews,
  insertReview,
  REVIEW_INTERVALS,
  touchTopicLastReviewed,
} from '../lib/database/reviews';
import { isSupabaseConfigured } from '../lib/supabase';

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
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const openReviews = await fetchOpenReviews(userId);

      setReviews(openReviews);

      const due = openReviews.filter(review =>
        isReviewOverdue(review.scheduled_date)
      );
      setDueReviews(due);
    } catch (error) {
      console.error('[Reviews] Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  }

  async function scheduleReview(topicId: string, intervalIndex: number = 0) {
    if (!userId) return;
    if (!isSupabaseConfigured) return;

    const scheduledDate = new Date();

    if (intervalIndex === 0) {
      scheduledDate.setMinutes(scheduledDate.getMinutes() + 10);
    } else {
      scheduledDate.setDate(scheduledDate.getDate() + REVIEW_INTERVALS[intervalIndex]);
    }

    try {
      await insertReview({
        userId,
        topicId,
        scheduledDate: scheduledDate.toISOString(),
        intervalDays: REVIEW_INTERVALS[intervalIndex],
      });
      await loadReviews();
    } catch (error) {
      console.error('[Reviews] Failed to schedule review', error);
    }
  }

  async function completeReview(
    reviewId: string,
    result: 'good' | 'poor',
    topicId: string,
    currentIntervalIndex: number
  ) {
    if (!userId) return;
    if (!isSupabaseConfigured) return;

    try {
      const nextReview = getNextReviewDate(currentIntervalIndex, result);

      const newIntervalIndex = result === 'good'
        ? Math.min(currentIntervalIndex + 1, REVIEW_INTERVALS.length - 1)
        : Math.max(0, currentIntervalIndex - 1);

      await completeReviewEntry({
        reviewId,
        result,
        nextReviewDate: nextReview.date.toISOString(),
        topicId,
        nextIntervalDays: REVIEW_INTERVALS[newIntervalIndex],
        userId,
      });

      await touchTopicLastReviewed(topicId);

      await loadReviews();
    } catch (error) {
      console.error('[Reviews] Failed to complete review', error);
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
