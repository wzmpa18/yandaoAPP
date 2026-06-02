/*
  # Weekly Leaderboard, Streak Shield, Daily Tasks, Friends, Achievements

  New tables:
  - weekly_xp: tracks XP per user per week for leaderboard
  - streak_shields: user streak-freeze items
  - daily_tasks: per-user daily task progress
  - monthly_badges: awarded when user completes N days in a month
  - friendships: friend requests and connections
  - friend_joint_tasks: shared tasks between two friends
  - user_achievements: all earned achievements per user

  Modified:
  - user_profiles: adds streak_shield_count column
*/

-- Weekly XP tracker
CREATE TABLE IF NOT EXISTS weekly_xp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  week_start date NOT NULL,
  xp_earned integer DEFAULT 0,
  rank_tier text DEFAULT 'bronze',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_key, week_start)
);
ALTER TABLE weekly_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own weekly xp" ON weekly_xp FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own weekly xp" ON weekly_xp FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users update own weekly xp" ON weekly_xp FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Streak shields (连胜冻结道具)
CREATE TABLE IF NOT EXISTS streak_shields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  shields_count integer DEFAULT 0,
  total_purchased integer DEFAULT 0,
  total_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_key)
);
ALTER TABLE streak_shields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own shields" ON streak_shields FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own shields" ON streak_shields FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users update own shields" ON streak_shields FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Daily tasks progress
CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  task_type text NOT NULL,
  task_label text NOT NULL,
  target_value integer NOT NULL DEFAULT 1,
  current_value integer NOT NULL DEFAULT 0,
  completed boolean DEFAULT false,
  reward_claimed boolean DEFAULT false,
  xp_reward integer DEFAULT 20,
  diamond_reward integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_key, task_date, task_type)
);
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own daily tasks" ON daily_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own daily tasks" ON daily_tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users update own daily tasks" ON daily_tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Monthly badges
CREATE TABLE IF NOT EXISTS monthly_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  year_month text NOT NULL,
  checkin_days integer DEFAULT 0,
  badge_key text,
  badge_name text,
  earned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_key, year_month)
);
ALTER TABLE monthly_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own monthly badges" ON monthly_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own monthly badges" ON monthly_badges FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users update own monthly badges" ON monthly_badges FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Friendships
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_session_key text NOT NULL,
  addressee_session_key text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_session_key, addressee_session_key)
);
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read friendships they are part of" ON friendships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert friendships" ON friendships FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users update friendships they are part of" ON friendships FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Friend joint tasks
CREATE TABLE IF NOT EXISTS friend_joint_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  friendship_id uuid REFERENCES friendships(id) ON DELETE CASCADE,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  task_type text NOT NULL,
  task_label text NOT NULL,
  target_value integer NOT NULL DEFAULT 2,
  user1_value integer DEFAULT 0,
  user2_value integer DEFAULT 0,
  completed boolean DEFAULT false,
  xp_reward integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  UNIQUE(friendship_id, task_date, task_type)
);
ALTER TABLE friend_joint_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read joint tasks" ON friend_joint_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert joint tasks" ON friend_joint_tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users update joint tasks" ON friend_joint_tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  achievement_key text NOT NULL,
  achievement_name text NOT NULL,
  achievement_icon text DEFAULT '🏆',
  achievement_desc text,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(session_key, achievement_key)
);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own achievements" ON user_achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (true);

-- Add streak_shield_count to user_profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'streak_shield_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN streak_shield_count integer DEFAULT 0;
  END IF;
END $$;

-- Add diamond_count to user_profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'diamond_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN diamond_count integer DEFAULT 0;
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_weekly_xp_week ON weekly_xp(week_start, xp_earned DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_xp_session ON weekly_xp(session_key);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_session_date ON daily_tasks(session_key, task_date);
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_session_key);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee ON friendships(addressee_session_key);
CREATE INDEX IF NOT EXISTS idx_achievements_session ON user_achievements(session_key);
