import { supabase } from './supabase';

export type AIModel = 'doubao' | 'claude' | 'openai';

export interface AIModelConfig {
  default_model: AIModel;
  doubao_api_key: string;
  doubao_endpoint: string;
  doubao_model: string;
  claude_api_key: string;
  claude_model: string;
  claude_endpoint: string;
  openai_api_key: string;
  openai_model: string;
  openai_endpoint: string;
  max_tokens: number;
  temperature: number;
  system_prompt_prefix: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const DEFAULT_CFG: AIModelConfig = {
  default_model: 'doubao',
  doubao_api_key: 'ark-d751d0e3-08af-4d58-80b9-1e51b6830dd7-0fd5d',
  doubao_endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  doubao_model: 'ep-20250529145638-8v7r6',
  claude_api_key: '',
  claude_model: 'claude-3-5-sonnet-20241022',
  claude_endpoint: 'https://api.anthropic.com/v1/messages',
  openai_api_key: '',
  openai_model: 'gpt-4o-mini',
  openai_endpoint: 'https://api.openai.com/v1/chat/completions',
  max_tokens: 800,
  temperature: 0.8,
  system_prompt_prefix: '你是一个专业的语言学习助手，请用简洁清晰的方式回答用户的问题。',
};

let configCache: AIModelConfig | null = null;
let configCacheTs = 0;
const CACHE_TTL = 30_000; // 30s

export async function getAIConfig(): Promise<AIModelConfig> {
  if (configCache && Date.now() - configCacheTs < CACHE_TTL) return configCache;
  const { data } = await supabase.from('ai_model_config').select('*').eq('id', 1).maybeSingle();
  configCache = data ? { ...DEFAULT_CFG, ...data } : DEFAULT_CFG;
  configCacheTs = Date.now();
  return configCache;
}

export function invalidateAIConfigCache() {
  configCache = null;
  configCacheTs = 0;
}

/**
 * Call the configured AI model with streaming support.
 *
 * @param messages  Full message history (system + conversation)
 * @param onChunk   Called for each streamed text chunk; if absent, returns full string
 * @param modelOverride  Force a specific model for this call
 * @returns         Full response text
 */
export async function callAI(
  messages: AIMessage[],
  onChunk?: (chunk: string) => void,
  modelOverride?: AIModel,
): Promise<string> {
  const cfg = await getAIConfig();
  const model = modelOverride ?? cfg.default_model;

  // Prepend global system prompt prefix if set
  const finalMessages: AIMessage[] = cfg.system_prompt_prefix
    ? prependSystemPrefix(messages, cfg.system_prompt_prefix)
    : messages;

  if (model === 'claude') {
    return callClaude(finalMessages, cfg, onChunk);
  }
  // Both doubao and openai use OpenAI-compatible endpoints
  return callOpenAICompatible(finalMessages, cfg, model, onChunk);
}

// ── OpenAI-compatible (Doubao + OpenAI) ───────────────────────────────────────

async function callOpenAICompatible(
  messages: AIMessage[],
  cfg: AIModelConfig,
  model: AIModel,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const apiKey = model === 'doubao' ? cfg.doubao_api_key : cfg.openai_api_key;
  const endpoint = model === 'doubao' ? cfg.doubao_endpoint : cfg.openai_endpoint;
  const modelId = model === 'doubao' ? cfg.doubao_model : cfg.openai_model;

  if (!apiKey) throw new Error(`${model} API key not configured`);
  if (!endpoint) throw new Error(`${model} endpoint not configured`);

  const body = JSON.stringify({
    model: modelId || undefined,
    messages,
    max_tokens: cfg.max_tokens,
    temperature: cfg.temperature,
    stream: !!onChunk,
  });

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body,
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => resp.statusText);
    throw new Error(`${model} API error ${resp.status}: ${errText}`);
  }

  if (!onChunk) {
    const json = await resp.json();
    return json.choices?.[0]?.message?.content ?? '';
  }

  // Streaming SSE
  return readOpenAIStream(resp, onChunk);
}

async function readOpenAIStream(resp: Response, onChunk: (c: string) => void): Promise<string> {
  const reader = resp.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') break;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content ?? '';
        if (delta) { full += delta; onChunk(delta); }
      } catch { /* skip malformed */ }
    }
  }
  return full;
}

// ── Claude (Anthropic Messages API) ───────────────────────────────────────────

async function callClaude(
  messages: AIMessage[],
  cfg: AIModelConfig,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  if (!cfg.claude_api_key) throw new Error('Claude API key not configured');

  // Anthropic separates system prompt from messages array
  const system = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n');
  const userMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const body: Record<string, unknown> = {
    model: cfg.claude_model,
    max_tokens: cfg.max_tokens,
    temperature: cfg.temperature,
    messages: userMessages,
    stream: !!onChunk,
  };
  if (system) body.system = system;

  const resp = await fetch(cfg.claude_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.claude_api_key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => resp.statusText);
    throw new Error(`Claude API error ${resp.status}: ${errText}`);
  }

  if (!onChunk) {
    const json = await resp.json();
    return json.content?.[0]?.text ?? '';
  }

  return readClaudeStream(resp, onChunk);
}

async function readClaudeStream(resp: Response, onChunk: (c: string) => void): Promise<string> {
  const reader = resp.body?.getReader();
  if (!reader) throw new Error('No response body');
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      try {
        const json = JSON.parse(data);
        if (json.type === 'content_block_delta') {
          const delta = json.delta?.text ?? '';
          if (delta) { full += delta; onChunk(delta); }
        }
      } catch { /* skip */ }
    }
  }
  return full;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function prependSystemPrefix(messages: AIMessage[], prefix: string): AIMessage[] {
  const first = messages[0];
  if (first?.role === 'system') {
    return [{ role: 'system', content: prefix + '\n\n' + first.content }, ...messages.slice(1)];
  }
  return [{ role: 'system', content: prefix }, ...messages];
}

/** Friendly error message for UI display */
export function friendlyAIError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/not configured|API key/i.test(msg)) return '请先在后台配置 API 密钥';
  if (/401|Unauthorized|invalid_api_key/i.test(msg)) return 'API 密钥无效，请检查配置';
  if (/403|Forbidden/i.test(msg)) return 'API 访问被拒绝，请检查权限';
  if (/429|rate_limit|Too Many/i.test(msg)) return 'API 调用过于频繁，请稍后再试';
  if (/5\d\d|server_error/i.test(msg)) return 'AI 服务暂时不可用，已切换模拟模式';
  if (/fetch|network|Failed to fetch/i.test(msg)) return '网络连接失败，请检查网络';
  return 'AI 暂时不可用，已切换模拟模式';
}
