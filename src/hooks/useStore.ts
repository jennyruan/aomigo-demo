import { useState, useEffect, useMemo } from 'react';
import { tryGetSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { onAuthChange, tryGetFirebaseAuth, signOut as firebaseSignOut } from '../lib/firebase';
import type { UserProfile } from '../types';
import {
  createProfile,
  fetchProfileById,
  updateProfileById,
} from '../lib/database/profiles';

function getInitialDemoState() {
  return {
    user: null,
    profile: null,
    loading: true,
    isDemoMode: false,
  };
}

export function useStore() {
  const initial = getInitialDemoState();
  const [user, setUser] = useState<any>(initial.user);
  const [profile, setProfile] = useState<UserProfile | null>(initial.profile);
  const [loading, setLoading] = useState(initial.loading);
  const [isDemoMode] = useState(initial.isDemoMode);
  const supabase = useMemo(() => tryGetSupabaseClient(), []);

  useEffect(() => {
    if (initial.isDemoMode) {
      return;
    }

    checkUser();

    const unsubscribe = onAuthChange(async (fbUser) => {
      if (fbUser) {
        const uid = fbUser.uid;
        setUser({ id: uid, email: fbUser.email ?? undefined });
        try {
          await loadProfile(uid);
        } catch (err) {
          console.error('[Store] Failed to load profile after auth change', err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      try {
        unsubscribe?.();
      } catch (_) {
      }
    };
  }, [initial.isDemoMode]);

  async function checkUser() {
    try {
      const auth = tryGetFirebaseAuth();
      const fbUser = auth?.currentUser ?? null;
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser({ id: fbUser.uid, email: fbUser.email ?? undefined });
      await loadProfile(fbUser.uid);
    } catch (error) {
      console.error('[Store] Failed to check user', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userId: string) {
    try {
      if (!supabase || !isSupabaseConfigured) {
        setProfile(null);
        return;
      }

      const existingProfile = await fetchProfileById(userId);
      if (existingProfile) {
        setProfile(existingProfile);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const timestamp = new Date().toISOString();
      const newProfile = {
        id: userId,
        pet_name: 'AOMIGO',
        intelligence: 0,
        health: 100,
        level: 1,
        day_streak: 0,
        last_activity_date: today,
        language_preference: 'en',
        created_at: timestamp,
        updated_at: timestamp,
      } satisfies Parameters<typeof createProfile>[0];

      const created = await createProfile(newProfile);
      setProfile(created ?? newProfile);
    } catch (error) {
      console.error('[Store] Failed to load profile', error);
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user || !supabase || !isSupabaseConfigured) return;

    try {
      const updated = await updateProfileById(user.id, updates);
      if (updated) {
        setProfile(updated);
      }
    } catch (error) {
      console.error('[Store] Failed to update profile', error);
    }
  }
  async function signOut() {
    const auth = tryGetFirebaseAuth();
    if (auth) {
      await firebaseSignOut();
    } else if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  }

  return {
    user,
    profile,
    loading,
    isDemoMode,
    updateProfile,
    signOut,
  };
}
