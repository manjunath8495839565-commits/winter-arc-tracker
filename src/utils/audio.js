/**
 * WINTER ARC — AUDIO SYNTHESIZER ENGINE (Web Audio API)
 * 100% offline, brutal cinematic soundscapes, zero external network dependencies.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Intense 6:00 AM Lock In sound (Deep War Sub-Bass Drop + Anvil Strike)
 */
export function playLockInSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub-bass heavy drop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.9);

    // Lowpass filter for deep impact
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(70, now + 0.8);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);

    // Metal impact / anvil ring
    const anvil = ctx.createOscillator();
    const anvilGain = ctx.createGain();
    anvil.type = 'sine';
    anvil.frequency.setValueAtTime(680, now);
    anvil.frequency.exponentialRampToValueAtTime(240, now + 0.6);

    anvilGain.gain.setValueAtTime(0.35, now);
    anvilGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    anvil.connect(anvilGain);
    anvilGain.connect(ctx.destination);

    anvil.start(now);
    anvil.stop(now + 0.7);
  } catch (e) {
    console.warn("Audio play error", e);
  }
}

/**
 * Fire crackle / ignition whoosh on streak increment
 */
export function playFireCrackleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.8;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink / Brown noise simulation for fire combustion
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to emulate raging flame
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.4);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.8);

    // Secondary bright ember sparks
    const sparkOsc = ctx.createOscillator();
    const sparkGain = ctx.createGain();
    sparkOsc.type = 'triangle';
    sparkOsc.frequency.setValueAtTime(880, now + 0.1);
    sparkOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);

    sparkGain.gain.setValueAtTime(0, now);
    sparkGain.gain.setValueAtTime(0.2, now + 0.1);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    sparkOsc.connect(sparkGain);
    sparkGain.connect(ctx.destination);

    sparkOsc.start(now + 0.1);
    sparkOsc.stop(now + 0.45);
  } catch (e) {
    console.warn("Audio play error", e);
  }
}

/**
 * Distant storm thunder / rumble on streak reset
 */
export function playStormRumbleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 2.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.linearRampToValueAtTime(65, now + 1.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 2.2);
  } catch (e) {
    console.warn("Audio play error", e);
  }
}

/**
 * Rest timer chime / gong when countdown reaches 0
 */
export function playTimerAlertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880, now);    // A5

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.2);
    osc2.stop(now + 1.2);

    // Vibration if available
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 150]);
    }
  } catch (e) {
    console.warn("Audio play error", e);
  }
}

/**
 * Subtle rest timer tick for last 3 seconds
 */
export function playTimerTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    // Ignore tick errors
  }
}
