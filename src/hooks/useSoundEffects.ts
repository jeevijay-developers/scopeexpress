import { useCallback, useRef } from 'react';

interface SoundEffects {
  playCorrect: () => void;
  playWrong: () => void;
  playLevelUp: () => void;
  playClick: () => void;
}

export const useSoundEffects = (): SoundEffects => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [getAudioContext]);

  const playCorrect = useCallback(() => {
    // Happy ascending arpeggio
    playTone(523.25, 0.15, 'sine', 0.3); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.3), 100); // E5
    setTimeout(() => playTone(783.99, 0.2, 'sine', 0.3), 200); // G5
  }, [playTone]);

  const playWrong = useCallback(() => {
    // Soft descending tone
    playTone(349.23, 0.2, 'triangle', 0.2); // F4
    setTimeout(() => playTone(293.66, 0.3, 'triangle', 0.2), 150); // D4
  }, [playTone]);

  const playLevelUp = useCallback(() => {
    // Exciting fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 'sine', 0.25), i * 120);
    });
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'sine', 0.15);
  }, [playTone]);

  return { playCorrect, playWrong, playLevelUp, playClick };
};
