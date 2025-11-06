import type { Topic } from '../../types';
import { tryGetSupabaseClient, isSupabaseConfigured } from './client';

export async function fetchTopicsByUser(userId: string): Promise<Topic[]> {
  if (!isSupabaseConfigured) return [];
  const client = tryGetSupabaseClient();
  if (!client) return [];

  const { data, error } = await (client.from('topics') as any)
    .select('*')
    .eq('user_id', userId)
    .order('depth', { ascending: false });

  if (error) {
    console.error('[Supabase] Failed to fetch topics', error);
    return [];
  }

  return (data as Topic[] | null) ?? [];
}

export async function fetchTopicById(topicId: string): Promise<Topic | null> {
  if (!isSupabaseConfigured) return null;
  const client = tryGetSupabaseClient();
  if (!client) return null;

  const { data, error } = await (client.from('topics') as any)
    .select('*')
    .eq('id', topicId)
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Failed to fetch topic by id', error);
    return null;
  }

  return (data as Topic | null) ?? null;
}
