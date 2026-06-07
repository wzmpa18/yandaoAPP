import React, { useState } from 'react';
import { VOICE_PRESETS, VoicePreset, saveVoicePreset, speakWithPreset } from '../lib/voiceProfile';

interface VoicePickerProps {
  currentId: number;
  onSelect: (preset: VoicePreset) => void;
  onClose: () => void;
}

const GROUP_LABELS: Record<string, string> = {
  kid: '🧒 儿童组 · 可爱治愈',
  teen: '💖 少女组 · 甜美治愈',
  adult: '🌸 成人组 · 知性治愈',
};
const GROUP_ICONS: Record<string, string> = {
  kid: '🧒', teen: '💖', adult: '🌸',
};
const GROUP_ORDER: Array<'kid' | 'teen' | 'adult'> = ['kid', 'teen', 'adult'];

const DEMO_TEXT: Record<string, string> = {
  zh: '你好！我是你的语言学习伙伴～一起加油吧！',
  ja: 'こんにちは！一緒に頑張りましょう～',
  en: 'Hello! I am your language learning companion. Let us learn together!',
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
                        <span className="vp-option-persona">{preset.persona}</span>
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
            🎙️ 采用微软自然语音引擎 · 治愈系美少女/磁性男声/萌娃童声 · 点击 ▶ 试听
          </p>
          <button className="vp-done" onClick={onClose}>完成</button>
        </div>
      </div>
    </div>
  );
};
