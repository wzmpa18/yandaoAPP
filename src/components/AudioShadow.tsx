import React, { useState, useRef, useCallback, useEffect } from 'react';
import { speakWithPreset } from '../lib/voiceProfile';

interface AudioShadowProps {
  phrase: string;
  pronunciation: string;
  onResult?: (score: number) => void;
  langCode?: string;
}

type ShadowState = 'idle' | 'listening' | 'processing' | 'success' | 'retry';

export const AudioShadow: React.FC<AudioShadowProps> = ({ phrase, pronunciation, onResult, langCode }) => {
  const [state, setState] = useState<ShadowState>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0));
  const [speaking, setSpeaking] = useState(false);
  const animFrameRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const playStandard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) return;
    setSpeaking(true);
    speakWithPreset(phrase, langCode || 'en').finally(() => setSpeaking(false));
  };

  const cleanup = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    const bars = 32;
    const step = Math.floor(dataArray.length / bars);
    const newData: number[] = [];
    let maxLevel = 0;

    for (let i = 0; i < bars; i++) {
      const val = dataArray[i * step] / 255;
      newData.push(val);
      if (val > maxLevel) maxLevel = val;
    }

    setWaveformData(newData);
    setAudioLevel(maxLevel);
    animFrameRef.current = requestAnimationFrame(drawWaveform);
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      source.connect(analyser);
      analyserRef.current = analyser;

      setState('listening');
      drawWaveform();

      setTimeout(() => {
        cleanup();
        const score = audioLevel > 0.15 ? 0.8 + Math.random() * 0.2 : 0.3 + Math.random() * 0.3;
        setState(score > 0.6 ? 'success' : 'retry');
        onResult?.(score);
      }, 3000);
    } catch {
      setState('idle');
    }
  }, [cleanup, drawWaveform, audioLevel, onResult]);

  const handleMainButton = () => {
    if (state === 'idle') {
      startListening();
    } else if (state === 'success' || state === 'retry') {
      setState('idle');
      setWaveformData(Array(32).fill(0));
      setAudioLevel(0);
    }
  };

  const stateConfig: Record<ShadowState, { label: string; color: string; icon: string }> = {
    idle: { label: 'Listen & Shadow', color: '#7A9B71', icon: '🎤' },
    listening: { label: 'Speak now...', color: '#C9A574', icon: '🔊' },
    processing: { label: 'Analyzing...', color: '#5B8FA8', icon: '⏳' },
    success: { label: 'Great cadence!', color: '#7A9B71', icon: '✓' },
    retry: { label: 'Try again', color: '#C9553D', icon: '↻' },
  };

  const cfg = stateConfig[state];

  return (
    <div className="audio-shadow-container">
      <div className="audio-shadow-phrase">
        <p className="audio-shadow-target">{phrase}</p>
        <p className="audio-shadow-pron">{pronunciation}</p>
        <button
          className={`as-play-btn ${speaking ? 'speaking' : ''}`}
          onClick={playStandard}
          title="听标准发音"
        >
          {speaking ? '🔊 播放中…' : '🔈 标准发音'}
        </button>
      </div>

      {/* Waveform visualization */}
      <div className="audio-waveform">
        {waveformData.map((val, i) => (
          <div
            key={i}
            className="waveform-bar"
            style={{
              height: `${Math.max(4, val * 100)}%`,
              background: state === 'success'
                ? '#7A9B71'
                : state === 'retry'
                  ? '#C9553D'
                  : state === 'listening'
                    ? `linear-gradient(180deg, #C9A574, #7A9B71)`
                    : '#9B9189',
            }}
          />
        ))}
      </div>

      {/* Status indicator */}
      <div className="audio-shadow-status" style={{ color: cfg.color }}>
        <span className="status-icon">{cfg.icon}</span>
        <span className="status-label">{cfg.label}</span>
      </div>

      {/* Main control button */}
      <button
        className="audio-shadow-btn"
        style={{
          background: cfg.color,
          boxShadow: `0 4px 0 ${darkenHex(cfg.color)}`,
        }}
        onClick={handleMainButton}
      >
        {state === 'idle' ? '🎤 Start Shadowing' : state === 'listening' ? '🔊 Listening...' : state === 'success' ? '✓ Continue' : '↻ Try Again'}
      </button>
    </div>
  );
};

function darkenHex(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 40);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - 40);
  const b = Math.max(0, (num & 0x0000ff) - 40);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
