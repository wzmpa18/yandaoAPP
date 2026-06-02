/*
  # AI Model Configuration Table

  ## Overview
  Stores admin-configured AI model settings: API keys, endpoints, default model,
  temperature, and max tokens. Single-row config (id = 1).

  ## New Tables

  ### ai_model_config
  - id: always 1 (single-row constraint)
  - default_model: 'doubao' | 'claude' | 'openai'
  - doubao_api_key: encrypted at rest by Supabase, masked in UI
  - doubao_endpoint: custom endpoint URL (default: volces ARK)
  - claude_api_key: Anthropic API key
  - claude_model: specific Claude model slug
  - openai_api_key: OpenAI API key
  - openai_model: specific OpenAI model slug
  - openai_endpoint: custom base URL (for compatible APIs)
  - max_tokens: max response tokens
  - temperature: sampling temperature 0.0–2.0
  - system_prompt_prefix: optional global prefix injected into every system prompt
  - updated_at: last modification timestamp

  ## Security
  - RLS enabled
  - Only authenticated users can read/update (admin-only in practice via secret tap)
*/

CREATE TABLE IF NOT EXISTS ai_model_config (
  id                    integer       PRIMARY KEY DEFAULT 1,
  default_model         text          NOT NULL DEFAULT 'doubao',
  doubao_api_key        text          NOT NULL DEFAULT '',
  doubao_endpoint       text          NOT NULL DEFAULT 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  doubao_model          text          NOT NULL DEFAULT 'ep-20250101000000-xxxxx',
  claude_api_key        text          NOT NULL DEFAULT '',
  claude_model          text          NOT NULL DEFAULT 'claude-3-5-sonnet-20241022',
  claude_endpoint       text          NOT NULL DEFAULT 'https://api.anthropic.com/v1/messages',
  openai_api_key        text          NOT NULL DEFAULT '',
  openai_model          text          NOT NULL DEFAULT 'gpt-4o-mini',
  openai_endpoint       text          NOT NULL DEFAULT 'https://api.openai.com/v1/chat/completions',
  max_tokens            integer       NOT NULL DEFAULT 800,
  temperature           numeric(3,2)  NOT NULL DEFAULT 0.8,
  system_prompt_prefix  text          NOT NULL DEFAULT '',
  updated_at            timestamptz   NOT NULL DEFAULT now()
);

ALTER TABLE ai_model_config ADD CONSTRAINT ai_model_config_single_row CHECK (id = 1);

INSERT INTO ai_model_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE ai_model_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read ai model config"
  ON ai_model_config FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update ai model config"
  ON ai_model_config FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
