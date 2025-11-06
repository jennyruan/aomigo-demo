/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserProfile } from '../../types';
import type { Database } from './types';
import { tryGetSupabaseClient } from './client';

export async function fetchProfileById(userId: string): Promise<UserProfile | null> {
  const client = tryGetSupabaseClient();
  if (!client) return null;

  const { data, error } = await (client.from('users_profile') as any)
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[Supabase] Failed to fetch profile', error);
    return null;
  }

  return (data as UserProfile | null) ?? null;
}

export async function createProfile(initialProfile: Database['public']['Tables']['users_profile']['Insert']): Promise<UserProfile | null> {
  const client = tryGetSupabaseClient();
  if (!client) return null;

  const { data, error } = await (client.from('users_profile') as any)
    .insert([initialProfile])
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to create profile', error);
    return null;
  }

  return data as UserProfile;
}

export async function updateProfileById(
  userId: string,
  updates: Database['public']['Tables']['users_profile']['Update']
): Promise<UserProfile | null> {
  const client = tryGetSupabaseClient();
  if (!client) return null;

  const { data, error } = await (client.from('users_profile') as any)
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to update profile', error);
    return null;
  }

  return data as UserProfile;
}
