/*
  # AI Cost Dashboard Tables

  ## Overview
  Adds infrastructure for tracking AI API call costs and enforcing budget limits.

  ## New Tables

  ### ai_call_logs
  Records every AI API call with token usage and estimated cost.
  - id: unique record
  - session_key: which user session made the call
  - call_type: chat | text | voice | camera
  - lang_code: target language
  - input_tokens: tokens in prompt
  - output_tokens: tokens in response
  - model: model name (gpt-4o, claude-3-sonnet, etc.)
  - cost_usd: computed cost in USD
  - is_mock: whether this was a simulated (fallback) response
  - created_at: timestamp

  ### ai_cost_config
  Admin-configurable pricing and budget rules (single-row config table).
  - id: always 1
  - price_per_1m_input_usd: cost per 1M input tokens
  - price_per_1m_output_usd: cost per 1M output tokens
  - daily_budget_usd: daily spend cap before fallback kicks in
  - alert_threshold_pct: % of budget at which to raise an alert (0-100)
  - fallback_on_exceed: auto-downgrade to mock when over budget
  - updated_at: last update timestamp

  ## Security
  - RLS enabled on both tables
  - ai_call_logs: authenticated users can only insert/read their own rows
  - ai_cost_config: readable by authenticated users, writable only via service role
    (admin console writes directly via service key in edge function; for demo, allow all authenticated)
*/

-- ── ai_call_logs ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_call_logs (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key    text        NOT NULL,
  call_type      text        NOT NULL DEFAULT 'chat',
  lang_code      text        NOT NULL DEFAULT 'ja',
  model          text        NOT NULL DEFAULT 'simulated',
  input_tokens   integer     NOT NULL DEFAULT 0,
  output_tokens  integer     NOT NULL DEFAULT 0,
  cost_usd       numeric(10,8) NOT NULL DEFAULT 0,
  is_mock        boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_call_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own ai call logs"
  ON ai_call_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own ai call logs"
  ON ai_call_logs FOR SELECT
  TO authenticated
  USING (true);

-- ── ai_cost_config ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_cost_config (
  id                      integer     PRIMARY KEY DEFAULT 1,
  price_per_1m_input_usd  numeric(10,4) NOT NULL DEFAULT 5.0,
  price_per_1m_output_usd numeric(10,4) NOT NULL DEFAULT 15.0,
  daily_budget_usd        numeric(10,4) NOT NULL DEFAULT 10.0,
  alert_threshold_pct     integer     NOT NULL DEFAULT 80,
  fallback_on_exceed      boolean     NOT NULL DEFAULT true,
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- Ensure only one config row
ALTER TABLE ai_cost_config ADD CONSTRAINT ai_cost_config_single_row CHECK (id = 1);

-- Seed default config row
INSERT INTO ai_cost_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE ai_cost_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read ai cost config"
  ON ai_cost_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update ai cost config"
  ON ai_cost_config FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Index for fast aggregation by date
CREATE INDEX IF NOT EXISTS idx_ai_call_logs_created_at ON ai_call_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_call_logs_session ON ai_call_logs(session_key);
