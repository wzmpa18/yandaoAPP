/*
  # User Style & Theme System

  1. Changes to user_profiles
     - Add `age_group` column: 'primary' | 'secondary' | 'university' | 'professional'
     - Add `interest_tags` column: text[] of interest keys (anime, gaming, sports, etc.)
     - Add `theme_key` column: active theme skin preference

  2. These are optional columns (nullable) to maintain backwards compatibility
     with existing user_profiles rows created before this migration.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'age_group'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN age_group text DEFAULT 'university';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'interest_tags'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN interest_tags text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'theme_key'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN theme_key text DEFAULT 'classic';
  END IF;
END $$;
