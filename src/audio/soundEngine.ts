// Web Audio API Chiptune Sound & Music Synthesizer for Super Mario
// Zero external sound assets needed - works 100% reliably in any modern browser!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private musicVolume: number = 0.35;
  private sfxVolume: number = 0.5;
  private currentBgm: string | null = null;
  private bgmTimeoutId: number | null = null;
  private bgmPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized upon first user interaction to comply with autoplay policy
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  public setVolume(volume: number) {
    this.sfxVolume = volume;
    this.musicVolume = volume * 0.7;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  public playJumpSmall() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.14);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playJumpSuper() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playCoin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // B5 then E6 classic coin note
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.setValueAtTime(0.25, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  public playStomp() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  public playKick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playBump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.09);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playBrickBreak() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Burst noise + tone
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playPowerupSpawn() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [330, 392, 659, 523, 587, 784];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.06;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.linearRampToValueAtTime(0.01, time + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.07);
    });
  }

  public playPowerup() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [330, 392, 659, 523, 587, 784, 880, 1046];
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.05;

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.linearRampToValueAtTime(0.01, time + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.06);
    });
  }

  public playPipe() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const freqs = [350, 330, 310, 290, 270, 250, 230, 210, 190];
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.04;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.linearRampToValueAtTime(0.01, time + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.04);
    });
  }

  public playFireball() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playDie() {
    this.stopMusic();
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [
      { f: 500, d: 0.15 },
      { f: 450, d: 0.15 },
      { f: 400, d: 0.15 },
      { f: 300, d: 0.25 },
      { f: 200, d: 0.4 }
    ];

    let t = this.ctx.currentTime;
    notes.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.linearRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + note.d);
      t += note.d * 0.9;
    });
  }

  public playStageClear() {
    this.stopMusic();
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const melody = [
      { f: 392, d: 0.12 }, // G4
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.12 }, // C6
      { f: 1318.51, d: 0.16 }, // E6
      { f: 1567.98, d: 0.35 }, // G6
      { f: 1318.51, d: 0.35 }, // E6
      { f: 830.61, d: 0.12 }, // G#5
      { f: 1046.50, d: 0.12 }, // C6
      { f: 1244.51, d: 0.12 }, // D#6
      { f: 1661.22, d: 0.35 }, // G#6
      { f: 1244.51, d: 0.35 }, // D#6
      { f: 932.33, d: 0.12 }, // A#5
      { f: 1174.66, d: 0.12 }, // D6
      { f: 1396.91, d: 0.12 }, // F6
      { f: 1864.66, d: 0.35 }, // A#6
      { f: 1864.66, d: 0.1 }, 
      { f: 1864.66, d: 0.1 }, 
      { f: 2093.00, d: 0.6 } // C7
    ];

    let t = this.ctx.currentTime;
    melody.forEach((note) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.linearRampToValueAtTime(0.01, t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + note.d);
      t += note.d;
    });
  }

  public playFlagpole() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(150, now + 1.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 1.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // --- BACKGROUND MUSIC ENGINE ---

  public playMusic(theme: 'overworld' | 'underground' | 'star') {
    if (this.currentBgm === theme && this.bgmPlaying) return;
    this.stopMusic();
    this.currentBgm = theme;
    this.bgmPlaying = true;
    this.initContext();

    if (theme === 'overworld') {
      this.loopOverworld();
    } else if (theme === 'underground') {
      this.loopUnderground();
    } else if (theme === 'star') {
      this.loopStar();
    }
  }

  public stopMusic() {
    this.bgmPlaying = false;
    this.currentBgm = null;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  private loopOverworld() {
    if (!this.bgmPlaying || !this.ctx || !this.musicGain || this.isMuted) {
      if (this.bgmPlaying) {
        this.bgmTimeoutId = window.setTimeout(() => this.loopOverworld(), 1000);
      }
      return;
    }

    const bpm = 195;
    const beat = 60 / bpm; // duration of quarter note (~0.307s)
    const sixteenth = beat / 4; // ~0.0769s

    // Main Mario Theme Motif sequence
    // [frequency in Hz, duration in 16th notes, rest in 16th notes]
    const intro: [number, number, number][] = [
      [659.25, 1.5, 0.5], // E5
      [659.25, 1.5, 1.5], // E5
      [659.25, 1.5, 1.5], // E5
      [523.25, 1.5, 0.5], // C5
      [659.25, 1.5, 1.5], // E5
      [783.99, 2.5, 3.5], // G5
      [392.00, 2.5, 3.5], // G4
    ];

    const body: [number, number, number][] = [
      // Section A
      [523.25, 2, 2], [392.00, 2, 2], [329.63, 2, 2],
      [440.00, 2, 1], [493.88, 2, 1], [466.16, 2, 0.5], [440.00, 2, 1],
      [392.00, 1.5, 1], [659.25, 1.5, 1], [783.99, 1.5, 1], [880.00, 2, 1],
      [698.46, 1.5, 0.5], [783.99, 1.5, 1],
      [659.25, 2, 1], [523.25, 1.5, 0.5], [587.33, 1.5, 0.5], [493.88, 2, 2],

      // Repeat variation
      [523.25, 2, 2], [392.00, 2, 2], [329.63, 2, 2],
      [440.00, 2, 1], [493.88, 2, 1], [466.16, 2, 0.5], [440.00, 2, 1],
      [392.00, 1.5, 1], [659.25, 1.5, 1], [783.99, 1.5, 1], [880.00, 2, 1],
      [698.46, 1.5, 0.5], [783.99, 1.5, 1],
      [659.25, 2, 1], [523.25, 1.5, 0.5], [587.33, 1.5, 0.5], [493.88, 2, 3]
    ];

    let t = this.ctx.currentTime + 0.05;
    const scheduleNotes = (notes: [number, number, number][]) => {
      notes.forEach(([f, durUnits, restUnits]) => {
        if (!this.ctx || !this.musicGain) return;
        const dur = durUnits * sixteenth;
        const rest = restUnits * sixteenth;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.linearRampToValueAtTime(0.01, t + dur * 0.9);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(t);
        osc.stop(t + dur);

        t += dur + rest;
      });
    };

    scheduleNotes(intro);
    scheduleNotes(body);

    const totalDuration = (t - this.ctx.currentTime) * 1000;
    this.bgmTimeoutId = window.setTimeout(() => {
      if (this.bgmPlaying && this.currentBgm === 'overworld') {
        this.loopOverworld();
      }
    }, Math.max(100, totalDuration - 20));
  }

  private loopUnderground() {
    if (!this.bgmPlaying || !this.ctx || !this.musicGain || this.isMuted) {
      if (this.bgmPlaying) {
        this.bgmTimeoutId = window.setTimeout(() => this.loopUnderground(), 1000);
      }
      return;
    }

    const sixteenth = 0.12;
    // Classic underground staccato bassline
    const notes: [number, number, number][] = [
      [130.81, 1, 1], [261.63, 1, 1], [116.54, 1, 1], [233.08, 1, 1],
      [110.00, 1, 1], [220.00, 1, 1], [103.83, 1, 1], [207.65, 1, 3],
      [130.81, 1, 1], [261.63, 1, 1], [116.54, 1, 1], [233.08, 1, 1],
      [110.00, 1, 1], [220.00, 1, 1], [103.83, 1, 1], [207.65, 1, 3],
    ];

    let t = this.ctx.currentTime + 0.05;
    notes.forEach(([f, durUnits, restUnits]) => {
      if (!this.ctx || !this.musicGain) return;
      const dur = durUnits * sixteenth;
      const rest = restUnits * sixteenth;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.linearRampToValueAtTime(0.01, t + dur * 0.85);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + dur);

      t += dur + rest;
    });

    const totalDuration = (t - this.ctx.currentTime) * 1000;
    this.bgmTimeoutId = window.setTimeout(() => {
      if (this.bgmPlaying && this.currentBgm === 'underground') {
        this.loopUnderground();
      }
    }, Math.max(100, totalDuration - 20));
  }

  private loopStar() {
    if (!this.bgmPlaying || !this.ctx || !this.musicGain || this.isMuted) {
      if (this.bgmPlaying) {
        this.bgmTimeoutId = window.setTimeout(() => this.loopStar(), 1000);
      }
      return;
    }

    const noteDur = 0.09;
    const starNotes = [
      523.25, 523.25, 523.25, 659.25, 523.25, 659.25, 523.25, 783.99,
      523.25, 523.25, 523.25, 659.25, 523.25, 659.25, 493.88, 440.00
    ];

    let t = this.ctx.currentTime + 0.05;
    starNotes.forEach((f) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.linearRampToValueAtTime(0.01, t + noteDur * 0.8);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + noteDur);

      t += noteDur;
    });

    const totalDuration = (t - this.ctx.currentTime) * 1000;
    this.bgmTimeoutId = window.setTimeout(() => {
      if (this.bgmPlaying && this.currentBgm === 'star') {
        this.loopStar();
      }
    }, Math.max(50, totalDuration - 10));
  }
}

// Singleton export
export const soundEngine = new SoundEngine();
