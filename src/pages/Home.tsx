import { useMemo, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Flame,
  Heart,
  Map,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { PetAvatar } from '../components/PetAvatar';
import { ForgettingCurve } from '../components/ForgettingCurve';
import { LandingSection } from '../components/landing/LandingSection';
import { ActionTile } from '../components/landing/ActionTile';
import { StatMeter } from '../components/landing/StatMeter';
import { SupportCard } from '../components/landing/SupportCard';
import { usePetStats } from '../hooks/usePetStats';
import { useReviews } from '../hooks/useReviews';
import { useStore } from '../hooks/useStore';
import { t, useLocale } from '../lib/lingo';

export function Home() {
  const navigate = useNavigate();
  const { user, loading: storeLoading, syncSession } = useStore();
  const { profile, updateStreak } = usePetStats();
  const { dueReviews } = useReviews(profile?.id || null);
  const locale = useLocale();
  const [greeting, setGreeting] = useState('');

  const actionTiles = useMemo(
    () => [
      {
        to: '/teach',
        icon: BookOpen,
        title: t('nav.teach', locale),
        description: t('home.teachButton', locale),
        accentClassName: 'bg-gradient-to-br from-orange-300 via-orange-200 to-cream-50',
      },
      {
        to: '/summary',
        icon: Map,
        title: t('nav.summary', locale),
        description: t('home.summaryButton', locale),
        accentClassName: 'bg-gradient-to-br from-purple-200 via-purple-100 to-cream-50',
      },
      {
        to: '/community',
        icon: Users,
        title: t('nav.community', locale),
        description: t('home.communityButton', locale),
        accentClassName: 'bg-gradient-to-br from-pink-300 via-pink-200 to-cream-50',
      },
      {
        to: '/reviews',
        icon: Clock,
        title: t('nav.reviews', locale),
        description: 'Complete your spaced repetition reviews',
        accentClassName: 'bg-gradient-to-br from-purple-400 via-purple-300 to-cream-50',
        badgeCount: dueReviews.length,
      },
    ],
    [dueReviews.length, locale]
  );

  useEffect(() => {
    if (!profile) return;

    updateStreak();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [profile, updateStreak]);

  useEffect(() => {
    if (!storeLoading && !user) {
      navigate('/');
    }
  }, [navigate, storeLoading, user]);

  useEffect(() => {
    if (user && !profile) {
      void syncSession();
    }
  }, [user, profile, syncSession]);

  if (storeLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const displayGreeting = greeting || 'Hey there';

  return (
    <div className="min-h-screen bg-cream-50 pb-16 pt-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <LandingSection
          eyebrow="Daily emotional check-ins"
          title={`${displayGreeting}, ${profile.pet_name}! Let's make today feel lighter.`}
          description="Aomigo keeps space for big feelings, small victories, and every step in between."
          backgroundClassName="bg-gradient-to-br from-cream-50 via-orange-100 to-purple-100"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <p className="max-w-xl text-base font-semibold text-black/80 sm:text-lg">
                Build a gentle rhythm of teaching, reflecting, and celebrating progress together. We surface the next best
                action so you can focus on connection, not logistics.
              </p>

              <div className="flex flex-wrap gap-3 text-xs font-extrabold uppercase tracking-wide text-black">
                <div className="flex items-center gap-2 rounded-full border-4 border-black bg-white px-4 py-1 shadow-[4px_4px_0_#000]">
                  <Flame className="h-4 w-4" />
                  <span>{profile.day_streak} day streak</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border-4 border-black bg-white px-4 py-1 shadow-[4px_4px_0_#000]">
                  <Sparkles className="h-4 w-4" />
                  <span>Level {profile.level}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border-4 border-black bg-white px-4 py-1 shadow-[4px_4px_0_#000]">
                  <Heart className="h-4 w-4" />
                  <span>{dueReviews.length} reviews waiting</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatMeter
                  label={t('pet.intelligence', locale)}
                  value={profile.intelligence}
                  max={1000}
                  tone="orange"
                  emoji="🧠"
                  caption="Growth through insights"
                />
                <StatMeter
                  label={t('pet.health', locale)}
                  value={profile.health}
                  max={100}
                  tone="mint"
                  emoji="❤️"
                  caption="Consistency builds resilience"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/teach"
                  className="cartoon-button inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 font-bold uppercase tracking-wide text-cream-50"
                >
                  <BookOpen className="h-5 w-5" />
                  Teach together
                </Link>
                <Link
                  to="/summary"
                  className="cartoon-button inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 font-bold uppercase tracking-wide text-black"
                >
                  <Map className="h-5 w-5" />
                  View progress
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative flex w-full max-w-sm flex-col items-center gap-4 rounded-[36px] border-4 border-black bg-white p-6 text-center shadow-[6px_6px_0_#000]">
                <PetAvatar size="large" showName />
                <p className="text-base font-semibold text-black/70">
                  "{profile.pet_name} and I talk through the tough days after school. Aomigo listens, remembers, and gently
                  nudges us forward."
                </p>
              </div>
            </div>
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="Jump back in"
          title="Choose what feels right for today"
          description="Everything is organized into bold, friendly blocks so you always know the next supportive step."
          backgroundClassName="bg-gradient-to-br from-orange-200 via-cream-50 to-cream-100"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {actionTiles.map((tile) => (
              <ActionTile key={tile.to} {...tile} />
            ))}
          </div>
        </LandingSection>

        {dueReviews.length > 0 && (
          <LandingSection
            eyebrow="Gentle reminder"
            title="A few topics are ready to revisit"
            description="Short, predictable reviews help kids process their emotions in safer, repeating rhythms."
            backgroundClassName="bg-gradient-to-br from-orange-400 via-orange-300 to-cream-100"
          >
            <div className="flex flex-col gap-6 rounded-[32px] border-4 border-black bg-white p-6 shadow-[6px_6px_0_#000] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="text-5xl" aria-hidden>
                  🐾
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-black">Time to review together</h3>
                  <p className="text-sm font-semibold text-black/70 sm:text-base">
                    You have {dueReviews.length} topic{dueReviews.length !== 1 ? 's' : ''} ready for reflection. Celebrate each
                    check-in and notice how confidence grows.
                  </p>
                </div>
              </div>
              <Link
                to="/reviews"
                className="cartoon-button inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold uppercase tracking-wide text-cream-50"
              >
                <Clock className="h-5 w-5" />
                Start reviewing
              </Link>
            </div>
          </LandingSection>
        )}

        <LandingSection
          eyebrow="Built for real-life support"
          title="Anchor the day with playful structure"
          description="Modular cards keep information focused while maintaining the bold, neo-brutalist energy kids love."
          backgroundClassName="bg-gradient-to-br from-purple-200 via-cream-100 to-purple-100"
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SupportCard accentClassName="bg-orange-200" title="Co-regulation moments">
              <p>Check-in prompts blend feelings, senses, and simple language for kids processing big emotions.</p>
              <p className="flex items-center gap-2 text-black/80">
                <Shield className="h-4 w-4" />
                Trauma-informed cues keep conversations predictable and safe.
              </p>
            </SupportCard>
            <SupportCard accentClassName="bg-cream-200" title="Caregiver dashboard">
              <p>Snapshots of streaks, energy, and wins surface patterns without overwhelming detail.</p>
              <p className="flex items-center gap-2 text-black/80">
                <Sparkles className="h-4 w-4" />
                Visual meters highlight progress at a glance.
              </p>
            </SupportCard>
            <SupportCard accentClassName="bg-pink-200" title="Community inspiration">
              <p>Join other families building consistent learning rituals that honour rest and play.</p>
              <p className="flex items-center gap-2 text-black/80">
                <Users className="h-4 w-4" />
                Share celebrations or gather new activity ideas.
              </p>
            </SupportCard>
          </div>
        </LandingSection>

        <LandingSection
          eyebrow="Why spaced repetition helps"
          title="Gentle repetition keeps feelings manageable"
          description="Our schedule mirrors the forgetting curve so reminders arrive before anxiety does. Kids revisit topics with fresh perspective, reinforcing safety in every session."
          align="center"
          backgroundClassName="bg-gradient-to-br from-cream-100 via-purple-100 to-purple-200"
        >
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-[32px] border-4 border-black bg-white p-4 shadow-[6px_6px_0_#000]">
              <ForgettingCurve />
            </div>
            <p className="text-sm font-semibold text-black/70 sm:text-base">
              Each review block is tuned to the energy of a child navigating personal challenges: short, friendly, and framed by
              encouragement. The bold UI mirrors this clarity—fewer choices, bigger buttons, and unmistakable direction.
            </p>
          </div>
        </LandingSection>
      </div>
    </div>
  );
}
