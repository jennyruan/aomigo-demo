import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

function getInitialDemoState() {
  try {
    const demoData = localStorage.getItem('aomigo_demo_profile');
    if (demoData) {
      const profile = JSON.parse(demoData);
      return {
        user: { id: profile.id },
        profile,
        loading: false,
        isDemoMode: true,
      };
    }
  } catch (error) {
    console.error('Error reading demo data:', error);
  }
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
  const [isDemoMode, setIsDemoMode] = useState(initial.isDemoMode);

  useEffect(() => {
    if (initial.isDemoMode) {
      return;
    }

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const demoData = localStorage.getItem('aomigo_demo_profile');
      if (demoData) {
        const demoProfile = JSON.parse(demoData);
        setProfile(demoProfile);
        setUser({ id: demoProfile.id });
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (!data) {
        const newProfile: Omit<UserProfile, 'created_at' | 'updated_at'> = {
          id: userId,
          pet_name: 'Aomigo',
          intelligence: 0,
          health: 100,
          level: 1,
          day_streak: 0,
          last_activity_date: new Date().toISOString().split('T')[0],
          language_preference: 'en',
        };

        const { data: inserted } = await supabase
          .from('users_profile')
          .insert([newProfile])
          .select()
          .single();

        setProfile(inserted || { ...newProfile, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (isDemoMode) {
      const updated = { ...profile, ...updates };
      setProfile(updated as UserProfile);
      localStorage.setItem('aomigo_demo_profile', JSON.stringify(updated));
      return;
    }

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users_profile')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  async function signInDemo() {
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    const demoProfile: UserProfile = {
      id: generateUUID(),
      pet_name: 'Aomigo',
      intelligence: 50,
      health: 100,
      level: 1,
      day_streak: 2,
      last_activity_date: new Date().toISOString().split('T')[0],
      language_preference: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('aomigo_demo_profile', JSON.stringify(demoProfile));
    setProfile(demoProfile);
    setIsDemoMode(true);
    setUser({ id: demoProfile.id });
  }

  async function signOut() {
    if (isDemoMode) {
      localStorage.removeItem('aomigo_demo_profile');
      setProfile(null);
      setIsDemoMode(false);
      setUser(null);
    } else {
      await supabase.auth.signOut();
    }
  }

  return {
    user,
    profile,
    loading,
    isDemoMode,
    updateProfile,
    signInDemo,
    signOut,
  };
}
