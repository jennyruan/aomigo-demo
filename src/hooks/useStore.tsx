import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, apiClient } from '../lib/api/client';
import type { UserProfile } from '../types';
import { auth, signOut as firebaseSignOut } from '../lib/firebase';

export type BasicUser = { id: string; email?: string } | null;

interface StoreValue {
  user: BasicUser;
  profile: UserProfile | null;
  loading: boolean;
  createProfile(defaults?: Partial<UserProfile>): Promise<void>;
  refreshProfile(): Promise<void>;
  updateProfile(updates: Partial<UserProfile>): Promise<void>;
  signOut(): Promise<void>;
  syncSession(): Promise<void>;
}

const StoreContext = createContext<StoreValue | undefined>(undefined);

function mapProfile(dto: any): UserProfile {
  return {
    id: dto.id,
    pet_name: dto.pet_name ?? 'AOMIGO',
    intelligence: dto.intelligence ?? 0,
    health: dto.health ?? 100,
    level: dto.level ?? 1,
    day_streak: dto.day_streak ?? 0,
    last_activity_date: dto.last_activity_date ?? new Date().toISOString().split('T')[0],
    language_preference: dto.language_preference ?? 'en',
    created_at: dto.created_at ?? new Date().toISOString(),
    updated_at: dto.updated_at ?? new Date().toISOString(),
    display_name: dto.display_name ?? null,
    organization_name: dto.organization_name ?? null,
    avatar_config: dto.avatar_config ?? null,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BasicUser>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const buildAuthHeaders = useCallback((activeUser?: BasicUser): Record<string, string> => {
    let source = activeUser ?? user;

    if (!source) {
      const current = auth.currentUser;
      if (!current) {
        return {};
      }

      source = {
        id: current.uid,
        email: current.email ?? undefined,
      };
    }

    const headers: Record<string, string> = {
      'X-User-Id': source.id,
    };

    if (source.email) {
      headers['X-User-Email'] = source.email;
    }

    return headers;
  }, [user]);

  const fetchProfile = useCallback(async (nextUser?: BasicUser) => {
    const activeUser = nextUser ?? user;
    if (!activeUser) {
      setProfile(null);
      return;
    }

    try {
      const remoteProfile = await apiClient.request<any>('/api/v1/profiles/me', {
        headers: buildAuthHeaders(activeUser),
        skipNotFound: true,
      });

      if (!remoteProfile) {
        setProfile(null);
        return;
      }

      setProfile(mapProfile(remoteProfile));
    } catch (error) {
      console.error('[Store] Failed to load profile', error);
    }
  }, [buildAuthHeaders, user]);

  const createProfile = useCallback(async (defaults?: Partial<UserProfile>) => {
    try {
      const body = defaults && Object.keys(defaults).length > 0 ? defaults : undefined;
      const result = await apiClient.request<any>('/api/v1/profiles/me', {
        method: 'POST',
        body,
        headers: buildAuthHeaders(),
      });
      setProfile(mapProfile(result));
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        await fetchProfile();
        return;
      }

      console.error('[Store] Failed to create profile', error);
      throw error;
    }
  }, [buildAuthHeaders, fetchProfile]);

  const syncSession = useCallback(async () => {
    setLoading(true);
    try {
      const current = auth.currentUser;

      if (current) {
        const nextUser: BasicUser = {
          id: current.uid,
          email: current.email ?? undefined,
        };

        setUser((prev) => {
          if (prev && prev.id === nextUser.id && prev.email === nextUser.email) {
            return prev;
          }
          return nextUser;
        });

        await fetchProfile(nextUser);
      } else {
        setUser((prev) => (prev ? null : prev));
        setProfile((prev) => (prev ? null : prev));
      }
    } catch (error) {
      console.warn('[Store] Session lookup failed, clearing session', error);
      setUser((prev) => (prev ? null : prev));
      setProfile((prev) => (prev ? null : prev));
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new Error('Cannot update profile while signed out');
    }

    try {
      const payload = await apiClient.request<any>('/api/v1/profiles/me', {
        method: 'PATCH',
        body: updates,
        headers: buildAuthHeaders(user),
      });
      setProfile(mapProfile(payload));
    } catch (error) {
      console.error('[Store] Failed to update profile', error);
      throw error;
    }
  }, [buildAuthHeaders, user]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut();
    } catch (error) {
      console.warn('[Store] Sign-out failed', error);
    }

    setUser(null);
    setProfile(null);
  }, []);

  const value: StoreValue = useMemo(
    () => ({
      user,
      profile,
      loading,
      createProfile,
      refreshProfile,
      updateProfile,
      signOut,
      syncSession,
    }),
    [user, profile, loading, createProfile, refreshProfile, updateProfile, signOut, syncSession]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
