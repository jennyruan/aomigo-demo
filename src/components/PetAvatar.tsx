import { usePetStats } from '../hooks/usePetStats';
import type { PetMood } from '../types';

interface PetAvatarProps {
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
}

const moodEmojis: Record<PetMood, string> = {
  sleepy: '😴',
  happy: '🙂',
  excited: '😺',
  energized: '🐯',
};

const moodColors: Record<PetMood, string> = {
  sleepy: 'from-gray-400 to-gray-500',
  happy: 'from-orange-400 to-orange-500',
  excited: 'from-orange-500 to-orange-600',
  energized: 'from-orange-600 to-purple-600',
};

const moodAnimations: Record<PetMood, string> = {
  sleepy: 'animate-pulse',
  happy: 'animate-bounce',
  excited: 'animate-bounce',
  energized: 'animate-bounce',
};

const sizeClasses = {
  small: 'w-16 h-16 text-3xl',
  medium: 'w-32 h-32 text-6xl',
  large: 'w-48 h-48 text-8xl',
};

export function PetAvatar({ size = 'medium', showName = false }: PetAvatarProps) {
  const { profile, mood } = usePetStats();

  if (!profile) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center`}>
        <span className="text-6xl">🐶</span>
      </div>
    );
  }

  const emoji = moodEmojis[mood];
  const gradient = moodColors[mood];
  const animation = mood !== 'sleepy' ? moodAnimations[mood] : '';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-orange-200 border-4 border-orange-100 relative ${animation}`}
        style={{ animationDuration: '2s' }}
      >
        <span>{emoji}</span>

        <div className="absolute -top-2 -right-2">
          <span className="text-2xl">🎃</span>
        </div>

        {mood === 'energized' && (
          <>
            <div className="absolute -top-1 -left-1 text-yellow-400 animate-ping">✨</div>
            <div className="absolute -bottom-1 -right-1 text-yellow-400 animate-ping" style={{ animationDelay: '0.5s' }}>✨</div>
          </>
        )}
      </div>

      {showName && (
        <div className="bg-orange-100 px-4 py-1 rounded-full">
          <span className="text-brown-700 font-semibold">{profile.pet_name}</span>
        </div>
      )}
    </div>
  );
}
