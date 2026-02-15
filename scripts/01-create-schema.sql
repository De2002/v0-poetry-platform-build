-- WordStack Database Schema
-- Phase 1: Core tables for classic poetry archive and modern feed

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Poets table (for classic archive)
CREATE TABLE IF NOT EXISTS poets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  era_id UUID,
  bio TEXT,
  image_url VARCHAR(500),
  nationality VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Literary Eras table
CREATE TABLE IF NOT EXISTS literary_eras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  start_year INTEGER,
  end_year INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for era_id
ALTER TABLE poets ADD CONSTRAINT fk_poets_era FOREIGN KEY (era_id) REFERENCES literary_eras(id);

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Poems table (for classic archive + user-generated)
CREATE TABLE IF NOT EXISTS poems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  poet_id UUID NOT NULL,
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
  FOREIGN KEY (poet_id) REFERENCES poets(id),
  UNIQUE(slug, poet_id)
);

-- Poem_Theme junction table
CREATE TABLE IF NOT EXISTS poem_themes (
  poem_id UUID NOT NULL,
  theme_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (poem_id, theme_id),
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
);

-- Users table (for authentication and modern feed)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  theme_preference VARCHAR(50) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modern Poems table (user-generated poetry)
CREATE TABLE IF NOT EXISTS modern_poems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Follows table (for social features)
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Likes table (for engagement)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  poem_id UUID,
  modern_poem_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (modern_poem_id) REFERENCES modern_poems(id) ON DELETE CASCADE,
  CHECK (poem_id IS NOT NULL OR modern_poem_id IS NOT NULL)
);

-- Comments table (for engagement)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  poem_id UUID,
  modern_poem_id UUID,
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE,
  FOREIGN KEY (modern_poem_id) REFERENCES modern_poems(id) ON DELETE CASCADE,
  CHECK (poem_id IS NOT NULL OR modern_poem_id IS NOT NULL)
);

-- Poetry Collections table (user-created collections)
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Collection_Poem junction table
CREATE TABLE IF NOT EXISTS collection_poems (
  collection_id UUID NOT NULL,
  poem_id UUID NOT NULL,
  position INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (collection_id, poem_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (poem_id) REFERENCES poems(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_poets_slug ON poets(slug);
CREATE INDEX idx_poets_era ON poets(era_id);
CREATE INDEX idx_poems_poet ON poems(poet_id);
CREATE INDEX idx_poems_slug ON poems(slug);
CREATE INDEX idx_poems_published ON poems(is_published);
CREATE INDEX idx_poem_themes_poem ON poem_themes(poem_id);
CREATE INDEX idx_poem_themes_theme ON poem_themes(theme_id);
CREATE INDEX idx_modern_poems_user ON modern_poems(user_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_poem ON likes(poem_id);
CREATE INDEX idx_likes_modern_poem ON likes(modern_poem_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_poem ON comments(poem_id);
CREATE INDEX idx_comments_modern_poem ON comments(modern_poem_id);
CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collection_poems_collection ON collection_poems(collection_id);
