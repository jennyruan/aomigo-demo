/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TeachingSession } from '../../types';
import { tryGetSupabaseClient, isSupabaseConfigured } from './client';
import { insertReview } from './reviews';

export async function fetchRecentTeachingHistory(
  userId: string,
  limit: number = 5
): Promise<Array<Pick<TeachingSession, 'raw_input' | 'extracted_topics'>>> {
  if (!isSupabaseConfigured) return [];
  const client = tryGetSupabaseClient();
  if (!client) return [];

  const { data, error } = await (client.from('teaching_sessions') as any)
    .select('raw_input, extracted_topics')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to fetch recent teaching sessions', error);
    return [];
  }

  return (data as TeachingSession[] | null)?.map((session) => ({
    raw_input: session.raw_input,
    extracted_topics: session.extracted_topics,
  })) ?? [];
}

export async function recordTeachingSession(entry: {
  userId: string;
  sessionId: string;
  inputType: TeachingSession['input_type'];
  rawInput: string;
  extractedTopics: string[];
  followUpQuestion: string;
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = tryGetSupabaseClient();
  if (!client) return;

  const payload = {
    user_id: entry.userId,
    session_id: entry.sessionId,
    input_type: entry.inputType,
    raw_input: entry.rawInput,
    extracted_topics: entry.extractedTopics,
    follow_up_question: entry.followUpQuestion,
  };

  const { error } = await (client.from('teaching_sessions') as any).insert([payload]);

  if (error) {
    console.error('[Supabase] Failed to record teaching session', error);
  }
}

export async function upsertTopicWithInitialReview(params: {
  userId: string;
  topicName: string;
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = tryGetSupabaseClient();
  if (!client) return;

  const topicsTable = client.from('topics') as any;

  const { data: existing } = await topicsTable
    .select('*')
    .eq('user_id', params.userId)
    .eq('topic_name', params.topicName)
    .maybeSingle();

  if (existing) {
    await topicsTable
      .update({
        depth: (existing.depth || 0) + 1,
        last_reviewed: new Date().toISOString(),
      })
      .eq('id', existing.id);
    return;
  }

  const { data: newTopic, error } = await topicsTable
    .insert([
      {
        user_id: params.userId,
        topic_name: params.topicName,
        depth: 1,
      },
    ])
    .select()
    .single();

  if (error || !newTopic) {
    console.error('[Supabase] Failed to create topic', error);
    return;
  }

  const scheduledDate = new Date();
  scheduledDate.setMinutes(scheduledDate.getMinutes() + 10);

  await insertReview({
    userId: params.userId,
    topicId: newTopic.id,
    scheduledDate: scheduledDate.toISOString(),
    intervalDays: 0,
  });
}

export async function updateTeachingSessionAnswer(params: {
  sessionId: string;
  answer: string;
  qualityScore: number;
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  const client = tryGetSupabaseClient();
  if (!client) return;

  const { error } = await (client.from('teaching_sessions') as any)
    .update({
      user_answer: params.answer,
      quality_score: params.qualityScore,
      intelligence_gain: Math.floor(params.qualityScore / 10),
      health_change: params.qualityScore > 70 ? 3 : 1,
    })
    .eq('session_id', params.sessionId);

  if (error) {
    console.error('[Supabase] Failed to update teaching session answer', error);
  }
}

export async function fetchTeachingSessionsByUser(
  userId: string,
  limit: number = 10
): Promise<TeachingSession[]> {
  if (!isSupabaseConfigured) return [];
  const client = tryGetSupabaseClient();
  if (!client) return [];

  const { data, error } = await (client.from('teaching_sessions') as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] Failed to fetch teaching sessions', error);
    return [];
  }

  return (data as TeachingSession[] | null) ?? [];
}
