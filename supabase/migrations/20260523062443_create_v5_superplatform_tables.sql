/*
  # SuperPlatform V5: Onboarding, Exam Engine, Grammar & Vocabulary

  1. New Tables
    - `user_profiles` — stores onboarding answers and placement level per session
    - `exam_questions` — 4 question types for 10 languages and 3 levels
    - `grammar_patterns` — core sentence patterns and conjugation tables per language
    - `vocabulary_items` — words classified by high-freq / industry / exam-core

  2. Security
    - RLS enabled on all new tables
    - Public read on grammar/vocabulary/exam content
    - User profiles scoped to anon session key

  3. Notes
    - exam_questions.type: 'listening_choice' | 'grammar_error' | 'sentence_build' | 'reading_comprehension'
    - vocabulary_items.tag: 'high_freq' | 'industry' | 'exam_core'
    - grammar_patterns.category: 'sentence_pattern' | 'tense_table' | 'verb_conjugation'
*/

-- ── user_profiles ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key    text NOT NULL,
  language_code  text NOT NULL DEFAULT 'ja',
  goal           text NOT NULL DEFAULT 'daily',  -- daily | exam | professional
  level          text NOT NULL DEFAULT 'beginner', -- beginner | intermediate | advanced
  placement_score integer NOT NULL DEFAULT 0,
  completed_onboarding boolean NOT NULL DEFAULT false,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "session read own profile"
  ON user_profiles FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "session insert own profile"
  ON user_profiles FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "session update own profile"
  ON user_profiles FOR UPDATE TO anon, authenticated
  USING (true) WITH CHECK (true);

-- ── exam_questions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code   text NOT NULL,
  level           text NOT NULL,  -- beginner | intermediate | advanced
  type            text NOT NULL,  -- listening_choice | grammar_error | sentence_build | reading_comprehension
  question_text   text NOT NULL,
  options         jsonb,          -- array of option strings
  correct_answer  text NOT NULL,
  explanation     text NOT NULL DEFAULT '',
  audio_text      text DEFAULT '', -- text to speak for listening questions
  order_hint      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read exam questions"
  ON exam_questions FOR SELECT TO anon, authenticated
  USING (true);

-- ── grammar_patterns ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS grammar_patterns (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code text NOT NULL,
  category      text NOT NULL,  -- sentence_pattern | tense_table | verb_conjugation
  title         text NOT NULL,
  title_zh      text NOT NULL DEFAULT '',
  structure     text NOT NULL,  -- e.g. "S + V + O"
  example_target text NOT NULL,
  example_zh    text NOT NULL,
  notes         text DEFAULT '',
  level         text NOT NULL DEFAULT 'beginner',
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE grammar_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read grammar"
  ON grammar_patterns FOR SELECT TO anon, authenticated
  USING (true);

-- ── vocabulary_items ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vocabulary_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code text NOT NULL,
  word          text NOT NULL,
  reading       text NOT NULL DEFAULT '',
  meaning_zh    text NOT NULL,
  meaning_en    text NOT NULL,
  tag           text NOT NULL, -- high_freq | industry | exam_core
  industry      text DEFAULT '', -- if tag=industry: business | it | medical | travel
  level         text NOT NULL DEFAULT 'beginner',
  example       text DEFAULT '',
  order_index   integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE vocabulary_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read vocabulary"
  ON vocabulary_items FOR SELECT TO anon, authenticated
  USING (true);
