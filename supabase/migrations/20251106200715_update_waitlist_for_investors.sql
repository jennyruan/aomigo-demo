/*
  # Update Waitlist Table for Investors and Demo Users

  1. Changes to `waitlist` table
    - Add `last_name` (text, optional)
    - Add `phone_number` (text, optional)
    - Add `linkedin_url` (text, optional)
    - Add `message` (text, optional)
    - Add `user_type` (text, default 'demo') - can be 'demo', 'investor', or 'both'
    - Rename `is_parent` to `is_parent_demo_user` for clarity
  
  2. Security
    - Maintain existing RLS policies
    - Anyone can still sign up (INSERT)
  
  3. Notes
    - user_type helps distinguish between demo signups and investor inquiries
    - All new fields are optional to allow flexibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN last_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN phone_number text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'linkedin_url'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN linkedin_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'message'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN message text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waitlist' AND column_name = 'user_type'
  ) THEN
    ALTER TABLE waitlist ADD COLUMN user_type text DEFAULT 'demo';
  END IF;
END $$;

ALTER TABLE waitlist RENAME COLUMN is_parent TO is_parent_demo_user;

CREATE INDEX IF NOT EXISTS idx_waitlist_user_type ON waitlist(user_type);
