import {
	getSupabaseClient,
	tryGetSupabaseClient,
	isSupabaseConfigured,
} from './database/client';

export const supabase = tryGetSupabaseClient();

export { getSupabaseClient, tryGetSupabaseClient, isSupabaseConfigured };
export type { Database } from './database/types';
