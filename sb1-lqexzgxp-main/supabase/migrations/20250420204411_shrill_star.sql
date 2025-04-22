-- Add remaining subcategories
INSERT INTO subcategories (name, name_en, slug, category_id)
SELECT s.name, s.name_en, s.slug, c.id
FROM (
  VALUES
    -- Science subcategories
    ('ބައްޓަން', 'Space Exploration', 'space-exploration', 'science'),
    ('ދިރޭތަކެތި', 'Biology', 'biology', 'science'),
    ('ފިޒިކްސް', 'Physics', 'physics', 'science'),
    ('ދިރާސާ', 'Research', 'research', 'science'),
    ('މޫސުމަށް އަންނަ ބަދަލު', 'Climate Science', 'climate-science', 'science'),

    -- Health & Medicine subcategories
    ('މެޑިކަލް ދިރާސާ', 'Medical Research', 'medical-research', 'health-medicine'),
    ('އާންމު ޞިއްޙަތު', 'Public Health', 'public-health', 'health-medicine'),
    ('ނަފްސާނީ ޞިއްޙަތު', 'Mental Health', 'mental-health', 'health-medicine'),
    ('ކާނާ', 'Nutrition', 'nutrition', 'health-medicine'),
    ('ދުޅަހެޔޮކަން', 'Fitness', 'fitness', 'health-medicine'),

    -- Environment subcategories
    ('މޫސުމަށް އަންނަ ބަދަލު', 'Climate Change', 'climate-change', 'environment'),
    ('ޙިމާޔަތްކުރުން', 'Conservation', 'conservation', 'environment'),
    ('ތަޣައްޔަރުވުން', 'Pollution', 'pollution', 'environment'),
    ('އިޔާދަކުރަނިވި ހަކަތަ', 'Renewable Energy', 'renewable-energy', 'environment'),
    ('ގުދުރަތީ ކާރިސާ', 'Natural Disasters', 'natural-disasters', 'environment'),

    -- Education subcategories
    ('ސްކޫލް', 'Schools', 'schools', 'education'),
    ('މަތީ ތަޢުލީމް', 'Higher Education', 'higher-education', 'education'),
    ('ތަޢުލީމީ ސިޔާސަތު', 'Education Policy', 'education-policy', 'education'),
    ('އޮންލައިން ތަޢުލީމް', 'Online Learning', 'online-learning', 'education'),
    ('ފަންނީ ތަމްރީން', 'Vocational Training', 'vocational-training', 'education'),

    -- World News subcategories
    ('އޭޝިއާ', 'Asia', 'asia', 'world-news'),
    ('ޔޫރަޕް', 'Europe', 'europe', 'world-news'),
    ('އެމެރިކާ', 'Americas', 'americas', 'world-news'),
    ('އެފްރިކާ', 'Africa', 'africa', 'world-news'),
    ('މެދުއިރުމަތި', 'Middle East', 'middle-east', 'world-news'),

    -- National News subcategories
    ('އަތޮޅުތައް', 'Atolls', 'atolls', 'national-news'),
    ('ރަށްރަށް', 'Islands', 'islands', 'national-news'),
    ('ސަރުކާރު', 'Government', 'government', 'national-news'),
    ('ތަރައްޤީ', 'Development', 'development', 'national-news'),
    ('މަޝްރޫޢުތައް', 'Projects', 'projects', 'national-news'),

    -- Crime & Justice subcategories
    ('މައްސަލަތައް', 'Cases', 'cases', 'crime-justice'),
    ('ފުލުހުން', 'Police', 'police', 'crime-justice'),
    ('ޝަރުޢީ ނިޒާމް', 'Legal System', 'legal-system', 'crime-justice'),
    ('ޙުކުމްތައް', 'Verdicts', 'verdicts', 'crime-justice'),
    ('ތަޙްޤީޤު', 'Investigation', 'investigation', 'crime-justice'),

    -- Lifestyle subcategories
    ('ދަތުރުފަތުރު', 'Travel', 'travel', 'lifestyle'),
    ('ކާބޯތަކެތި', 'Food', 'food', 'lifestyle'),
    ('ފެޝަން', 'Fashion', 'fashion', 'lifestyle'),
    ('ގޭތެރެ', 'Home', 'home', 'lifestyle'),
    ('ގުޅުންތައް', 'Relationships', 'relationships', 'lifestyle'),

    -- Opinion & Editorial subcategories
    ('ކުރެހުން', 'Editorial Cartoons', 'editorial-cartoons', 'opinion-editorial'),
    ('ބަހުސް', 'Debates', 'debates', 'opinion-editorial'),
    ('ކިޔުންތެރިންގެ ސިޓީ', 'Letters to Editor', 'letters-to-editor', 'opinion-editorial'),
    ('ތަޙްލީލު', 'Analysis', 'analysis', 'opinion-editorial'),
    ('ފާޑުކިޔުން', 'Commentary', 'commentary', 'opinion-editorial'),

    -- Weather subcategories
    ('ރަށްރަށުގެ މޫސުން', 'Local Weather', 'local-weather', 'weather'),
    ('ސަރަޙައްދީ މޫސުން', 'Regional Weather', 'regional-weather', 'weather'),
    ('ކަނޑުގެ ޙާލަތު', 'Marine Weather', 'marine-weather', 'weather'),
    ('އިންޒާރު', 'Weather Alerts', 'weather-alerts', 'weather'),
    ('މޫސުމީ ލަފާ', 'Weather Forecast', 'weather-forecast', 'weather'),

    -- Community subcategories
    ('އިޖްތިމާޢީ ޙަރަކާތްތައް', 'Community Events', 'community-events', 'community'),
    ('ޖަމްޢިއްޔާތައް', 'Organizations', 'organizations', 'community'),
    ('ރަށު ކައުންސިލް', 'Local Council', 'local-council', 'community'),
    ('ތަރައްޤީގެ މަޝްރޫޢު', 'Development Projects', 'development-projects', 'community'),
    ('އިޖްތިމާޢީ ޚިދުމަތް', 'Social Services', 'social-services', 'community')
) AS s(name, name_en, slug, category_slug)
JOIN categories c ON c.slug = s.category_slug
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  category_id = EXCLUDED.category_id;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS subcategories_name_idx ON subcategories(name);
CREATE INDEX IF NOT EXISTS subcategories_name_en_idx ON subcategories(name_en);
CREATE INDEX IF NOT EXISTS subcategories_slug_idx ON subcategories(slug);