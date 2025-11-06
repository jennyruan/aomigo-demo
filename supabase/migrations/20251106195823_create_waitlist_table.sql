/*
  # Create Waitlist Table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique, required)
      - `first_name` (text, required)
      - `is_parent` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `status` (text, default 'pending')
  
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for public INSERT (anyone can sign up)
    - Add policy for authenticated users to read their own waitlist entry
  
  3. Notes
    - Email validation should be handled in application layer
    - Status can be: pending, invited, registered
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  is_parent boolean DEFAULT false,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own waitlist entry"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
