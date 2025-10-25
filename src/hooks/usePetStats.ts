import { useStore } from './useStore';
import type { PetMood } from '../types';

export function usePetStats() {
  const { profile, updateProfile } = useStore();

  function getPetMood(): PetMood {
    if (!profile) return 'happy';

    const health = profile.health;
    if (health < 20) return 'sleepy';
    if (health < 60) return 'happy';
    if (health < 85) return 'excited';
    return 'energized';
  }

  async function addIntelligence(points: number) {
    if (!profile) return;

    const newIntelligence = Math.min(1000, profile.intelligence + points);
    const newLevel = Math.min(10, Math.floor(newIntelligence / 100) + 1);

    await updateProfile({
      intelligence: newIntelligence,
      level: newLevel,
    });

    return newLevel > profile.level;
  }

  async function addHealth(points: number) {
    if (!profile) return;

    const newHealth = Math.max(0, Math.min(100, profile.health + points));
    await updateProfile({ health: newHealth });
  }

  async function updateStreak() {
    if (!profile) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = profile.last_activity_date;

    if (lastActivity === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = profile.day_streak;
    let healthChange = 0;

    if (lastActivity === yesterdayStr) {
      newStreak += 1;
      healthChange = 2;
    } else if (lastActivity < yesterdayStr) {
      const daysMissed = Math.floor(
        (new Date(today).getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
      ) - 1;
      newStreak = 0;
      healthChange = -5 * Math.min(daysMissed, 3);
    }

    await updateProfile({
      day_streak: newStreak,
      last_activity_date: today,
    });

    if (healthChange !== 0) {
      await addHealth(healthChange);
    }

    return newStreak;
  }

  return {
    profile,
    mood: getPetMood(),
    addIntelligence,
    addHealth,
    updateStreak,
  };
}
