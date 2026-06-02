import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FloatingBack } from './FloatingBack';

interface VirtualRadioProps {
  languageCode: string;
  languageName: string;
  profession?: string;
  onBack: () => void;
}

type RadioType = 'news' | 'music' | 'story' | 'business' | 'academic';
type PlaybackSpeed = 0.75 | 1 | 1.25;
type PronScore = 'accurate' | 'ok' | 'retry' | null;

interface RadioContent {
  id: string;
  lang_code: string;
  radio_type: RadioType;
  profession: string | null;
  title: string;
  content_text: string;
  duration: number;
  difficulty: string;
  order_index: number;
}

const RADIO_TYPES: { key: RadioType; icon: string; label: string; desc: string }[] = [
  { key: 'news',     icon: '📰', label: '新闻电台', desc: '每日语言新闻播报' },
  { key: 'music',    icon: '🎵', label: '音乐电台', desc: '当地流行音乐与文化' },
  { key: 'story',    icon: '🎭', label: '故事电台', desc: '短篇故事连载' },
  { key: 'business', icon: '💼', label: '商务电台', desc: '职场对话·商务邮件' },
  { key: 'academic', icon: '🎓', label: '学术电台', desc: '专业讲座风格' },
];

const LANG_SR_CODE: Record<string, string> = {
  ja: 'ja-JP', ko: 'ko-KR', fr: 'fr-FR', es: 'es-ES',
  de: 'de-DE', it: 'it-IT', pt: 'pt-BR', ar: 'ar-SA',
  zh: 'zh-CN', en: 'en-US',
};

// Difficulty colors
const DIFF_COLOR: Record<string, string> = {
  beginner: 'var(--bamboo)',
  intermediate: 'var(--gold)',
  advanced: 'var(--terra)',
};

// Offline fallback content when DB has nothing
const FALLBACK: Record<string, RadioContent> = {
  news: {
    id: 'fb-news', lang_code: 'en', radio_type: 'news', profession: null,
    title: '今日新闻（示例）',
    content_text: '欢迎收听虚拟广播电台新闻频道。这是一段示例新闻播报内容，用于演示电台功能。实际内容将从数据库动态加载，支持多语言、多类型广播内容。请连接数据库以获取完整内容。',
    duration: 30, difficulty: 'beginner', order_index: 0,
  },
  story: {
    id: 'fb-story', lang_code: 'en', radio_type: 'story', profession: null,
    title: '短篇故事（示例）',
    content_text: '从前，在一座宁静的小镇上，有一个热爱语言的年轻人。他每天通过收听广播来练习外语，久而久之，他的语言水平突飞猛进。这个故事告诉我们：坚持是成功的关键。',
    duration: 30, difficulty: 'beginner', order_index: 0,
  },
};

function useSpeechSynthesis() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, langCode: string, rate: number, onEnd?: () => void) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_SR_CODE[langCode] ?? 'en-US';
    utt.rate = rate;
    utt.onend = onEnd ?? null;
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, []);

  const pause = useCallback(() => window.speechSynthesis?.pause(), []);
  const resume = useCallback(() => window.speechSynthesis?.resume(), []);
  const cancel = useCallback(() => window.speechSynthesis?.cancel(), []);

  return { speak, pause, resume, cancel };
}

