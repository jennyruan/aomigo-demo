/*
  # AOMIGO Database Schema

  ## Overview
  Complete database schema for AOMIGO - an AI-powered learning companion app
  with spaced repetition, knowledge mapping, and pet development features.

  ## Tables Created
  
  ### 1. users_profile
  Extended user profile for AOMIGO users
  - id (uuid, FK to auth.users)
  - pet_name (text) - Name of user's pet companion
  - intelligence (integer) - Pet intelligence score (0-1000)
  - health (integer) - Pet health score (0-100)
  - level (integer) - Current pet level
  - day_streak (integer) - Consecutive days of learning
  - last_activity_date (date) - Last teaching session date
  - language_preference (text) - UI language (en/zh)
  - created_at (timestamptz)
  - updated_at (timestamptz)

  ### 2. teaching_sessions
  Records of all teaching sessions
  - id (uuid, PK)
  - user_id (uuid, FK)
  - session_id (text) - Unique session identifier
  - input_type (text) - text/voice/image
  - raw_input (text) - User's original input
  - extracted_topics (text[]) - Array of topic strings
  - follow_up_question (text) - AI-generated question
  - user_answer (text) - User's answer to follow-up
  - quality_score (integer) - 0-100 quality rating
  - intelligence_gain (integer) - XP gained
  - health_change (integer) - Health points changed
  - created_at (timestamptz)

  ### 3. topics
  Knowledge graph topics
  - id (uuid, PK)
  - user_id (uuid, FK)
  - topic_name (text) - Name of the topic
  - depth (integer) - Knowledge depth score
  - first_learned (timestamptz) - When first taught
  - last_reviewed (timestamptz) - Last review date
  - review_count (integer) - Number of reviews completed
  - mastery_level (integer) - 0-5 mastery rating
  - connections (text[]) - Array of connected topic IDs
  - metadata (jsonb) - Additional topic data

  ### 4. reviews
  Spaced repetition review schedule
  - id (uuid, PK)
  - user_id (uuid, FK)
  - topic_id (uuid, FK)
  - scheduled_date (timestamptz) - When review is due
  - interval_days (integer) - Current interval (1,3,7,14,30,60)
  - completed_at (timestamptz) - When review was completed
  - result (text) - good/poor/skipped
  - next_review_date (timestamptz) - Next scheduled review

  ### 5. community_posts
  Social feed posts from pets
  - id (uuid, PK)
  - user_id (uuid, FK)
  - pet_name (text)
  - summary_text (text) - Auto-generated learning summary
  - topics_learned (text[]) - Topics covered today
  - post_date (date)
  - likes_count (integer)
  - created_at (timestamptz)

  ### 6. achievements
  User achievements and badges
  - id (uuid, PK)
  - user_id (uuid, FK)
  - achievement_type (text) - streak_7/topics_100/perfect_week
  - unlocked_at (timestamptz)
  - metadata (jsonb)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Community posts are publicly readable but only owner can create/modify
*/

-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_name text DEFAULT 'AOMIGO',
  intelligence integer DEFAULT 0 CHECK (intelligence >= 0 AND intelligence <= 1000),
  health integer DEFAULT 100 CHECK (health >= 0 AND health <= 100),
  level integer DEFAULT 1 CHECK (level >= 1 AND level <= 10),
  day_streak integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  language_preference text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create teaching_sessions table
CREATE TABLE IF NOT EXISTS teaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id text NOT NULL,
  input_type text DEFAULT 'text' CHECK (input_type IN ('text', 'voice', 'image')),
  raw_input text NOT NULL,
  extracted_topics text[] DEFAULT '{}',
  follow_up_question text,
  user_answer text,
  quality_score integer DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  intelligence_gain integer DEFAULT 0,
  health_change integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE teaching_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON teaching_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON teaching_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_name text NOT NULL,
  depth integer DEFAULT 1 CHECK (depth >= 0),
  first_learned timestamptz DEFAULT now(),
  last_reviewed timestamptz DEFAULT now(),
  review_count integer DEFAULT 0,
  mastery_level integer DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
  connections text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  UNIQUE(user_id, topic_name)
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topics"
  ON topics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topics"
  ON topics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topics"
  ON topics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  scheduled_date timestamptz NOT NULL,
  interval_days integer DEFAULT 1,
  completed_at timestamptz,
  result text CHECK (result IN ('good', 'poor', 'skipped')),
  next_review_date timestamptz
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_name text DEFAULT 'AOMIGO',
  summary_text text NOT NULL,
  topics_learned text[] DEFAULT '{}',
  post_date date DEFAULT CURRENT_DATE,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_teaching_sessions_user_id ON teaching_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_teaching_sessions_created_at ON teaching_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id_scheduled ON reviews(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users_profile
DROP TRIGGER IF EXISTS update_users_profile_updated_at ON users_profile;
CREATE TRIGGER update_users_profile_updated_at
  BEFORE UPDATE ON users_profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();