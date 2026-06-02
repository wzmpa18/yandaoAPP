import React, { useState } from 'react';
import { VOICE_PRESETS, VoicePreset, saveVoicePreset, speakWithPreset } from '../lib/voiceProfile';

interface VoicePickerProps {
  currentId: number;
  onSelect: (preset: VoicePreset) => void;
  onClose: () => void;
}

const GROUP_LABELS: Record<string, string> = {
  child: '儿童（3–12岁）',
  student: '学生（13–22岁）',
  adult: '青年/成人（23–50岁）',
};
const GROUP_ICONS: Record<string, string> = {
  child: '🧒', student: '🎓', adult: '👤',
};
const GROUP_ORDER: Array<'child' | 'student' | 'adult'> = ['child', 'student', 'adult'];

const DEMO_TEXT: Record<string, string> = {
  zh: '你好！我是你的语言学习伙伴。',
  ja: 'こんにちは！私はあなたの言語学習の仲間です。',
  en: 'Hello! I am your language learning companion.',
};

export const VoicePicker: React.FC<VoicePickerProps> = ({ currentId, onSelect, onClose }) => {
  const [selected, setSelected] = useState(currentId);
  const [previewLang, setPreviewLang] = useState<'zh' | 'ja' | 'en'>('zh');

  function pick(preset: VoicePreset) {
    setSelected(preset.id);
    saveVoicePreset(preset.id);
    onSelect(preset);
    // Preview speak
    speakWithPreset(preset.encouragement, 'zh', preset);
  }

  function preview(preset: VoicePreset) {
    speakWithPreset(DEMO_TEXT[previewLang], previewLang, preset);
  }

  return (
    <div className="vp-overlay" onClick={onClose}>
      <div className="vp-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="vp-header">
          <h3 className="vp-title">声音选择</h3>
          <div className="vp-lang-row">
            {(['zh', 'ja', 'en'] as const).map((l) => (
              <button
                key={l}
                className={`vp-lang-btn ${previewLang === l ? 'active' : ''}`}
                onClick={() => setPreviewLang(l)}
              >
                {l === 'zh' ? '中文' : l === 'ja' ? '日语' : 'EN'}
              </button>
            ))}
            <span className="vp-lang-hint">试听语言</span>
          </div>
          <button className="vp-close" onClick={onClose}>✕</button>
        </div>

        <div className="vp-body">
          {GROUP_ORDER.map((group) => (
            <div key={group} className="vp-group">
              <div className="vp-group-label">
                {GROUP_ICONS[group]} {GROUP_LABELS[group]}
              </div>
              <div className="vp-options">
                {VOICE_PRESETS.filter((p) => p.group === group).map((preset) => (
                  <div
                    key={preset.id}
                    className={`vp-option ${selected === preset.id ? 'active' : ''}`}
                    onClick={() => pick(preset)}
                  >
                    <div className="vp-option-left">
                      <span className="vp-option-num">{preset.id}</span>
                      <div className="vp-option-info">
                        <span className="vp-option-name">{preset.name}</span>
                        <span className="vp-option-params">
                          音调 {preset.pitch.toFixed(1)} · 语速 {preset.rate.toFixed(2)}x
                        </span>
                      </div>
                    </div>
                    <div className="vp-option-right">
                      {selected === preset.id && <span className="vp-check">✓</span>}
                      <button
                        className="vp-preview-btn"
                        onClick={(e) => { e.stopPropagation(); preview(preset); }}
                        title="试听"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="vp-footer">
          <p className="vp-note">
            声音效果取决于设备支持的语音引擎。点击 ▶ 可试听效果。
          </p>
          <button className="vp-done" onClick={onClose}>完成</button>
        </div>
      </div>
    </div>
  );
};
