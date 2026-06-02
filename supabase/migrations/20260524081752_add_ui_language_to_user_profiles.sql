/*
  # Add ui_language to user_profiles

  Adds a ui_language column to store the user's preferred interface language.
  Defaults to 'zh' (Chinese). Supports 7 values: zh, en, ja, ko, fr, es, de.
*/
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'ui_language'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN ui_language varchar(5) DEFAULT 'zh';
  END IF;
END $$;
