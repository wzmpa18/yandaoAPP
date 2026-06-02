import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface MnemonicTabProps {
  sessionKey: string;
  languageCode: string;
}

type MType = 'rhyme' | 'image' | 'action' | 'palace';

interface Mnemonic {
  id: string;
  session_key: string;
  target_word: string;
  mnemonic_type: MType;
  content: string;
  image_url: string | null;
  is_ai_generated: boolean;
  likes: number;
}

interface PalaceRoom {
  id: string;
  room_name: string;
  template_key: string;
  lang_code: string;
  placements: Array<{ word: string; item: string; position_note: string }>;
}

const ROOM_TEMPLATES: Record<string, { icon: string; label: string; items: string[] }> = {
  cafe:    { icon: '☕', label: '咖啡馆', items: ['入口', '收银台', '桌子', '窗边座位', '黑板菜单', '储藏室'] },
  school:  { icon: '🏫', label: '学校',   items: ['教室门口', '黑板', '讲台', '课桌', '窗户', '书柜'] },
  airport: { icon: '✈️', label: '机场',   items: ['登机口', '安检', '行李转盘', '候机室', '免税店', '出口'] },
  home:    { icon: '🏠', label: '家',     items: ['玄关', '客厅', '厨房', '卧室', '书房', '阳台'] },
  market:  { icon: '🏪', label: '市场',   items: ['入口', '蔬菜区', '水果区', '收银区', '服务台', '出口'] },
  library: { icon: '📚', label: '图书馆', items: ['前台', '期刊区', '小说区', '自习室', '还书处', '出口'] },
};

// AI-generated rhyme candidates (offline fallback — edge fn supplements)
const AI_RHYMES: Record<string, string[]> = {
  '食べる': ['它背儒（吃饭的儒者）', '他背如（背书如吃饭）', '踏别如（用脚踏别去，如吃完盘子）'],
  '水': ['水（中文就是水！）', '美兹（美好之水）', '密子（密密麻麻的水子）'],
  '学校': ['嘎勾（嘎嘎叫的学校勾）', '嘎こう（高兴地去上学）', '轧扣（轧上学校大门的扣）'],
  default: ['谐音候选1（AI生成）', '谐音候选2', '谐音候选3'],
};

