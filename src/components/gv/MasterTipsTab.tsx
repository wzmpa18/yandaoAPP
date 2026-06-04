import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../data/supabase';

interface MasterTipsTabProps {
  sessionKey: string;
  languageCode: string;
}

type TipCategory = 'grammar' | 'vocab' | 'listening' | 'speaking' | 'memory';

interface MasterTip {
  id: string;
  author_key: string;
  author_name: string;
  lang_code: string;
  target_level: string;
  title: string;
  content_text: string;
  audio_url: string | null;
  example_text: string;
  category: TipCategory;
  likes: number;
  total_rewards: number;
}

const CAT_LABEL: Record<TipCategory, string> = {
  grammar: '语法', vocab: '词汇', listening: '听力', speaking: '口语', memory: '记忆法',
};
const CAT_ICON: Record<TipCategory, string> = {
  grammar: '📐', vocab: '📘', listening: '🎧', speaking: '🎙️', memory: '🧠',
};

const REWARD_OPTIONS = [
  { label: '点杯咖啡', fen: 300 },
  { label: '感谢一餐', fen: 1000 },
  { label: '挚诚打赏', fen: 5000 },
];

// Seeded demo tips (shown when DB is empty)
const DEMO_TIPS: MasterTip[] = [
  {
    id: 'demo1', author_key: 'demo', author_name: '日语达人·田中', lang_code: 'ja',
    target_level: 'N3', title: '「は」vs「が」三秒判断法',
    content_text: '记住：「は」提话题，「が」强调主体。想突出"是谁"用が，想引出话题用は。口诀：「は=话题帽，が=注目灯」',
    audio_url: null, example_text: '彼は学生です（他是学生）vs 彼が学生です（强调是他是学生）',
    category: 'grammar', likes: 42, total_rewards: 12000,
  },
  {
    id: 'demo2', author_key: 'demo', author_name: '词汇女王·Mia', lang_code: 'ja',
    target_level: 'N2', title: 'N2汉字词200个必背：谐音串记法',
    content_text: '把汉字词按读音归类，用中文谐音串联。如：促進(そくしん)=锁金/踹金，想象"锁住金，踹一脚就促进"。',
    audio_url: null, example_text: '促進（そくしん）→ 锁金 → 促进', category: 'vocab', likes: 89, total_rewards: 45000,
  },
];

