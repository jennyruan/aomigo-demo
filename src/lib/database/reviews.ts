/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Review } from '../../types';
import type { Database } from './types';
import { tryGetSupabaseClient } from './client';

export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30, 60] as const;

export async function fetchOpenReviews(userId: string): Promise<Review[]> {
  const client = tryGetSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .is('completed_at', null)
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('[Supabase] Failed to load reviews', error);
    return [];
  }

  return data ?? [];
}

export async function insertReview(review: {
  userId: string;
  topicId: string;
  scheduledDate: string;
  intervalDays: number;
}): Promise<void> {
  const client = tryGetSupabaseClient();
  if (!client) return;

  const payload: Database['public']['Tables']['reviews']['Insert'] = {
    user_id: review.userId,
    topic_id: review.topicId,
    scheduled_date: review.scheduledDate,
    interval_days: review.intervalDays,
  };

  const { error } = await (client.from('reviews') as any).insert([payload]);

  if (error) {
    console.error('[Supabase] Failed to insert review', error);
  }
}

export async function completeReviewEntry(
  params: {
    reviewId: string;
    result: 'good' | 'poor';
    nextReviewDate: string;
    topicId: string;
    nextIntervalDays: number;
    userId: string;
  }
): Promise<void> {
  const client = tryGetSupabaseClient();
  if (!client) return;

  const { error: updateError } = await (client.from('reviews') as any)
    .update(<Database['public']['Tables']['reviews']['Update']>{
      completed_at: new Date().toISOString(),
      result: params.result,
      next_review_date: params.nextReviewDate,
    })
    .eq('id', params.reviewId);

  if (updateError) {
    console.error('[Supabase] Failed to complete review', updateError);
    return;
  }

  const nextPayload: Database['public']['Tables']['reviews']['Insert'] = {
    user_id: params.userId,
    topic_id: params.topicId,
    scheduled_date: params.nextReviewDate,
    interval_days: params.nextIntervalDays,
  };

  const { error: insertError } = await (client.from('reviews') as any).insert([nextPayload]);

  if (insertError) {
    console.error('[Supabase] Failed to schedule next review', insertError);
  }
}

export async function touchTopicLastReviewed(topicId: string): Promise<void> {
  const client = tryGetSupabaseClient();
  if (!client) return;

  const { error } = await (client.from('topics') as any)
    .update(<Database['public']['Tables']['topics']['Update']>{
      last_reviewed: new Date().toISOString(),
    })
    .eq('id', topicId);

  if (error) {
    console.error('[Supabase] Failed to update topic last reviewed', error);
  }
}
