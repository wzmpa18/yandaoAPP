import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '../data/supabase';
import { FloatingBack } from './FloatingBack';

interface LangPackAdminProps {
  onBack: () => void;
}

interface LangPackEntry {
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  tags?: string[];
}

interface ParsedPack {
  langCode: string;
  packName: string;
  entries: LangPackEntry[];
}

const EXAMPLE_JSON: ParsedPack = {
  langCode: 'ja',
  packName: '日常会話 N5',
  entries: [
    { word: 'ありがとう', reading: 'arigatou', meaning: '谢谢', example: 'ありがとうございます。', tags: ['greeting'] },
    { word: 'すみません', reading: 'sumimasen', meaning: '对不起/请问', tags: ['polite'] },
    { word: 'どこ', reading: 'doko', meaning: '哪里', example: 'トイレはどこですか？', tags: ['question'] },
  ],
};

const LANG_FLAGS: Record<string, string> = {
  ja:'🇯🇵', en:'🇺🇸', ko:'🇰🇷', fr:'🇫🇷', es:'🇪🇸',
  de:'🇩🇪', it:'🇮🇹', pt:'🇧🇷', ar:'🇸🇦', zh:'🇨🇳',
};

export const LangPackAdmin: React.FC<LangPackAdminProps> = ({ onBack }) => {
  const [tab, setTab] = useState<'upload' | 'edit' | 'manage'>('upload');
  const [rawJson, setRawJson] = useState(JSON.stringify(EXAMPLE_JSON, null, 2));
  const [parsed, setParsed] = useState<ParsedPack | null>(null);
  const [parseError, setParseError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [existingPacks, setExistingPacks] = useState<{ id: string; book_name: string; lang_code: string; unit_number: number }[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // AI generator config (stored in localStorage via admin cfg)
  const [aiEnabled, setAiEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yandao_admin_v1') ?? '{}').aiGenEnabled ?? true; } catch { return true; }
  });
  const [aiGenCount, setAiGenCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yandao_admin_v1') ?? '{}').aiGenCount ?? 5; } catch { return 5; }
  });

  function saveAiConfig(enabled: boolean, count: number) {
    try {
      const cfg = JSON.parse(localStorage.getItem('yandao_admin_v1') ?? '{}');
      localStorage.setItem('yandao_admin_v1', JSON.stringify({ ...cfg, aiGenEnabled: enabled, aiGenCount: count }));
    } catch { /* */ }
  }

  function parseJson() {
    setParseError('');
    try {
      const obj = JSON.parse(rawJson) as ParsedPack;
      if (!obj.langCode || !obj.packName || !Array.isArray(obj.entries)) {
        throw new Error('缺少必要字段：langCode / packName / entries[]');
      }
      if (obj.entries.length === 0) throw new Error('entries 数组不能为空');
      setParsed(obj);
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : '无效 JSON');
      setParsed(null);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRawJson((ev.target?.result as string) ?? '');
      setParsed(null);
      setSaveMsg('');
    };
    reader.readAsText(file);
  }

  async function savePack() {
    if (!parsed) return;
    setSaving(true);
    setSaveMsg('');
    // Insert into textbook_index (one row per entry as a mini unit)
    const rows = parsed.entries.map((entry, i) => ({
      book_key: `${parsed.langCode}_custom_${parsed.packName.replace(/\s/g, '_').toLowerCase()}`,
      book_name: parsed.packName,
      book_name_zh: parsed.packName,
      unit_number: i + 1,
      unit_title: entry.word,
      vocab_tags: entry.tags ?? [],
      grammar_cats: [],
      order_index: i,
    }));

    const { error } = await supabase.from('textbook_index').upsert(rows, {
      onConflict: 'book_key,unit_number',
    });

    setSaving(false);
    if (error) {
      setSaveMsg(`保存失败：${error.message}`);
    } else {
      setSaveMsg(`✓ 已上传 ${rows.length} 条词条到"${parsed.packName}"`);
    }
  }

  const loadPacks = useCallback(async () => {
    setLoadingPacks(true);
    const { data } = await supabase
      .from('textbook_index')
      .select('id,book_name,unit_number')
      .order('book_name')
      .limit(100);
    // Deduplicate by book_name
    const seen = new Set<string>();
    const unique = (data ?? []).filter((r: { book_name: string }) => {
      if (seen.has(r.book_name)) return false;
      seen.add(r.book_name);
      return true;
    });
    setExistingPacks(unique.map((r: { id: string; book_name: string; unit_number: number }) => ({
      id: r.id,
      book_name: r.book_name,
      lang_code: 'unknown',
      unit_number: r.unit_number,
    })));
    setLoadingPacks(false);
  }, []);

  const [editJson, setEditJson] = useState('');
  const [editMsg, setEditMsg] = useState('');

  async function loadPackForEdit(bookName: string) {
    const { data } = await supabase
      .from('textbook_index')
      .select('*')
      .eq('book_name', bookName)
      .order('order_index');
    setEditJson(JSON.stringify(data ?? [], null, 2));
    setEditMsg('');
    setTab('edit');
  }

  async function saveEditedPack() {
    try {
      const rows = JSON.parse(editJson);
      const { error } = await supabase.from('textbook_index').upsert(rows, { onConflict: 'id' });
      setEditMsg(error ? `错误：${error.message}` : '✓ 保存成功');
    } catch (e) {
      setEditMsg(`JSON 格式错误：${(e as Error).message}`);
    }
  }

  return (
    <div className="lpa-shell">
      <FloatingBack onClick={onBack} />

      <div className="lpa-header">
        <h2 className="lpa-title">语言包管理</h2>
        <p className="lpa-sub">上传 · 在线编辑 · AI生成配置</p>
      </div>

      {/* AI Config strip */}
      <div className="lpa-ai-strip">
        <span className="lpa-ai-label">AI 智能生成</span>
        <label className="lpa-toggle">
          <input type="checkbox" checked={aiEnabled} onChange={(e) => {
            setAiEnabled(e.target.checked);
            saveAiConfig(e.target.checked, aiGenCount);
          }} />
          <span className="lpa-toggle-track" />
        </label>
        <span className="lpa-ai-label" style={{ marginLeft: 12 }}>每次生成数量</span>
        <input
          className="lpa-count-input"
          type="number" min={1} max={50}
          value={aiGenCount}
          onChange={(e) => {
            const v = Math.max(1, Math.min(50, Number(e.target.value)));
            setAiGenCount(v);
            saveAiConfig(aiEnabled, v);
          }}
        />
      </div>

      {/* Tabs */}
      <div className="lpa-tabs">
        {(['upload', 'edit', 'manage'] as const).map((t) => (
          <button
            key={t}
            className={`lpa-tab ${tab === t ? 'active' : ''}`}
            onClick={() => { setTab(t); if (t === 'manage') loadPacks(); }}
          >
            {t === 'upload' ? '上传语言包' : t === 'edit' ? '在线编辑' : '已有语言包'}
          </button>
        ))}
      </div>

      {/* ── UPLOAD ── */}
      {tab === 'upload' && (
        <div className="lpa-section">
          <p className="lpa-hint">支持 JSON 文件上传或直接粘贴 JSON 内容</p>

          <div className="lpa-file-row">
            <button className="lpa-file-btn" onClick={() => fileRef.current?.click()}>
              选择 JSON 文件
            </button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
            <span className="lpa-file-hint">或在下方直接编辑</span>
          </div>

          <div className="lpa-schema-hint">
            <strong>JSON 格式说明：</strong>
            <code className="lpa-code-block">{`{
  "langCode": "ja",
  "packName": "包名称",
  "entries": [
    { "word": "单词", "reading": "读音", "meaning": "释义",
      "example": "例句", "tags": ["标签"] }
  ]
}`}
            </code>
          </div>

          <textarea
            className="lpa-textarea"
            value={rawJson}
            onChange={(e) => { setRawJson(e.target.value); setParsed(null); }}
            rows={14}
            spellCheck={false}
          />

          {parseError && <p className="lpa-error">{parseError}</p>}

          <div className="lpa-action-row">
            <button className="lpa-parse-btn" onClick={parseJson}>解析并预览</button>
            {parsed && (
              <button className="lpa-save-btn" disabled={saving} onClick={savePack}>
                {saving ? '保存中…' : `上传 ${parsed.entries.length} 条词条`}
              </button>
            )}
          </div>

          {parsed && (
            <div className="lpa-preview">
              <p className="lpa-preview-title">
                {LANG_FLAGS[parsed.langCode] ?? '📦'} {parsed.packName}
                <span className="lpa-preview-count"> · {parsed.entries.length} 条</span>
              </p>
              <div className="lpa-preview-list">
                {parsed.entries.slice(0, 8).map((e, i) => (
                  <div key={i} className="lpa-preview-row">
                    <span className="lpa-preview-word">{e.word}</span>
                    {e.reading && <span className="lpa-preview-reading">（{e.reading}）</span>}
                    <span className="lpa-preview-meaning">{e.meaning}</span>
                  </div>
                ))}
                {parsed.entries.length > 8 && (
                  <p className="lpa-preview-more">…还有 {parsed.entries.length - 8} 条</p>
                )}
              </div>
            </div>
          )}

          {saveMsg && <p className={`lpa-save-msg ${saveMsg.startsWith('✓') ? 'ok' : 'err'}`}>{saveMsg}</p>}
        </div>
      )}

      {/* ── EDIT ── */}
      {tab === 'edit' && (
        <div className="lpa-section">
          <p className="lpa-hint">直接编辑语言包 JSON 并保存到数据库</p>
          {!editJson && <p className="lpa-hint" style={{ color: 'var(--ink-light)' }}>请先在"已有语言包"选择一个包来编辑</p>}
          {editJson && (
            <>
              <textarea
                className="lpa-textarea"
                value={editJson}
                onChange={(e) => setEditJson(e.target.value)}
                rows={20}
                spellCheck={false}
              />
              <button className="lpa-save-btn" onClick={saveEditedPack} style={{ marginTop: 12 }}>
                保存更改
              </button>
              {editMsg && <p className={`lpa-save-msg ${editMsg.startsWith('✓') ? 'ok' : 'err'}`}>{editMsg}</p>}
            </>
          )}
        </div>
      )}

      {/* ── MANAGE ── */}
      {tab === 'manage' && (
        <div className="lpa-section">
          {loadingPacks && <p className="lpa-hint">加载中…</p>}
          {!loadingPacks && existingPacks.length === 0 && <p className="lpa-hint">暂无语言包</p>}
          {existingPacks.map((p) => (
            <div className="lpa-pack-row" key={p.id}>
              <div className="lpa-pack-info">
                <span className="lpa-pack-name">{p.book_name}</span>
              </div>
              <button className="lpa-edit-btn" onClick={() => loadPackForEdit(p.book_name)}>
                在线编辑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