export const MasterTipsTab: React.FC<MasterTipsTabProps> = ({ sessionKey, languageCode }) => {
  const [tips, setTips] = useState<MasterTip[]>([]);
  const [filterCat, setFilterCat] = useState<TipCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rewardTarget, setRewardTarget] = useState<MasterTip | null>(null);
  const [rewardDone, setRewardDone] = useState(false);
  const [commissionPct, setCommissionPct] = useState(20);

  // Submit tip form
  const [showSubmit, setShowSubmit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [newCat, setNewCat] = useState<TipCategory>('grammar');
  const [newAuthor, setNewAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const loadData = useCallback(async () => {
    const [tRes, cfgRes] = await Promise.all([
      supabase.from('master_tips').select('*').eq('lang_code', languageCode).eq('is_approved', true)
        .order('likes', { ascending: false }).limit(20),
      supabase.from('platform_configs').select('value').eq('key', 'tip_commission_pct').maybeSingle(),
    ]);
    const data = tRes.data ?? [];
    setTips(data.length > 0 ? (data as MasterTip[]) : DEMO_TIPS.filter((d) => d.lang_code === languageCode || languageCode === 'ja'));
    if (cfgRes.data) setCommissionPct(parseInt(cfgRes.data.value) || 20);
  }, [languageCode]);

  useEffect(() => {
    setLoading(true);
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  async function likeTip(tip: MasterTip) {
    if (tip.id.startsWith('demo')) return;
    await supabase.from('master_tips').update({ likes: tip.likes + 1 }).eq('id', tip.id);
    loadData();
  }

  async function sendReward(tip: MasterTip, amountFen: number) {
    const commFen = Math.round(amountFen * commissionPct / 100);
    const authorFen = amountFen - commFen;
    if (!tip.id.startsWith('demo')) {
      await supabase.from('tip_rewards').insert({
        tip_id: tip.id, giver_key: sessionKey,
        amount_fen: amountFen, commission_fen: commFen, author_income: authorFen, is_simulated: true,
      });
      await supabase.from('master_tips').update({ total_rewards: tip.total_rewards + amountFen }).eq('id', tip.id);
    }
    setRewardDone(true);
    setTimeout(() => { setRewardTarget(null); setRewardDone(false); loadData(); }, 2000);
  }

  async function submitTip() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    await supabase.from('master_tips').insert({
      author_key: sessionKey,
      author_name: newAuthor.trim() || '匿名达人',
      lang_code: languageCode,
      target_level: newLevel.trim(),
      title: newTitle.trim(),
      content_text: newContent.trim(),
      example_text: newExample.trim(),
      category: newCat,
    });
    setSubmitting(false);
    setSubmitDone(true);
    setNewTitle(''); setNewContent(''); setNewExample(''); setNewLevel('');
    setTimeout(() => { setSubmitDone(false); setShowSubmit(false); loadData(); }, 1500);
  }

  const displayed = filterCat === 'all' ? tips : tips.filter((t) => t.category === filterCat);

  return (
    <div className="mt-wrap">
      {/* Header */}
      <div className="mt-header">
        <div>
          <h3 className="mt-title">大咖秘籍库</h3>
          <p className="mt-sub">语言达人独门记忆法 · 打赏支持创作者</p>
        </div>
        <button className="mt-submit-btn" onClick={() => setShowSubmit(!showSubmit)}>+ 上传秘籍</button>
      </div>

      {/* Submit form */}
      {showSubmit && (
        <div className="mt-submit-form">
          {submitDone ? (
            <div className="mt-submit-done">✅ 秘籍已提交审核！</div>
          ) : (
            <>
              <h4 className="mt-form-title">上传你的独门秘籍</h4>
              <input className="mt-input" value={newAuthor} placeholder="你的昵称（达人名）" onChange={(e) => setNewAuthor(e.target.value)} />
              <input className="mt-input" value={newTitle} placeholder="秘籍标题（如：N2汉字50必考速记法）" onChange={(e) => setNewTitle(e.target.value)} />
              <div className="mt-field-row">
                <select className="mt-select" value={newCat} onChange={(e) => setNewCat(e.target.value as TipCategory)}>
                  {Object.entries(CAT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input className="mt-input half" value={newLevel} placeholder="适用级别，如N2/B1" onChange={(e) => setNewLevel(e.target.value)} />
              </div>
              <textarea className="mt-textarea" rows={4} value={newContent} placeholder="详细讲解你的记忆方法（文字口诀+步骤）…"
                onChange={(e) => setNewContent(e.target.value)} />
              <textarea className="mt-textarea" rows={2} value={newExample} placeholder="示例（可选）"
                onChange={(e) => setNewExample(e.target.value)} />
              <p className="mt-commission-note">平台抽成 {commissionPct}%，你得 {100 - commissionPct}%</p>
              <button className="mt-save-btn" disabled={submitting || !newTitle.trim() || !newContent.trim()} onClick={submitTip}>
                {submitting ? '提交中…' : '提交审核'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Category filter */}
      <div className="mt-cat-filter">
        <button className={`mt-cat-btn ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>全部</button>
        {(Object.keys(CAT_LABEL) as TipCategory[]).map((c) => (
          <button key={c} className={`mt-cat-btn ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>
            {CAT_ICON[c]} {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      {/* Tips list */}
      {loading && <div className="mt-loading">加载秘籍…</div>}
      {displayed.map((tip) => (
        <div className="mt-card" key={tip.id}>
          <div className="mt-card-top" onClick={() => setExpandedId(expandedId === tip.id ? null : tip.id)}>
            <div className="mt-card-left">
              <span className="mt-card-cat">{CAT_ICON[tip.category]} {CAT_LABEL[tip.category]}</span>
              {tip.target_level && <span className="mt-level-tag">{tip.target_level}</span>}
              <span className="mt-card-title">{tip.title}</span>
              <span className="mt-card-author">— {tip.author_name}</span>
            </div>
            <span className="mt-expand">{expandedId === tip.id ? '▲' : '▼'}</span>
          </div>

          {expandedId === tip.id && (
            <div className="mt-card-body">
              <p className="mt-card-content">{tip.content_text}</p>
              {tip.example_text && (
                <div className="mt-example-box">
                  <span className="mt-example-label">示例</span>
                  <p className="mt-example-text">{tip.example_text}</p>
                </div>
              )}
              {tip.audio_url && (
                <audio controls src={tip.audio_url} className="mt-audio" />
              )}
              <div className="mt-card-actions">
                <button className="mt-like-btn" onClick={() => likeTip(tip)}>👍 {tip.likes}</button>
                <span className="mt-reward-total">💰 已获打赏 ¥{(tip.total_rewards / 100).toFixed(0)}</span>
                <button className="mt-reward-btn" onClick={() => { setRewardTarget(tip); setRewardDone(false); }}>打赏支持</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Reward modal */}
      {rewardTarget && (
        <div className="mt-modal-overlay" onClick={() => setRewardTarget(null)}>
          <div className="mt-modal" onClick={(e) => e.stopPropagation()}>
            {rewardDone ? (
              <div className="mt-reward-done">🎉 打赏成功！感谢支持创作者</div>
            ) : (
              <>
                <h4 className="mt-modal-title">打赏「{rewardTarget.author_name}」</h4>
                <p className="mt-modal-sub">平台抽成 {commissionPct}%，作者得 {100 - commissionPct}%</p>
                <div className="mt-reward-opts">
                  {REWARD_OPTIONS.map((o) => (
                    <button key={o.fen} className="mt-reward-opt" onClick={() => sendReward(rewardTarget, o.fen)}>
                      <span>{o.label}</span>
                      <span className="mt-reward-price">¥{(o.fen / 100).toFixed(0)}</span>
                    </button>
                  ))}
                </div>
                <button className="mt-modal-cancel" onClick={() => setRewardTarget(null)}>取消</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
