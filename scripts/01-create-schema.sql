-- WordStack Database Schema - Part 1: Core Tables

-- Literary Eras table
CREATE TABLE IF NOT EXISTS literary_eras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poets table
CREATE TABLE IF NOT EXISTS poets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  era_id UUID REFERENCES literary_eras(id),
  bio TEXT,
  image_url VARCHAR(500),
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poems table
CREATE TABLE IF NOT EXISTS poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  poet_id UUID NOT NULL REFERENCES poets(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  summary TEXT,
  intro TEXT,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  word_count INTEGER,
  line_count INTEGER,
  is_classic BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(slug, poet_id)
);

-- Poem_Theme junction table
CREATE TABLE IF NOT EXISTS poem_themes (
  poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (poem_id, theme_id)
);

-- Users table (linked to Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  theme_preference VARCHAR(50) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modern Poems table
CREATE TABLE IF NOT EXISTS modern_poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  modern_poem_id UUID REFERENCES modern_poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (poem_id IS NOT NULL OR modern_poem_id IS NOT NULL),
  UNIQUE(user_id, poem_id, modern_poem_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  modern_poem_id UUID REFERENCES modern_poems(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (poem_id IS NOT NULL OR modern_poem_id IS NOT NULL)
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Collection_Poem junction table
CREATE TABLE IF NOT EXISTS collection_poems (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  position INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, poem_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_poets_slug ON poets(slug);
CREATE INDEX IF NOT EXISTS idx_poets_era ON poets(era_id);
CREATE INDEX IF NOT EXISTS idx_poems_poet ON poems(poet_id);
CREATE INDEX IF NOT EXISTS idx_poems_slug ON poems(slug);
CREATE INDEX IF NOT EXISTS idx_poems_published ON poems(is_published);
CREATE INDEX IF NOT EXISTS idx_poem_themes_poem ON poem_themes(poem_id);
CREATE INDEX IF NOT EXISTS idx_poem_themes_theme ON poem_themes(theme_id);
CREATE INDEX IF NOT EXISTS idx_modern_poems_user ON modern_poems(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_poem ON likes(poem_id);
CREATE INDEX IF NOT EXISTS idx_likes_modern_poem ON likes(modern_poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem ON comments(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_modern_poem ON comments(modern_poem_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_poems_collection ON collection_poems(collection_id);

-- Enable Row Level Security
ALTER TABLE poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE modern_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read access to classic content
CREATE POLICY "Allow public read poets" ON poets FOR SELECT USING (true);
CREATE POLICY "Allow public read themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Allow public read published poems" ON poems FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read modern poems" ON modern_poems FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);

-- Users can create modern poems
CREATE POLICY "Users can create modern poems" ON modern_poems FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own poems" ON modern_poems FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own poems" ON modern_poems FOR DELETE USING (auth.uid() = user_id);

-- Authenticated users can manage follows
CREATE POLICY "Users can create follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete follows" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- Authenticated users can like/unlike
CREATE POLICY "Users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Authenticated users can comment
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Collections management
CREATE POLICY "Users can create collections" ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can read public collections" ON collections FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own collections" ON collections FOR DELETE USING (auth.uid() = user_id);
