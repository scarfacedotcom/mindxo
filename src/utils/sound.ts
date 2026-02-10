class SoundManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  playMove() {
    this.playTone(440, 0.1, 'square');
  }

  playWin() {
    if (!this.context) return;
    this.playTone(523.25, 0.15, 'sine');
    setTimeout(() => this.playTone(659.25, 0.15, 'sine'), 150);
    setTimeout(() => this.playTone(783.99, 0.3, 'sine'), 300);
  }

  playLose() {
    if (!this.context) return;
    this.playTone(293.66, 0.2, 'sawtooth');
    setTimeout(() => this.playTone(246.94, 0.3, 'sawtooth'), 200);
  }

  playDraw() {
    this.playTone(329.63, 0.2, 'triangle');
  }

  playClick() {
    this.playTone(800, 0.05, 'square');
  }

  playMatchFound() {
    if (!this.context) return;
    this.playTone(659.25, 0.1, 'sine');
    setTimeout(() => this.playTone(783.99, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(1046.5, 0.2, 'sine'), 200);
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();

export function vibrate(pattern: number | number[]) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export function vibrateMove() {
  vibrate(10);
}

export function vibrateWin() {
  vibrate([50, 50, 50, 50, 100]);
}

export function vibrateLose() {
  vibrate([100, 50, 100]);
}

export function vibrateClick() {
  vibrate(5);
}
