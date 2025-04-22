/*
  # Create ads table for business dashboard

  1. New Tables
    - `ads`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `target_audience` (text, nullable)
      - `budget` (numeric, nullable)
      - `status` (text) - can be 'active', 'paused', or 'deleted'
      - `media_url` (text)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `ads` table
    - Add policies for:
      - Users can read their own ads
      - Users can insert their own ads
      - Users can update their own ads
      - Users can delete their own ads
*/

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  target_audience text,
  budget numeric,
  status text NOT NULL DEFAULT 'active',
  media_url text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add constraint to validate status values
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'deleted'))
);

-- Enable RLS
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own ads"
  ON ads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ads"
  ON ads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ads"
  ON ads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ads"
  ON ads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX ads_user_id_idx ON ads(user_id);
CREATE INDEX ads_status_idx ON ads(status);
CREATE INDEX ads_created_at_idx ON ads(created_at);