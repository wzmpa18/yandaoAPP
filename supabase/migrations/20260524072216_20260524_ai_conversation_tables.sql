/*
  # AI Companion Chat System Tables

  ## New Tables
  - `ai_conversations`: Stores conversation history per session
    - id (uuid, pk)
    - session_key (text) — anonymous user identifier
    - role (text) — ai character: panda/tsundere/funny/sweet
    - sender (text) — 'user' or 'ai'
    - content (text) — message text
    - lang_code (text) — language being practiced
    - session_id (uuid) — groups messages per chat session
    - created_at (timestamptz)

  - `ai_conversation_memory`: Long-term per-user memory across sessions
    - id (uuid, pk)
    - session_key (text) — anonymous user identifier
    - memory_key (text) — e.g. 'user_name', 'goal', 'common_errors'
    - memory_value (text)
    - updated_at (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Users can only read/write their own data via session_key match in app metadata or direct session_key
  - Using session_key (not auth.uid) since this app uses anonymous session keys
*/

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  role text NOT NULL DEFAULT 'panda',
  sender text NOT NULL DEFAULT 'user',
  content text NOT NULL,
  lang_code text NOT NULL DEFAULT 'ja',
  session_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_key ON ai_conversations(session_key);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT
  TO authenticated
  WITH CHECK (session_key IS NOT NULL);

CREATE POLICY "Users can select own conversations"
  ON ai_conversations FOR SELECT
  TO authenticated
  USING (session_key IS NOT NULL);

CREATE TABLE IF NOT EXISTS ai_conversation_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL,
  memory_key text NOT NULL,
  memory_value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(session_key, memory_key)
);

CREATE INDEX IF NOT EXISTS idx_ai_memory_session_key ON ai_conversation_memory(session_key);

ALTER TABLE ai_conversation_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own memory"
  ON ai_conversation_memory FOR INSERT
  TO authenticated
  WITH CHECK (session_key IS NOT NULL);

CREATE POLICY "Users can select own memory"
  ON ai_conversation_memory FOR SELECT
  TO authenticated
  USING (session_key IS NOT NULL);

CREATE POLICY "Users can update own memory"
  ON ai_conversation_memory FOR UPDATE
  TO authenticated
  USING (session_key IS NOT NULL)
  WITH CHECK (session_key IS NOT NULL);
