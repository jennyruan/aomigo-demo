import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, tryGetFirebaseAuth, signOut as firebaseSignOut } from '../lib/firebase';
import { apiClient } from '../lib/api/client';
import type { UserProfile } from '../types';

export type BasicUser = { id: string; email?: string } | null;

interface StoreValue {
  user: BasicUser;
  firebaseUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  refreshProfile(): Promise<void>;
  updateProfile(updates: Partial<UserProfile>): Promise<void>;
  signOut(): Promise<void>;
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
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const auth = useMemo(() => tryGetFirebaseAuth(), []);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth?.currentUser ?? null);
  const [user, setUser] = useState<BasicUser>(firebaseUser ? { id: firebaseUser.uid, email: firebaseUser.email ?? undefined } : null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = false;

  useEffect(() => {
    const unsubscribe = onAuthChange(async (nextUser) => {
      setFirebaseUser(nextUser);
      if (!nextUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // Don't automatically fetch the profile on auth state change.
      // Many pages (like the home/landing) don't need the profile immediately
      // and calling the protected `/profiles/me` endpoint on every auth event
      // can surface 401s if a token isn't available yet. Provide an explicit
      // `refreshProfile()` for components that need server-side profile data.
      setUser({ id: nextUser.uid, email: nextUser.email ?? undefined });
      setLoading(false);
    });

    return () => {
      try {
        unsubscribe?.();
      } catch (error) {
        console.error('[Store] Failed to clean up auth listener', error);
      }
    };
  }, []);

  async function refreshProfile() {
    if (!firebaseUser) return;
    try {
      const remoteProfile = await apiClient.withAuth<any>(firebaseUser, '/api/v1/profiles/me');
      setProfile(mapProfile(remoteProfile));
    } catch (error) {
      console.error('[Store] Failed to refresh profile', error);
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!firebaseUser) return;
    try {
      const payload = {
        ...updates,
      };
      const remoteProfile = await apiClient.withAuth<any>(firebaseUser, '/api/v1/profiles/me', 'PATCH', payload);
      setProfile(mapProfile(remoteProfile));
    } catch (error) {
      console.error('[Store] Failed to update profile', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut();
    } finally {
      setFirebaseUser(null);
      setUser(null);
      setProfile(null);
    }
  }

  const value: StoreValue = {
    user,
    firebaseUser,
    profile,
    loading,
    isDemoMode,
    refreshProfile,
    updateProfile,
    signOut,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}
