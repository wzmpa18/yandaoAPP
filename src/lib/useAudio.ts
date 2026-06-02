import { useCallback, useRef, useEffect, useState } from 'react';

const MAX_FILES = 5;

function pickIndex(): number {
  return Math.floor(Math.random() * MAX_FILES) + 1;
}

export function useAudio(volume = 0.8) {
  const currentRef = useRef<HTMLAudioElement | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAudio = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setInitialized(true);
    };
    initAudio();
  }, []);

  const play = useCallback((dir: 'success' | 'failure') => {
    if (!initialized) return;
    
    if (currentRef.current) {
      currentRef.current.pause();
      currentRef.current.currentTime = 0;
    }
    
    const audio = new Audio(`/audio/${dir}/${pickIndex()}.mp3`);
    audio.volume = volume;
    audio.play().catch(err => {
      console.warn('Audio play failed, using Web Audio API fallback:', err);
      playTone(dir === 'success');
    });
    currentRef.current = audio;
  }, [volume, initialized]);

  const playSuccess = useCallback(() => play('success'), [play]);
  const playFailure = useCallback(() => play('failure'), [play]);

  return { playSuccess, playFailure, play };
}

function playTone(isSuccess: boolean) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = isSuccess ? 800 : 200;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(isSuccess ? 0.3 : 0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch {
    console.warn('Web Audio API not available');
  }
}