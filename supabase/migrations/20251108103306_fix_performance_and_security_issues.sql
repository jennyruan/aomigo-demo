/*
  # Fix Database Performance and Security Issues

  ## Overview
  This migration resolves critical performance and security issues identified by Supabase's performance advisor.

  ## Changes Made

  ### 1. Add Missing Foreign Key Indexes
  Indexes are added for all foreign keys without covering indexes to improve query performance:
  - `achievements(user_id)` - Index for user's achievements lookups
  - `community_posts(user_id)` - Index for user's posts lookups
  - `post_comments(user_id)` - Index for user's comments lookups
  - `post_likes(user_id)` - Index for user's likes lookups
  - `post_reactions(user_id)` - Index for user's reactions lookups
  - `reviews(topic_id)` - Index for topic-specific review lookups

  ### 2. Optimize RLS Policies
  All RLS policies updated to use `(select auth.uid())` instead of `auth.uid()` to prevent 
  re-evaluation for each row, significantly improving query performance at scale.
  
  Tables updated:
  - `users_profile` (3 policies)
  - `teaching_sessions` (2 policies)
  - `topics` (3 policies)
  - `reviews` (3 policies)
  - `community_posts` (3 policies)
  - `achievements` (2 policies)
  - `post_comments` (2 policies)
  - `post_likes` (2 policies)
  - `post_reactions` (2 policies)
  - `users` (2 policies)
  - `user_sessions` (1 policy)

  ### 3. Fix Function Security
  Add `SET search_path = ''` to all functions to prevent search path manipulation attacks:
  - `update_comment_count()`
  - `update_likes_count()`
  - `update_updated_at_column()`

  ### 4. Important Notes
  - Unused indexes are kept as they will be needed once the application scales
  - Password leak protection must be enabled in Supabase Dashboard:
    Navigate to Authentication > Policies > Enable "Leaked Password Protection"
*/

-- =====================================================
-- SECTION 1: Add Missing Foreign Key Indexes
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_topic_id ON reviews(topic_id);

-- =====================================================
-- SECTION 2: Optimize RLS Policies
-- =====================================================

-- Drop and recreate all affected policies with optimized auth function calls

-- users_profile policies
DROP POLICY IF EXISTS "Users can view own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON users_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON users_profile;

CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING ((select auth.uid())::uuid = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::uuid = id)
  WITH CHECK ((select auth.uid())::uuid = id);

-- teaching_sessions policies
DROP POLICY IF EXISTS "Users can view own sessions" ON teaching_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON teaching_sessions;

CREATE POLICY "Users can view own sessions"
  ON teaching_sessions FOR SELECT
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can insert own sessions"
  ON teaching_sessions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

-- topics policies
DROP POLICY IF EXISTS "Users can view own topics" ON topics;
DROP POLICY IF EXISTS "Users can insert own topics" ON topics;
DROP POLICY IF EXISTS "Users can update own topics" ON topics;

CREATE POLICY "Users can view own topics"
  ON topics FOR SELECT
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can insert own topics"
  ON topics FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can update own topics"
  ON topics FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id)
  WITH CHECK ((select auth.uid())::uuid = user_id);

-- reviews policies
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id)
  WITH CHECK ((select auth.uid())::uuid = user_id);

-- community_posts policies
DROP POLICY IF EXISTS "Users can insert own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;

CREATE POLICY "Users can insert own posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id)
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can delete own posts"
  ON community_posts FOR DELETE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

-- achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

-- post_comments policies
DROP POLICY IF EXISTS "Users can create own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;

CREATE POLICY "Users can create own comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

-- post_likes policies
DROP POLICY IF EXISTS "Users can create own likes" ON post_likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON post_likes;

CREATE POLICY "Users can create own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

-- post_reactions policies
DROP POLICY IF EXISTS "Users can create own reactions" ON post_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON post_reactions;

CREATE POLICY "Users can create own reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::uuid = user_id);

CREATE POLICY "Users can delete own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING ((select auth.uid())::uuid = user_id);

-- users policies
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid())::uuid = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::uuid = id)
  WITH CHECK ((select auth.uid())::uuid = id);

-- user_sessions policies
DROP POLICY IF EXISTS "Users can read own sessions" ON user_sessions;

CREATE POLICY "Users can read own sessions"
  ON user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::uuid);

-- =====================================================
-- SECTION 3: Fix Function Security
-- =====================================================

-- Recreate update_comment_count with security definer and search path
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comment_count = GREATEST(0, comment_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Recreate update_likes_count with security definer and search path
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Recreate update_updated_at_column with security definer and search path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;