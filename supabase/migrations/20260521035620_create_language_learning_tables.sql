/*
  # Create Language Learning App Tables

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text, course name e.g. "Spanish")
      - `description` (text)
      - `icon` (text, emoji or icon name)
      - `color` (text, hex color)
      - `created_at` (timestamptz)
    - `units`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text, unit name e.g. "Unit 1: Basics")
      - `description` (text)
      - `order_index` (integer, sort order)
      - `created_at` (timestamptz)
    - `lessons`
      - `id` (uuid, primary key)
      - `unit_id` (uuid, foreign key to units)
      - `title` (text, lesson name)
      - `type` (text, lesson type: "vocab", "grammar", "review", "story", "challenge")
      - `order_index` (integer, sort order within unit)
      - `xp_reward` (integer, XP earned on completion)
      - `icon` (text, emoji or icon name)
      - `is_bonus` (boolean, whether this is a bonus/side lesson)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read course data
    - All data is read-only for regular users (no insert/update/delete)
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '🌐',
  color text DEFAULT '#58CC02',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read units"
  ON units FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'vocab',
  order_index integer NOT NULL DEFAULT 0,
  xp_reward integer NOT NULL DEFAULT 10,
  icon text DEFAULT '📚',
  is_bonus boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (true);
