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

const sizeStyles = {
  small: {
    width: '64px',
    height: '64px',
    minWidth: '64px',
    minHeight: '64px',
    maxWidth: '64px',
    maxHeight: '64px',
  },
  medium: {
    width: '128px',
    height: '128px',
    minWidth: '128px',
    minHeight: '128px',
    maxWidth: '128px',
    maxHeight: '128px',
  },
  large: {
    width: '200px',
    height: '200px',
    minWidth: '200px',
    minHeight: '200px',
    maxWidth: '200px',
    maxHeight: '200px',
  },
};

const sizeClasses = {
  small: 'text-3xl',
  medium: 'text-6xl',
  large: 'text-8xl',
};

export function PetAvatar({ size = 'medium', showName = false }: PetAvatarProps) {
  const { profile, mood } = usePetStats();

  if (!profile) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center`}
        style={{
          ...sizeStyles[size],
          borderRadius: '50%',
          aspectRatio: '1 / 1',
        }}
      >
        <span className="text-6xl">🐶</span>
      </div>
    );
  }

  const emoji = moodEmojis[mood];
  const gradient = moodColors[mood];
  const animation = mood !== 'sleepy' ? moodAnimations[mood] : '';

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center cartoon-border relative ${animation}`}
        style={{
          ...sizeStyles[size],
          borderRadius: '50%',
          aspectRatio: '1 / 1',
          animationDuration: '2s',
        }}
      >
        <span>{emoji}</span>

        <div
          className="absolute -top-4 -right-4 cartoon-border bg-orange-500 rounded-full flex items-center justify-center"
          style={{
            width: '56px',
            height: '56px',
            minWidth: '56px',
            minHeight: '56px',
            borderRadius: '50%',
            aspectRatio: '1 / 1',
          }}
        >
          <span className="text-3xl">🎃</span>
        </div>

        {mood === 'energized' && (
          <>
            <div className="absolute -top-2 -left-2 text-yellow-300 animate-ping text-3xl">✨</div>
            <div className="absolute -bottom-2 -right-2 text-yellow-300 animate-ping text-3xl" style={{ animationDelay: '0.5s' }}>✨</div>
          </>
        )}
      </div>

      {showName && (
        <div className="cartoon-border bg-white px-6 py-2 rounded-full">
          <span className="text-gray-900 font-bold text-lg">{profile.pet_name}</span>
        </div>
      )}
    </div>
  );
}
