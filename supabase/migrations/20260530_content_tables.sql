/*
  # Content Tables for Nursery Rhymes, Stories, Jokes
  
  1. New Tables
    - `nursery_rhymes` — 童谣内容（双语对照）
    - `short_stories` — 短篇故事（双语对照）
    - `jokes` — 笑话（双语对照）
    
  2. Supported Languages: ja, en, ko, fr, es, de, it, pt, ar, zh
  3. Supported Age Groups: kids, teenagers, adults
*/

-- ─── nursery_rhymes ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nursery_rhymes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code     text NOT NULL,          -- ja, en, ko, fr, es, de, it, pt, ar, zh
  age_group     text NOT NULL CHECK (age_group IN ('kids', 'teenagers', 'adults')),
  title         text NOT NULL,          -- 目标语言标题
  title_zh      text NOT NULL,          -- 中文翻译标题
  content       text NOT NULL,          -- 目标语言原文
  content_zh    text NOT NULL,          -- 中文翻译
  audio_url     text,                   -- 音频URL（如有）
  difficulty    text NOT NULL DEFAULT 'beginner',
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (lang_code, age_group, title)
);
ALTER TABLE nursery_rhymes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read nursery rhymes"
  ON nursery_rhymes FOR SELECT TO anon, authenticated
  USING (true);

-- ─── short_stories ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS short_stories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code     text NOT NULL,
  age_group     text NOT NULL CHECK (age_group IN ('kids', 'teenagers', 'adults')),
  title         text NOT NULL,
  title_zh      text NOT NULL,
  content       text NOT NULL,
  content_zh    text NOT NULL,
  audio_url     text,
  difficulty    text NOT NULL DEFAULT 'beginner',
  story_length  text NOT NULL DEFAULT 'short', -- short | medium | long
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (lang_code, age_group, title)
);
ALTER TABLE short_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read short stories"
  ON short_stories FOR SELECT TO anon, authenticated
  USING (true);

-- ─── jokes ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jokes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lang_code     text NOT NULL,
  age_group     text NOT NULL CHECK (age_group IN ('kids', 'teenagers', 'adults')),
  content       text NOT NULL,          -- 目标语言原文
  content_zh    text NOT NULL,          -- 中文翻译
  category      text NOT NULL DEFAULT 'general', -- general | pun | story | one_liner
  difficulty    text NOT NULL DEFAULT 'beginner',
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  UNIQUE (lang_code, age_group, content)
);
ALTER TABLE jokes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read jokes"
  ON jokes FOR SELECT TO anon, authenticated
  USING (true);
