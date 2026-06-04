import React, { useState, useEffect } from 'react';
import { supabase } from '../data/supabase';
import { AIModel, AIModelConfig, invalidateAIConfigCache, callAI, friendlyAIError } from '../lib/aiClient';

const DEFAULT: AIModelConfig = {
  default_model: 'deepseek',
  doubao_api_key: '',
  doubao_endpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
  doubao_model: '',
  claude_api_key: '',
  claude_model: 'claude-3-5-sonnet-20241022',
  claude_endpoint: 'https://api.anthropic.com/v1/messages',
  openai_api_key: '',
  openai_model: 'gpt-4o-mini',
  openai_endpoint: 'https://api.openai.com/v1/chat/completions',
  deepseek_api_key: 'sk-01594a615f064cffb32022b158260461',
  deepseek_model: 'deepseek-chat',
  deepseek_endpoint: 'https://api.deepseek.com/v1/chat/completions',
  max_tokens: 800,
  temperature: 0.8,
  system_prompt_prefix: '',
};

const MODEL_OPTIONS: { key: AIModel; label: string; badge: string }[] = [
  { key: 'deepseek', label: 'DeepSeek', badge: '推荐·免费' },
  { key: 'doubao', label: '豆包 (火山引擎)', badge: '国内首选' },
  { key: 'claude', label: 'Claude (Anthropic)', badge: '高质量' },
  { key: 'openai', label: 'OpenAI / 兼容接口', badge: '通用' },
];

function maskKey(k: string): string {
  if (!k || k.length < 8) return k;
  return k.slice(0, 4) + '••••••••' + k.slice(-4);
}

