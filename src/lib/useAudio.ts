import { useCallback, useRef, useEffect, useState } from 'react';

const MAX_FILES = 5;

function pickIndex(): number {
  return Math.floor(Math.random() * MAX_FILES) + 1;
}

// Shared AudioContext — reuse to avoid Chrome's autoplay limits
let sharedCtx: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
  if (sharedCtx && sharedCtx.state !== 'closed') return sharedCtx;
  try {
    sharedCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Resume if suspended (autoplay policy)
    if (sharedCtx.state === 'suspended') {
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

export function useAudio(volume = 0.8) {
  const currentRef = useRef<HTMLAudioElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Pre-warm AudioContext on first user interaction (handled by component mount)
    const warmUp = () => {
      getAudioContext();
      setInitialized(true);
    };
    // Small delay to ensure DOM is ready
    const t = setTimeout(warmUp, 100);
    return () => clearTimeout(t);
  }, []);

  const play = useCallback((dir: 'success' | 'failure') => {
    if (currentRef.current) {
      currentRef.current.pause();
      currentRef.current.currentTime = 0;
    }
    
    const audio = new Audio(`/audio/${dir}/${pickIndex()}.mp3`);
    audio.volume = volume;
    audio.play().catch(() => {
      // MP3 file not found or autoplay blocked — fall back to tone
      playTone(dir === 'success');
    });
    currentRef.current = audio;
  }, [volume]);

  const playSuccess = useCallback(() => play('success'), [play]);
  const playFailure = useCallback(() => play('failure'), [play]);

  return { playSuccess, playFailure, play };
}

/**
 * Generate a pleasant tone using Web Audio API.
 * Used as fallback when MP3 files are unavailable.
 * Creates a more musical sound: rising two-note for success, low buzz for failure.
 */
function playTone(isSuccess: boolean) {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  try {
    // Resume if suspended
    if (ctx.state === 'suspended') ctx.resume();
    
    const now = ctx.currentTime;
    
    if (isSuccess) {
      // Rising two-tone "ding-ding!" success sound
      [523.25, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = now + i * 0.12;
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } else {
      // Low buzz for failure
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = 180;
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch {
    // Silently fail — audio is non-critical
  }
}