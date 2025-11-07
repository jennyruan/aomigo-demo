/*
  # Add Community Features

  1. Tables Updated
    - `community_posts` - Add new columns for enhanced features:
      - `content` (text) - Full post content (500 char limit)
      - `image_url` (text) - Optional image URL or base64
      - `privacy` (text) - Sharing level: public/friends/private
      - `comment_count` (integer) - Number of comments
      - `reaction_counts` (jsonb) - Reaction counts by type
    
  2. New Tables
    - `post_comments` - Comments on community posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to community_posts)
      - `user_id` (uuid, foreign key to auth.users)
      - `pet_name` (text)
      - `content` (text, max 200 chars)
      - `likes_count` (integer)
      - `created_at` (timestamptz)
    
    - `post_likes` - Track who liked which posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to community_posts)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - Unique constraint on (post_id, user_id)
    
    - `post_reactions` - Emoji reactions on posts
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to community_posts)
      - `user_id` (uuid, foreign key to auth.users)
      - `reaction_type` (text) - celebrate/applause/thinking/idea/love
      - `created_at` (timestamptz)
      - Unique constraint on (post_id, user_id, reaction_type)

  3. Security
    - RLS enabled on all new tables
    - Users can view all public posts
    - Users can only create/edit/delete their own content
*/

-- Add new columns to community_posts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'content'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN content text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'privacy'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN privacy text DEFAULT 'public' CHECK (privacy IN ('public', 'friends', 'private'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'comment_count'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN comment_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'community_posts' AND column_name = 'reaction_counts'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN reaction_counts jsonb DEFAULT '{}';
  END IF;
END $$;

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pet_name text DEFAULT 'AOMIGO',
  content text NOT NULL CHECK (length(content) <= 200),
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments on public posts"
  ON post_comments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE community_posts.id = post_comments.post_id
      AND community_posts.privacy = 'public'
    )
  );

CREATE POLICY "Users can create own comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid()::uuid = user_id);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid()::uuid = user_id);

-- Create post_reactions table
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('celebrate', 'applause', 'thinking', 'idea', 'love')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reactions"
  ON post_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::uuid = user_id);

CREATE POLICY "Users can delete own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid()::uuid = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);

-- Function to update comment count
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET comment_count = GREATEST(0, comment_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update comment count
DROP TRIGGER IF EXISTS update_post_comment_count ON post_comments;
CREATE TRIGGER update_post_comment_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_count();

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update likes count
DROP TRIGGER IF EXISTS update_post_likes_count ON post_likes;
CREATE TRIGGER update_post_likes_count
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();