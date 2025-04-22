/*
  # Add Subcategories Support

  1. New Tables
    - `subcategories`
      - `id` (integer, primary key)
      - `name` (text) - Dhivehi name
      - `name_en` (text) - English name
      - `slug` (text, unique) - URL-friendly identifier
      - `category_id` (integer) - Foreign key to categories
      - `created_at` (timestamptz)

  2. Changes
    - Add subcategory_id to articles table
    - Add proper indexes and constraints
    - Add RLS policies
*/

-- Create subcategories table
CREATE TABLE subcategories (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  name_en text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id integer REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Subcategories are readable by everyone"
  ON subcategories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can modify subcategories"
  ON subcategories
  FOR ALL
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Add subcategory reference to articles
ALTER TABLE articles
ADD COLUMN subcategory_id integer REFERENCES subcategories(id);

-- Create index for better performance
CREATE INDEX subcategories_category_id_idx ON subcategories(category_id);
CREATE INDEX articles_subcategory_id_idx ON articles(subcategory_id);

-- Insert initial subcategories
INSERT INTO subcategories (name, name_en, slug, category_id)
SELECT s.name, s.name_en, s.slug, c.id
FROM (
  VALUES
    -- Politics subcategories
    ('ސަރުކާރު', 'Government Affairs', 'government-affairs', 'politics'),
    ('އިންތިޚާބު', 'Elections', 'elections', 'politics'),
    ('ޤާނޫނު', 'Legislation', 'legislation', 'politics'),
    ('ޚާރިޖީ ސިޔާސަތު', 'Foreign Policy', 'foreign-policy', 'politics'),
    ('ސިޔާސީ ޕާޓީތައް', 'Political Parties', 'political-parties', 'politics'),
    
    -- Business & Economy subcategories
    ('މާލީ ބާޒާރު', 'Financial Markets', 'financial-markets', 'business-economy'),
    ('ކުންފުނިތައް', 'Corporate News', 'corporate-news', 'business-economy'),
    ('އިޤްތިޞާދު', 'Economics', 'economics', 'business-economy'),
    ('އަމިއްލަ މާލިއްޔަތު', 'Personal Finance', 'personal-finance', 'business-economy'),
    ('ވިޔަފާރި', 'Business', 'business', 'business-economy'),
    
    -- Technology subcategories
    ('ގެޖެޓް', 'Gadgets', 'gadgets', 'technology'),
    ('އޭ.އައި', 'Artificial Intelligence', 'ai', 'technology'),
    ('ސައިބަރ ސެކިއުރިޓީ', 'Cybersecurity', 'cybersecurity', 'technology'),
    ('ސޯޝަލް މީޑިއާ', 'Social Media', 'social-media', 'technology'),
    ('ޓެކް ކުންފުނިތައް', 'Tech Companies', 'tech-companies', 'technology'),
    
    -- Sports subcategories
    ('ފުޓްބޯޅަ', 'Football', 'football', 'sports'),
    ('ބާސްކެޓް', 'Basketball', 'basketball', 'sports'),
    ('ވޮލީ', 'Volleyball', 'volleyball', 'sports'),
    ('ޓެނިސް', 'Tennis', 'tennis', 'sports'),
    ('ބެޑްމިންޓަން', 'Badminton', 'badminton', 'sports'),
    
    -- Entertainment & Arts subcategories
    ('ފިލްމު', 'Movies', 'movies', 'entertainment-arts'),
    ('ޓީވީ', 'Television', 'television', 'entertainment-arts'),
    ('މިއުޒިކް', 'Music', 'music', 'entertainment-arts'),
    ('ފަންނާނުން', 'Celebrities', 'celebrities', 'entertainment-arts'),
    ('ތިއޭޓަރ', 'Theater', 'theater', 'entertainment-arts')
) AS s(name, name_en, slug, category_slug)
JOIN categories c ON c.slug = s.category_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  category_id = EXCLUDED.category_id;