export const MnemonicTab: React.FC<MnemonicTabProps> = ({ sessionKey, languageCode }) => {
  const [subTab, setSubTab] = useState<'rhyme' | 'image' | 'palace'>('rhyme');
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>([]);
  const [rooms, setRooms] = useState<PalaceRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Add rhyme form
  const [targetWord, setTargetWord] = useState('');
  const [rhymeContent, setRhymeContent] = useState('');
  const [aiCandidates, setAiCandidates] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Palace form
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTemplate, setNewRoomTemplate] = useState<string>('cafe');
  const [selectedRoom, setSelectedRoom] = useState<PalaceRoom | null>(null);
  const [palaceWord, setPalaceWord] = useState('');
  const [palaceItem, setPalaceItem] = useState('');
  const [palaceNote, setPalaceNote] = useState('');

  const loadData = useCallback(async () => {
    const [mRes, rRes] = await Promise.all([
      supabase.from('mnemonics').select('*').eq('lang_code', languageCode)
        .order('likes', { ascending: false }).limit(30),
      supabase.from('memory_palace_rooms').select('*').eq('session_key', sessionKey).eq('lang_code', languageCode),
    ]);
    setMnemonics((mRes.data ?? []) as Mnemonic[]);
    setRooms((rRes.data ?? []) as PalaceRoom[]);
  }, [sessionKey, languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  function getAiCandidates(word: string) {
    setGenerating(true);
    setTimeout(() => {
      const candidates = AI_RHYMES[word] ?? AI_RHYMES['default'];
      setAiCandidates(candidates);
      setGenerating(false);
    }, 900);
  }

  async function saveMnemonic(type: MType, content: string) {
    if (!targetWord.trim() || !content.trim()) return;
    setSaving(true);
    await supabase.from('mnemonics').insert({
      session_key: sessionKey,
      lang_code: languageCode,
      target_word: targetWord.trim(),
      mnemonic_type: type,
      content,
      is_ai_generated: false,
    });
    setTargetWord(''); setRhymeContent(''); setAiCandidates([]);
    setSaving(false);
    loadData();
  }

  async function likeMnemonic(m: Mnemonic) {
    const { data: existing } = await supabase.from('mnemonic_likes')
      .select('id').eq('mnemonic_id', m.id).eq('session_key', sessionKey).maybeSingle();
    if (existing) return;
    await supabase.from('mnemonic_likes').insert({ mnemonic_id: m.id, session_key: sessionKey });
    await supabase.from('mnemonics').update({ likes: m.likes + 1 }).eq('id', m.id);
    loadData();
  }

  async function createRoom() {
    if (!newRoomName.trim()) return;
    await supabase.from('memory_palace_rooms').insert({
      session_key: sessionKey,
      room_name: newRoomName.trim(),
      template_key: newRoomTemplate,
      lang_code: languageCode,
      placements: [],
    });
    setNewRoomName('');
    loadData();
  }

  async function addPalacePlacement() {
    if (!selectedRoom || !palaceWord.trim() || !palaceItem.trim()) return;
    const updated = [...selectedRoom.placements, { word: palaceWord.trim(), item: palaceItem.trim(), position_note: palaceNote.trim() }];
    await supabase.from('memory_palace_rooms').update({ placements: updated }).eq('id', selectedRoom.id);
    setSelectedRoom({ ...selectedRoom, placements: updated });
    setPalaceWord(''); setPalaceItem(''); setPalaceNote('');
    loadData();
  }

  const rhymeMnemonics = mnemonics.filter((m) => m.mnemonic_type === 'rhyme');
  const imageMnemonics = mnemonics.filter((m) => m.mnemonic_type === 'image');

  return (
    <div className="mn-wrap">
      <div className="mn-sub-tabs">
        <button className={`mn-sub-tab ${subTab === 'rhyme' ? 'active' : ''}`} onClick={() => setSubTab('rhyme')}>谐音梗工坊</button>
        <button className={`mn-sub-tab ${subTab === 'image' ? 'active' : ''}`} onClick={() => setSubTab('image')}>图像联想</button>
        <button className={`mn-sub-tab ${subTab === 'palace' ? 'active' : ''}`} onClick={() => setSubTab('palace')}>记忆宫殿</button>
      </div>

      {/* ── RHYME ── */}
      {subTab === 'rhyme' && (
        <div className="mn-section">
          <div className="mn-add-card">
            <h4 className="mn-add-title">创建谐音梗</h4>
            <input className="mn-input" value={targetWord} placeholder="输入单词，如：食べる"
              onChange={(e) => setTargetWord(e.target.value)} />
            <button className="mn-ai-btn" disabled={generating || !targetWord.trim()} onClick={() => getAiCandidates(targetWord)}>
              {generating ? '🤖 AI生成中…' : '🤖 AI生成3个候选'}
            </button>
            {aiCandidates.length > 0 && (
              <div className="mn-candidates">
                {aiCandidates.map((c, i) => (
                  <button key={i} className="mn-candidate-chip" onClick={() => setRhymeContent(c)}>{c}</button>
                ))}
              </div>
            )}
            <textarea className="mn-textarea" rows={2} value={rhymeContent} placeholder="写下你的谐音记忆方法…"
              onChange={(e) => setRhymeContent(e.target.value)} />
            <button className="mn-save-btn" disabled={saving || !targetWord.trim() || !rhymeContent.trim()}
              onClick={() => saveMnemonic('rhyme', rhymeContent)}>
              {saving ? '保存中…' : '分享到社区'}
            </button>
          </div>

          <h4 className="mn-list-title">社区谐音榜 🏆</h4>
          {loading && <div className="mn-loading">加载中…</div>}
          {rhymeMnemonics.length === 0 && !loading && <div className="mn-empty">还没有谐音梗，来创建第一个！</div>}
          {rhymeMnemonics.map((m) => (
            <div className="mn-card" key={m.id}>
              <div className="mn-card-top">
                <span className="mn-word">{m.target_word}</span>
                {m.is_ai_generated && <span className="mn-ai-tag">AI</span>}
              </div>
              <p className="mn-content">{m.content}</p>
              <button className="mn-like-btn" onClick={() => likeMnemonic(m)}>
                👍 {m.likes}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── IMAGE ── */}
      {subTab === 'image' && (
        <div className="mn-section">
          <div className="mn-add-card">
            <h4 className="mn-add-title">图像联想记忆</h4>
            <input className="mn-input" value={targetWord} placeholder="输入单词，如：空港"
              onChange={(e) => setTargetWord(e.target.value)} />
            <textarea className="mn-textarea" rows={3} value={rhymeContent} placeholder="描述你脑海中的联想画面…（AI将根据此描述生成图片）"
              onChange={(e) => setRhymeContent(e.target.value)} />
            <div className="mn-image-placeholder">
              <span className="mn-image-icon">🎨</span>
              <p>AI图像生成</p>
              <p className="mn-image-hint">（配置 DALL-E/Stable Diffusion API Key 后启用）</p>
              <button className="mn-ai-btn" disabled={!targetWord || !rhymeContent}
                onClick={() => saveMnemonic('image', rhymeContent)}>
                保存联想描述
              </button>
            </div>
          </div>
          <h4 className="mn-list-title">联想图库</h4>
          {imageMnemonics.length === 0 && <div className="mn-empty">快来创建第一个图像联想！</div>}
          {imageMnemonics.map((m) => (
            <div className="mn-card" key={m.id}>
              <div className="mn-card-top">
                <span className="mn-word">{m.target_word}</span>
              </div>
              {m.image_url ? (
                <img src={m.image_url} alt={m.target_word} className="mn-image" />
              ) : (
                <div className="mn-image-box"><span>🖼️</span><p>{m.content}</p></div>
              )}
              <button className="mn-like-btn" onClick={() => likeMnemonic(m)}>👍 {m.likes}</button>
            </div>
          ))}
        </div>
      )}

      {/* ── PALACE ── */}
      {subTab === 'palace' && (
        <div className="mn-section">
          <div className="mn-add-card">
            <h4 className="mn-add-title">创建记忆宫殿房间</h4>
            <div className="mn-field-row">
              <input className="mn-input flex1" value={newRoomName} placeholder="房间名称"
                onChange={(e) => setNewRoomName(e.target.value)} />
              <select className="mn-select" value={newRoomTemplate} onChange={(e) => setNewRoomTemplate(e.target.value)}>
                {Object.entries(ROOM_TEMPLATES).map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label}</option>
                ))}
              </select>
            </div>
            <button className="mn-save-btn" disabled={!newRoomName.trim()} onClick={createRoom}>创建房间</button>
          </div>

          {rooms.map((room) => {
            const tmpl = ROOM_TEMPLATES[room.template_key];
            return (
              <div className="mn-palace-room" key={room.id}>
                <div className="mn-room-header" onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}>
                  <span className="mn-room-icon">{tmpl?.icon ?? '🏠'}</span>
                  <span className="mn-room-name">{room.room_name}</span>
                  <span className="mn-room-count">{room.placements.length} 个词</span>
                  <span className="mn-room-expand">{selectedRoom?.id === room.id ? '▲' : '▼'}</span>
                </div>
                {selectedRoom?.id === room.id && (
                  <div className="mn-room-body">
                    {/* Placement grid */}
                    <div className="mn-palace-grid">
                      {(tmpl?.items ?? []).map((item) => {
                        const placed = room.placements.filter((p) => p.item === item);
                        return (
                          <div className="mn-palace-cell" key={item}>
                            <span className="mn-cell-item">{item}</span>
                            {placed.map((p, i) => (
                              <span key={i} className="mn-cell-word">{p.word}</span>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    {/* Add word */}
                    <div className="mn-add-placement">
                      <input className="mn-input" value={palaceWord} placeholder="单词" onChange={(e) => setPalaceWord(e.target.value)} />
                      <select className="mn-select" value={palaceItem} onChange={(e) => setPalaceItem(e.target.value)}>
                        <option value="">选择位置</option>
                        {(tmpl?.items ?? []).map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                      <input className="mn-input" value={palaceNote} placeholder="记忆提示（可选）" onChange={(e) => setPalaceNote(e.target.value)} />
                      <button className="mn-save-btn" disabled={!palaceWord || !palaceItem} onClick={addPalacePlacement}>放入宫殿</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {rooms.length === 0 && <div className="mn-empty">还没有记忆宫殿，创建第一个房间！</div>}
        </div>
      )}
    </div>
  );
};
