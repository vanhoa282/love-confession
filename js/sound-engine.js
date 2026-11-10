/**
 * ==============================================================================
 * SOUND ENGINE (ÂM THANH & BẢN NHẠC PIANO LOFI HOÀN HẢO)
 * Tự động tạo nhạc nền lofi du dương bằng Web Audio API không cần tải file ngoài!
 * Hỗ trợ Sound Effects (SFX) chân thực và phát file MP3 tùy chọn nếu có.
 * ==============================================================================
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.55;
        this.customAudio = null;
        this.melodyTimer = null;
        this.arpeggioIndex = 0;
        this.chordIndex = 0;
        this.isInitialized = false;

        // Romantic Chord Progression (Hz): Cmaj9 -> Am9 -> Fmaj7 -> Gsus4/Gadd9
        this.chords = [
            // Cmaj9
            [130.81, 196.00, 246.94, 293.66, 329.63, 392.00],
            // Am9
            [110.00, 164.81, 220.00, 246.94, 261.63, 329.63],
            // Fmaj7
            [87.31, 174.61, 220.00, 261.63, 329.63, 392.00],
            // Gsus4 -> G
            [98.00, 146.83, 196.00, 293.66, 329.63, 392.00]
        ];

        // Gentle high bells notes (Pentatonic C major)
        this.bellNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66];
    }

    init() {
        if (this.isInitialized) return;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Sub low-pass filter for cozy warm lofi feel
        this.lofiFilter = this.ctx.createBiquadFilter();
        this.lofiFilter.type = "lowpass";
        this.lofiFilter.frequency.setValueAtTime(1400, this.ctx.currentTime);
        this.lofiFilter.connect(this.masterGain);

        this.isInitialized = true;
    }

    startMusic() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        // Nếu người dùng có cấu hình MP3 riêng
        if (LoveConfig.music.customUrl && LoveConfig.music.customUrl.trim() !== '') {
            if (this.customAudio) {
                this.customAudio.play();
                this.isPlaying = true;
                this.updateVinylUI(true);
            } else {
                this.playCustomAudio(LoveConfig.music.customUrl);
            }
            return;
        }

        if (this.isPlaying) return;
        this.isPlaying = true;
        this.scheduleMelodyLoop();
    }

    playCustomAudio(url) {
        if (this.customAudio) {
            this.customAudio.pause();
            this.customAudio = null;
        }
        this.customAudio = new Audio(url);
        this.customAudio.loop = true;
        this.customAudio.volume = this.volume;
        this.customAudio.play().then(() => {
            this.isPlaying = true;
            this.updateVinylUI(true);
        }).catch(err => {
            console.warn("Lỗi phát audio tùy chỉnh, chuyển về synth:", err);
            this.scheduleMelodyLoop();
            this.isPlaying = true;
        });
    }

    scheduleMelodyLoop() {
        if (!this.isPlaying || (this.customAudio && !this.customAudio.paused)) return;

        const currentChord = this.chords[this.chordIndex];
        const now = this.ctx.currentTime;

        // 1. Play soft sustained warm pad for base chord
        currentChord.slice(0, 3).forEach((freq, idx) => {
            this.playWarmPad(freq, now, 3.8, idx * 0.05);
        });

        // 2. Play gentle rolling acoustic piano arpeggio
        currentChord.forEach((freq, idx) => {
            const noteTime = now + (idx * 0.45) + (Math.random() * 0.04);
            this.playPianoNote(freq, noteTime, 2.2, 0.28);
        });

        // 3. Occasional music box / chime note in high register
        if (Math.random() > 0.3) {
            const bell = this.bellNotes[Math.floor(Math.random() * this.bellNotes.length)];
            this.playMusicBoxNote(bell, now + 1.2 + Math.random() * 1.5, 2.5);
        }

        // Chuyển sang hợp âm tiếp theo
        this.chordIndex = (this.chordIndex + 1) % this.chords.length;

        // Lặp lại chu kỳ hợp âm sau 3.6 giây
        this.melodyTimer = setTimeout(() => {
            this.scheduleMelodyLoop();
        }, 3600);

        this.updateVinylUI(true);
    }

    playPianoNote(freq, startTime, duration = 1.8, velocity = 0.3) {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm triangle + sine blend for piano harmonic
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc2.frequency.setValueAtTime(freq * 2, startTime); // 1st harmonic

        // Envelope: Fast attack, gentle decay
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(velocity * 0.5, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(this.lofiFilter);

        osc.start(startTime);
        osc2.start(startTime);
        osc.stop(startTime + duration);
        osc2.stop(startTime + duration);
    }

    playWarmPad(freq, startTime, duration = 3.8, delay = 0) {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime + delay);

        padGain.gain.setValueAtTime(0, startTime + delay);
        padGain.gain.linearRampToValueAtTime(0.08, startTime + delay + 0.8);
        padGain.gain.exponentialRampToValueAtTime(0.0001, startTime + delay + duration);

        osc.connect(padGain);
        padGain.connect(this.lofiFilter);

        osc.start(startTime + delay);
        osc.stop(startTime + delay + duration);
    }

    playMusicBoxNote(freq, startTime, duration = 2.0) {
        if (!this.ctx || this.isMuted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    toggleMusic() {
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.startMusic();
        }
    }

    pauseMusic() {
        this.isPlaying = false;
        if (this.melodyTimer) {
            clearTimeout(this.melodyTimer);
            this.melodyTimer = null;
        }
        if (this.customAudio) {
            this.customAudio.pause();
        }
        this.updateVinylUI(false);
    }

    updateVinylUI(playing) {
        const disc = document.getElementById('vinylDisc');
        const visualizer = document.getElementById('musicVisualizer');
        if (disc) {
            if (playing) {
                disc.classList.add('spinning');
            } else {
                disc.classList.remove('spinning');
            }
        }
        if (visualizer) {
            visualizer.classList.toggle('active', playing);
        }
    }

    // ================= SFX EFFECTS =================
    playEnvelopeOpen() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.35);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    playChime() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [880, 1174.66, 1318.51].forEach((freq, idx) => {
            this.playMusicBoxNote(freq, now + idx * 0.07, 1.2);
        });
    }

    playDodgeBoing() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.22);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    playHeartPop() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playCelebrationFanfare() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Glorious arpeggio chords in celebration
        const celebrationNotes = [
            523.25, 659.25, 783.99, 1046.50, // C5 chord
            659.25, 783.99, 987.77, 1318.51, // E minor chord
            880.00, 1046.50, 1318.51, 1567.98, // A minor chord
            1046.50, 1318.51, 1567.98, 2093.00 // C6 climax
        ];

        celebrationNotes.forEach((f, i) => {
            const time = now + (i * 0.12);
            this.playPianoNote(f, time, 1.6, 0.35);
            this.playMusicBoxNote(f * 1.5, time + 0.04, 1.8);
        });
    }
}

// Global sound engine instance
window.soundEngine = new SoundEngine();