export const AIModelConfigPanel: React.FC = () => {
  const [cfg, setCfg] = useState<AIModelConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [revealKey, setRevealKey] = useState<Partial<Record<AIModel, boolean>>>({});

  useEffect(() => {
    supabase.from('ai_model_config').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setCfg({ ...DEFAULT, ...data });
      setLoading(false);
    }).catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    await supabase.from('ai_model_config').update({ ...cfg, updated_at: new Date().toISOString() }).eq('id', 1);
    invalidateAIConfigCache();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await callAI([
        { role: 'system', content: '你是助手，请用中文简短回复。' },
        { role: 'user', content: '你好，请回复"连接成功"四个字。' },
      ]);
      setTestResult(`连接成功！回复：${result.slice(0, 60)}`);
    } catch (err) {
      setTestResult(`失败：${friendlyAIError(err)}`);
    }
    setTesting(false);
  }

  function updateCfg(patch: Partial<AIModelConfig>) {
    setCfg((c) => ({ ...c, ...patch }));
  }

  if (loading) return <div className="aimc-loading">加载中…</div>;

  return (
    <div className="aimc-wrap">
      <div className="aimc-header">
        <div className="aimc-header-icon">🤖</div>
        <div>
          <h3 className="aimc-title">AI 模型配置</h3>
          <p className="aimc-sub">配置 API 密钥后，AI 助手将使用真实模型回复</p>
        </div>
      </div>

      {/* Default model selector */}
      <div className="aimc-section">
        <div className="aimc-section-title">默认模型</div>
        <div className="aimc-model-grid">
          {MODEL_OPTIONS.map((m) => (
            <button
              key={m.key}
              className={`aimc-model-btn ${cfg.default_model === m.key ? 'active' : ''}`}
              onClick={() => updateCfg({ default_model: m.key })}
            >
              <span className="aimc-model-label">{m.label}</span>
              <span className="aimc-model-badge">{m.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Doubao */}
      <div className="aimc-section">
        <div className="aimc-section-title aimc-provider doubao">
          豆包 · 火山引擎
          {cfg.doubao_api_key && <span className="aimc-key-set">已配置</span>}
        </div>
        <div className="aimc-field">
          <label className="aimc-label">API 密钥</label>
          <div className="aimc-key-row">
            <input
              type={revealKey.doubao ? 'text' : 'password'}
              className="aimc-input"
              value={cfg.doubao_api_key}
              placeholder="sk-..."
              onChange={(e) => updateCfg({ doubao_api_key: e.target.value })}
            />
            <button className="aimc-reveal-btn" onClick={() => setRevealKey((r) => ({ ...r, doubao: !r.doubao }))}>
              {revealKey.doubao ? '隐藏' : '显示'}
            </button>
          </div>
        </div>
        <div className="aimc-field">
          <label className="aimc-label">推理接入点 (Endpoint ID)</label>
          <input
            type="text"
            className="aimc-input"
            value={cfg.doubao_model}
            placeholder="ep-20250101000000-xxxxx"
            onChange={(e) => updateCfg({ doubao_model: e.target.value })}
          />
        </div>
        <div className="aimc-field">
          <label className="aimc-label">API 地址</label>
          <input
            type="text"
            className="aimc-input aimc-input-mono"
            value={cfg.doubao_endpoint}
            onChange={(e) => updateCfg({ doubao_endpoint: e.target.value })}
          />
        </div>
      </div>

      {/* Claude */}
      <div className="aimc-section">
        <div className="aimc-section-title aimc-provider claude">
          Claude · Anthropic
          {cfg.claude_api_key && <span className="aimc-key-set">已配置</span>}
        </div>
        <div className="aimc-field">
          <label className="aimc-label">API 密钥</label>
          <div className="aimc-key-row">
            <input
              type={revealKey.claude ? 'text' : 'password'}
              className="aimc-input"
              value={cfg.claude_api_key}
              placeholder="sk-ant-..."
              onChange={(e) => updateCfg({ claude_api_key: e.target.value })}
            />
            <button className="aimc-reveal-btn" onClick={() => setRevealKey((r) => ({ ...r, claude: !r.claude }))}>
              {revealKey.claude ? '隐藏' : '显示'}
            </button>
          </div>
        </div>
        <div className="aimc-field">
          <label className="aimc-label">模型版本</label>
          <input
            type="text"
            className="aimc-input"
            value={cfg.claude_model}
            placeholder="claude-3-5-sonnet-20241022"
            onChange={(e) => updateCfg({ claude_model: e.target.value })}
          />
        </div>
      </div>

      {/* OpenAI */}
      <div className="aimc-section">
        <div className="aimc-section-title aimc-provider openai">
          OpenAI / 兼容接口
          {cfg.openai_api_key && <span className="aimc-key-set">已配置</span>}
        </div>
        <div className="aimc-field">
          <label className="aimc-label">API 密钥</label>
          <div className="aimc-key-row">
            <input
              type={revealKey.openai ? 'text' : 'password'}
              className="aimc-input"
              value={cfg.openai_api_key}
              placeholder="sk-..."
              onChange={(e) => updateCfg({ openai_api_key: e.target.value })}
            />
            <button className="aimc-reveal-btn" onClick={() => setRevealKey((r) => ({ ...r, openai: !r.openai }))}>
              {revealKey.openai ? '隐藏' : '显示'}
            </button>
          </div>
        </div>
        <div className="aimc-field">
          <label className="aimc-label">模型 ID</label>
          <input
            type="text"
            className="aimc-input"
            value={cfg.openai_model}
            placeholder="gpt-4o-mini"
            onChange={(e) => updateCfg({ openai_model: e.target.value })}
          />
        </div>
        <div className="aimc-field">
          <label className="aimc-label">API 地址（兼容接口可修改）</label>
          <input
            type="text"
            className="aimc-input aimc-input-mono"
            value={cfg.openai_endpoint}
            onChange={(e) => updateCfg({ openai_endpoint: e.target.value })}
          />
        </div>
      </div>

      {/* DeepSeek */}
      <div className="aimc-section">
        <div className="aimc-section-title aimc-provider deepseek">
          DeepSeek · 深度求索
          {cfg.deepseek_api_key && <span className="aimc-key-set">已配置</span>}
        </div>
        <div className="aimc-field">
          <label className="aimc-label">API 密钥（<a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener">获取密钥</a>，新用户有免费额度）</label>
          <div className="aimc-key-row">
            <input
              type={revealKey.deepseek ? 'text' : 'password'}
              className="aimc-input"
              value={cfg.deepseek_api_key}
              placeholder="sk-..."
              onChange={(e) => updateCfg({ deepseek_api_key: e.target.value })}
            />
            <button className="aimc-reveal-btn" onClick={() => setRevealKey((r) => ({ ...r, deepseek: !r.deepseek }))}>
              {revealKey.deepseek ? '隐藏' : '显示'}
            </button>
          </div>
        </div>
        <div className="aimc-field">
          <label className="aimc-label">模型版本</label>
          <input
            type="text"
            className="aimc-input"
            value={cfg.deepseek_model}
            placeholder="deepseek-chat"
            onChange={(e) => updateCfg({ deepseek_model: e.target.value })}
          />
        </div>
      </div>

      {/* Global params */}
      <div className="aimc-section">
        <div className="aimc-section-title">通用参数</div>
        <div className="aimc-param-row">
          <div className="aimc-param-item">
            <label className="aimc-label">最大 Token 数</label>
            <input
              type="number" min="100" max="4000" step="100" className="aimc-input aimc-input-sm"
              value={cfg.max_tokens}
              onChange={(e) => updateCfg({ max_tokens: parseInt(e.target.value) || 800 })}
            />
          </div>
          <div className="aimc-param-item">
            <label className="aimc-label">温度 (0~2)</label>
            <input
              type="number" min="0" max="2" step="0.1" className="aimc-input aimc-input-sm"
              value={cfg.temperature}
              onChange={(e) => updateCfg({ temperature: parseFloat(e.target.value) || 0.8 })}
            />
          </div>
        </div>
        <div className="aimc-field">
          <label className="aimc-label">全局 System Prompt 前缀（可留空）</label>
          <textarea
            className="aimc-input aimc-textarea"
            rows={3}
            value={cfg.system_prompt_prefix}
            placeholder="例：请始终用简体中文回复，语气亲切…"
            onChange={(e) => updateCfg({ system_prompt_prefix: e.target.value })}
          />
        </div>
      </div>

      {/* Test + Save */}
      <div className="aimc-actions">
        <button className="aimc-test-btn" onClick={testConnection} disabled={testing}>
          {testing ? '测试中…' : '连接测试'}
        </button>
        <button className="aimc-save-btn" onClick={save} disabled={saving}>
          {saved ? '已保存 ✓' : saving ? '保存中…' : '保存配置'}
        </button>
      </div>

      {testResult && (
        <div className={`aimc-test-result ${testResult.startsWith('连接成功') ? 'ok' : 'fail'}`}>
          {testResult}
        </div>
      )}

      <div className="aimc-note">
        密钥存储在 Supabase 数据库，仅在浏览器请求中传输，不经过第三方服务器。
        <br />
        API 密钥错误或余额不足时，AI 助手自动切换为模拟回复，用户无感知。
      </div>

      <div className="aimc-masked-preview">
        {cfg.doubao_api_key && <span>豆包密钥：{maskKey(cfg.doubao_api_key)}</span>}
        {cfg.deepseek_api_key && <span>DeepSeek密钥：{maskKey(cfg.deepseek_api_key)}</span>}
        {cfg.claude_api_key && <span>Claude密钥：{maskKey(cfg.claude_api_key)}</span>}
        {cfg.openai_api_key && <span>OpenAI密钥：{maskKey(cfg.openai_api_key)}</span>}
      </div>
    </div>
  );
};
