import { useEffect, useMemo, useState } from 'react';

import { getNextReviewDate, isReviewOverdue, scheduleFirstReview } from '../lib/forgettingCurve';
import { apiClient } from '../lib/api/client';
import type { Review } from '../types';
import { useStore } from './useStore.tsx';

const DEFAULT_INTERVALS = [0, 1, 3, 7, 14, 30, 60];

export function useReviews(userId: string | null) {
  const { firebaseUser } = useStore();
  const authUser = useMemo(() => firebaseUser, [firebaseUser]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dueReviews, setDueReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [intervals, setIntervals] = useState<number[]>(DEFAULT_INTERVALS);

  useEffect(() => {
    loadIntervals();
  }, []);

  useEffect(() => {
    if (userId && authUser) {
      void loadReviews();
    } else {
      setLoading(false);
    }
  }, [userId, authUser]);

  async function loadIntervals() {
    try {
      const fetched = await apiClient.request<number[]>('/api/v1/reviews/intervals');
      if (Array.isArray(fetched) && fetched.length > 0) {
        setIntervals(fetched);
      }
    } catch (error) {
      console.warn('[Reviews] Failed to load interval configuration', error);
    }
  }

  async function loadReviews() {
    if (!userId || !authUser) return;

    try {
      setLoading(true);
      const openReviews = await apiClient.withAuth<Review[]>(authUser, '/api/v1/reviews/open');

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
    if (!userId || !authUser) return;

    let scheduledDate: Date;
    if (intervalIndex === 0) {
      scheduledDate = scheduleFirstReview();
    } else {
      scheduledDate = new Date();
      const days = intervals[intervalIndex] ?? intervals[intervals.length - 1];
      scheduledDate.setDate(scheduledDate.getDate() + days);
    }

    try {
      await apiClient.withAuth(authUser, '/api/v1/reviews/schedule', 'POST', {
        topic_id: topicId,
        scheduled_date: scheduledDate.toISOString(),
        interval_days: intervals[intervalIndex] ?? intervals[0] ?? 0,
      });
      await loadReviews();
    } catch (error) {
      console.error('[Reviews] Failed to schedule review', error);
    }
  }

  async function completeReview(
    reviewId: string,
    result: 'good' | 'poor',
    currentIntervalIndex: number
  ) {
    if (!userId || !authUser) return;

    try {
      const nextReview = getNextReviewDate(currentIntervalIndex, result);

      const newIntervalIndex = result === 'good'
        ? Math.min(currentIntervalIndex + 1, intervals.length - 1)
        : Math.max(0, currentIntervalIndex - 1);

      await apiClient.withAuth(authUser, `/api/v1/reviews/${reviewId}/complete`, 'POST', {
        result,
        next_review_date: nextReview.date.toISOString(),
        next_interval_days: intervals[newIntervalIndex] ?? nextReview.intervalDays,
      });

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
    intervals,
  };
}
