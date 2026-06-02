/*
  # V3 Architectural Shift: Chinese Zen Language Learning App

  1. New Tables
    - `scenarios`
      - `id` (uuid, primary key)
      - `title` (text, e.g. "Emergency Help", "Convenience Store")
      - `title_zh` (text, Chinese title)
      - `description` (text)
      - `icon` (text, emoji icon)
      - `grid_position` (integer, 1-9 for 9-grid layout)
      - `category` (text: "emergency", "shopping", "transit", "dining", "social")
      - `color` (text, hex accent color)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    - `phrases`
      - `id` (uuid, primary key)
      - `scenario_id` (uuid, foreign key to scenarios)
      - `target_lang` (text, the phrase in target language, e.g. Japanese)
      - `native_lang` (text, the phrase in native language, e.g. English)
      - `pronunciation` (text, romanized pronunciation)
      - `context_note` (text, when/how to use this phrase)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    - `hacks`
      - `id` (uuid, primary key)
      - `phrase_id` (uuid, foreign key to phrases)
      - `title` (text, e.g. "Verb Conjugation Shortcut")
      - `content` (text, the hack/mnemonic content)
      - `type` (text: "mnemonic", "pattern", "cultural", "shortcut")
      - `visual_formula` (text, a short visual pattern like "V-te + kudasai = Please V")
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Read-only access for all users (public select)
*/

CREATE TABLE IF NOT EXISTS scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_zh text DEFAULT '',
  description text DEFAULT '',
  icon text DEFAULT '📍',
  grid_position integer NOT NULL DEFAULT 1,
  category text NOT NULL DEFAULT 'social',
  color text DEFAULT '#7a9b71',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scenarios"
  ON scenarios FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS phrases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  target_lang text NOT NULL,
  native_lang text NOT NULL,
  pronunciation text DEFAULT '',
  context_note text DEFAULT '',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phrases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read phrases"
  ON phrases FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS hacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase_id uuid NOT NULL REFERENCES phrases(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'shortcut',
  visual_formula text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hacks"
  ON hacks FOR SELECT
  TO anon, authenticated
  USING (true);
