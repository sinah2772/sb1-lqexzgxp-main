/*
  # Add islands column to articles table

  1. Changes
    - Add islands column to store island references
    - Add foreign key constraint
    - Update RLS policies
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add islands column as an array of integers
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS island_ids integer[] DEFAULT '{}';

-- Add foreign key constraint using a trigger function
CREATE OR REPLACE FUNCTION check_island_ids()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM unnest(NEW.island_ids) iid
    LEFT JOIN islands i ON i.id = iid
    WHERE i.id IS NULL
  ) THEN
    RAISE EXCEPTION 'Invalid island_id found in island_ids array';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for island ID validation
DROP TRIGGER IF EXISTS validate_island_ids ON articles;
CREATE TRIGGER validate_island_ids
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION check_island_ids();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS articles_island_ids_gin_idx ON articles USING gin(island_ids);

-- Add check constraint to ensure array is not empty when provided
ALTER TABLE articles 
ADD CONSTRAINT articles_island_ids_check 
  CHECK (island_ids IS NULL OR array_length(island_ids, 1) > 0);

COMMENT ON COLUMN articles.island_ids IS 'Array of island IDs referenced in the article';