function scorePronunciation(transcript: string, reference: string): PronScore {
  const t = transcript.toLowerCase();
  const words = reference.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return 'ok';
  const matched = words.filter((w) => t.includes(w.replace(/[^a-z\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g, ''))).length;
  const ratio = matched / words.length;
  if (ratio >= 0.7) return 'accurate';
  if (ratio >= 0.35) return 'ok';
  return 'retry';
}

export const VirtualRadio: React.FC<VirtualRadioProps> = ({
  languageCode, languageName, profession, onBack,
}) => {
  const [activeType, setActiveType] = useState<RadioType>('news');
  const [contents, setContents] = useState<RadioContent[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  // Playback state
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [volume, setVolume] = useState(0.8);
  const [loop, setLoop] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Shadowing / follow-read mode
  const [shadowMode, setShadowMode] = useState(false);
  const [shadowRecording, setShadowRecording] = useState(false);
  const [shadowTranscript, setShadowTranscript] = useState('');
  const [shadowScore, setShadowScore] = useState<PronScore>(null);
  const [shadowPlayed, setShadowPlayed] = useState(false);

  const timerRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { speak, pause, resume, cancel } = useSpeechSynthesis();

  const current = contents[currentIdx] ?? null;

  // Reset shadow + playback state on language change
  useEffect(() => {
    setShadowMode(false);
    setShadowRecording(false);
    setShadowTranscript('');
    setShadowScore(null);
    setShadowPlayed(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* */ }
      recognitionRef.current = null;
    }
  }, [languageCode]);

  // Load content from DB
  useEffect(() => {
    setLoading(true);
    setPlaying(false);
    setElapsed(0);
    cancel();

    let query = supabase
      .from('radio_content')
      .select('*')
      .eq('lang_code', languageCode)
      .eq('radio_type', activeType)
      .order('order_index');

    // Prefer profession-matched content
    if (profession && profession !== '') {
      query = query.or(`profession.eq.${profession},profession.is.null`);
    }

    query.then(({ data }) => {
      const rows = (data ?? []) as RadioContent[];
      if (rows.length === 0) {
        // Use fallback
        const fb = FALLBACK[activeType] ?? FALLBACK['news'];
        setContents([{ ...fb, lang_code: languageCode }]);
      } else {
        setContents(rows);
      }
      setCurrentIdx(0);
      setLoading(false);
    });
  }, [languageCode, activeType, profession, cancel]);

  // Elapsed time counter
  useEffect(() => {
    if (playing && current) {
      timerRef.current = window.setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= current.duration) {
            clearInterval(timerRef.current!);
            setPlaying(false);
            if (loop) {
              setElapsed(0);
              setTimeout(() => setPlaying(true), 500);
            }
            return current.duration;
          }
          return next;
        });
      }, 1000 / speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, current, speed, loop]);

  function togglePlay() {
    if (!current) return;
    if (playing) {
      setPlaying(false);
      pause();
    } else {
      setPlaying(true);
      if (elapsed === 0 || elapsed >= current.duration) {
        setElapsed(0);
        speak(current.content_text, languageCode, speed, () => {
          setPlaying(false);
          if (loop) {
            setElapsed(0);
            setTimeout(() => setPlaying(true), 400);
          }
        });
      } else {
        resume();
      }
    }
  }

  function seekTo(pct: number) {
    if (!current) return;
    const newElapsed = Math.round(pct * current.duration);
    setElapsed(newElapsed);
    if (playing) {
      cancel();
      setElapsed(0);
      speak(current.content_text, languageCode, speed);
    }
  }

  function changeSpeed(s: PlaybackSpeed) {
    const wasPlaying = playing;
    setSpeed(s);
    if (wasPlaying && current) {
      cancel();
      setElapsed(0);
      setPlaying(true);
      speak(current.content_text, languageCode, s, () => setPlaying(false));
    }
  }

  function prevTrack() {
    cancel();
    setPlaying(false);
    setElapsed(0);
    setCurrentIdx((i) => Math.max(0, i - 1));
    setShadowScore(null);
    setShadowTranscript('');
    setShadowPlayed(false);
  }

  function nextTrack() {
    cancel();
    setPlaying(false);
    setElapsed(0);
    setCurrentIdx((i) => Math.min(contents.length - 1, i + 1));
    setShadowScore(null);
    setShadowTranscript('');
    setShadowPlayed(false);
  }

  // Shadow / follow-read
  function startShadow() {
    setShadowMode(true);
    setPlaying(false);
    cancel();
    setShadowScore(null);
    setShadowTranscript('');
    setShadowPlayed(false);
  }

  function playOriginalInShadow() {
    if (!current) return;
    setShadowPlayed(true);
    speak(current.content_text, languageCode, speed, () => setShadowPlayed(false));
  }

  function startShadowRecording() {
    const SRClass = (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SRClass) {
      setShadowTranscript('此浏览器不支持语音识别，请使用 Chrome/Safari');
      return;
    }

    const rec = new SRClass();
    rec.lang = LANG_SR_CODE[languageCode] ?? 'en-US';
    rec.continuous = false;
    rec.interimResults = true;

    rec.onstart = () => { setShadowRecording(true); setShadowTranscript(''); setShadowScore(null); };
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join('');
      setShadowTranscript(t);
    };
    rec.onend = () => {
      setShadowRecording(false);
      setShadowTranscript((t) => {
        if (t.trim() && current) {
          setShadowScore(scorePronunciation(t, current.content_text));
        }
        return t;
      });
    };
    rec.onerror = () => { setShadowRecording(false); setShadowTranscript('识别失败，请重试'); };

    recognitionRef.current = rec;
    rec.start();
  }

  function stopShadowRecording() {
    recognitionRef.current?.stop();
  }

  const progress = current ? elapsed / current.duration : 0;

  const scoreInfo: Record<NonNullable<PronScore>, { icon: string; label: string; color: string }> = {
    accurate: { icon: '🎯', label: '准确！发音非常棒', color: 'var(--bamboo)' },
    ok:       { icon: '📖', label: '还行，继续练习', color: 'var(--gold)' },
    retry:    { icon: '🔄', label: '再试一次，更清晰一点', color: 'var(--terra)' },
  };

  return (
    <div className="radio-shell">
      <FloatingBack onClick={() => { cancel(); onBack(); }} />

      {/* Header */}
      <div className="radio-header">
        <div className="radio-header-icon">🎙️</div>
        <div>
          <h2 className="radio-title">虚拟广播电台</h2>
          <p className="radio-sub">{languageName} · 沉浸式听力训练</p>
        </div>
      </div>

      {/* Type selector */}
      <div className="radio-type-strip">
        {RADIO_TYPES.map((t) => (
          <button
            key={t.key}
            className={`radio-type-btn ${activeType === t.key ? 'active' : ''}`}
            onClick={() => setActiveType(t.key)}
          >
            <span className="radio-type-icon">{t.icon}</span>
            <span className="radio-type-label">{t.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="radio-loading">
          <div className="radio-loading-wave">
            <span /><span /><span /><span /><span />
          </div>
          <p>加载电台内容…</p>
        </div>
      ) : !current ? (
        <div className="radio-empty">暂无{RADIO_TYPES.find((t) => t.key === activeType)?.label}内容</div>
      ) : (
        <>
          {/* Now playing card */}
          <div className="radio-player">
            <div className="radio-player-visual">
              <div className={`radio-vinyl ${playing ? 'spinning' : ''}`}>
                <span className="radio-vinyl-icon">
                  {RADIO_TYPES.find((t) => t.key === activeType)?.icon ?? '🎙️'}
                </span>
              </div>
              <div className="radio-waveform">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="radio-wave-bar"
                    style={{
                      animationDelay: `${(i * 0.07) % 0.5}s`,
                      animationPlayState: playing ? 'running' : 'paused',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="radio-track-info">
              <div className="radio-track-title">{current.title}</div>
              <div className="radio-track-meta">
                <span
                  className="radio-diff-badge"
                  style={{ background: DIFF_COLOR[current.difficulty] ?? 'var(--stone)' }}
                >
                  {current.difficulty === 'beginner' ? '初级' : current.difficulty === 'intermediate' ? '中级' : '高级'}
                </span>
                <span className="radio-track-type">
                  {RADIO_TYPES.find((t) => t.key === current.radio_type)?.label}
                </span>
                <span className="radio-track-duration">{Math.floor(current.duration / 60)}:{String(current.duration % 60).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="radio-progress-wrap">
              <span className="radio-time">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span>
              <div
                className="radio-progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seekTo((e.clientX - rect.left) / rect.width);
                }}
              >
                <div className="radio-progress-fill" style={{ width: `${progress * 100}%` }} />
                <div className="radio-progress-thumb" style={{ left: `${progress * 100}%` }} />
              </div>
              <span className="radio-time">{Math.floor(current.duration / 60)}:{String(current.duration % 60).padStart(2, '0')}</span>
            </div>

            {/* Controls */}
            <div className="radio-controls">
              <button className="radio-ctrl-btn" onClick={prevTrack} disabled={currentIdx === 0} title="上一条">⏮</button>
              <button className="radio-play-btn" onClick={togglePlay}>
                {playing ? '⏸' : '▶'}
              </button>
              <button className="radio-ctrl-btn" onClick={nextTrack} disabled={currentIdx === contents.length - 1} title="下一条">⏭</button>
              <button
                className={`radio-ctrl-btn ${loop ? 'active' : ''}`}
                onClick={() => setLoop((l) => !l)}
                title="单句循环"
              >🔁</button>
            </div>

            {/* Speed + Volume row */}
            <div className="radio-settings-row">
              <div className="radio-speed-group">
                {([0.75, 1, 1.25] as PlaybackSpeed[]).map((s) => (
                  <button
                    key={s}
                    className={`radio-speed-btn ${speed === s ? 'active' : ''}`}
                    onClick={() => changeSpeed(s)}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <div className="radio-volume-group">
                <span>🔈</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  className="radio-volume-slider"
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
                <span>🔊</span>
              </div>
            </div>

            {/* Track list */}
            {contents.length > 1 && (
              <div className="radio-tracklist">
                {contents.map((c, i) => (
                  <button
                    key={c.id}
                    className={`radio-track-item ${i === currentIdx ? 'active' : ''}`}
                    onClick={() => { cancel(); setPlaying(false); setElapsed(0); setCurrentIdx(i); setShadowScore(null); }}
                  >
                    <span className="radio-track-num">{i + 1}</span>
                    <span className="radio-track-name">{c.title}</span>
                    <span className="radio-track-len">{c.duration}s</span>
                  </button>
                ))}
              </div>
            )}

            {/* Shadow mode button */}
            {!shadowMode && (
              <button className="radio-shadow-trigger" onClick={startShadow}>
                🎤 跟读练习模式
              </button>
            )}
          </div>

          {/* Script panel */}
          <div className="radio-script">
            <div className="radio-script-label">
              <span>文字稿</span>
            </div>
            <p className="radio-script-text">{current.content_text}</p>
          </div>

          {/* Shadow mode panel */}
          {shadowMode && (
            <div className="radio-shadow-panel">
              <div className="radio-shadow-header">
                <span className="radio-shadow-title">🎤 跟读练习</span>
                <button
                  className="radio-shadow-close"
                  onClick={() => { setShadowMode(false); cancel(); setShadowTranscript(''); setShadowScore(null); }}
                >✕</button>
              </div>
              <p className="radio-shadow-guide">先听原音，再跟读，系统会给出发音评分。</p>

              <div className="radio-shadow-actions">
                <button
                  className={`radio-shadow-btn original ${shadowPlayed ? 'playing' : ''}`}
                  onClick={playOriginalInShadow}
                  disabled={shadowPlayed}
                >
                  {shadowPlayed ? '▶ 播放中…' : '▶ 听原音'}
                </button>
                <button
                  className={`radio-shadow-btn record ${shadowRecording ? 'recording' : ''}`}
                  onClick={shadowRecording ? stopShadowRecording : startShadowRecording}
                >
                  {shadowRecording ? (
                    <><span className="aic-rec-dot" /> 停止录音</>
                  ) : '🎤 开始跟读'}
                </button>
              </div>

              {shadowRecording && (
                <div className="radio-shadow-status recording">
                  <span className="aic-rec-dot" /> 正在录音… 请跟读文字稿内容
                </div>
              )}
              {shadowTranscript && !shadowRecording && (
                <div className="radio-shadow-status recognized">
                  ✓ 识别结果：{shadowTranscript}
                </div>
              )}
              {shadowScore && (
                <div
                  className="radio-shadow-score"
                  style={{ color: scoreInfo[shadowScore].color }}
                >
                  {scoreInfo[shadowScore].icon} {scoreInfo[shadowScore].label}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
