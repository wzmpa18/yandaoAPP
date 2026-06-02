import { useCallback, useRef } from 'react';

// Maximum number of files to try per directory (1.mp3 … MAX_FILES.mp3)
const MAX_FILES = 5;

function pickIndex(): number {
  return Math.floor(Math.random() * MAX_FILES) + 1;
}

export function useAudio(volume = 0.5) {
  // Keep a ref to the last Audio instance so we can stop it before playing the next
  const currentRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((dir: 'success' | 'failure') => {
    // Stop previous sound if still playing
    if (currentRef.current) {
      currentRef.current.pause();
      currentRef.current.currentTime = 0;
    }
    const audio = new Audio(`/audio/${dir}/${pickIndex()}.mp3`);
    audio.volume = volume;
    // Silently ignore missing files or autoplay policy blocks
    audio.play().catch(() => {});
    currentRef.current = audio;
  }, [volume]);

  const playSuccess = useCallback(() => play('success'), [play]);
  const playFailure = useCallback(() => play('failure'), [play]);

  return { playSuccess, playFailure, play };
}
