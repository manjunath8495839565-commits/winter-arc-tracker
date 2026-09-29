/**
 * WINTER ARC — AUDIO SYNTHESIZER & HAPTICS ENGINE (Web Audio API)
 * 100% offline, brutal cinematic tactical ops soundscapes.
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

function triggerHaptic(durationMs) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(durationMs);
    } catch (e) {}
  }
}

/**
 * Heavy thunk + 20ms haptic (racking a plate on Lock In)
 */
export function playLockInSound() {
  triggerHaptic(20);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sub-bass heavy thunk
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.5);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.5);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // Iron rack hit
    const hit = ctx.createOscillator();
    const hitGain = ctx.createGain();
    hit.type = 'sine';
    hit.frequency.setValueAtTime(480, now);
    hit.frequency.exponentialRampToValueAtTime(140, now + 0.3);
    hitGain.gain.setValueAtTime(0.4, now);
    hitGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    hit.connect(hitGain);
    hitGain.connect(ctx.destination);
    hit.start(now);
    hit.stop(now + 0.35);
  } catch (e) {}
}

/**
 * Set complete: short metallic tick + 10ms haptic
 */
export function playSetCompleteSound() {
  triggerHaptic(10);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {}
}

/**
 * Rest end: double tick + 30ms haptic
 */
export function playRestEndSound() {
  triggerHaptic(30);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Tick 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.07);

    // Tick 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1100, now + 0.12);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.45, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.22);
  } catch (e) {}
}

/**
 * Rest timer tick (last 3s)
 */
export function playTimerTickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(850, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (e) {}
}

/**
 * Workout logged / Screen 0 Wake-up: Deep Bell / Forge-Strike sound + 40ms haptic
 */
export function playWorkoutLoggedSound() {
  triggerHaptic(40);
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Resonant forge strike
    const bell1 = ctx.createOscillator();
    const bell2 = ctx.createOscillator();
    const gain = ctx.createGain();

    bell1.type = 'sine';
    bell2.type = 'triangle';
    bell1.frequency.setValueAtTime(260, now);
    bell2.frequency.setValueAtTime(520, now);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    bell1.connect(gain);
    bell2.connect(gain);
    gain.connect(ctx.destination);

    bell1.start(now);
    bell2.start(now);
    bell1.stop(now + 1.8);
    bell2.stop(now + 1.8);
  } catch (e) {}
}

/**
 * Fire crackle / combustion ignition
 */
export function playFireCrackleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.7;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.linearRampToValueAtTime(800, now + 0.35);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.7);
  } catch (e) {}
}

/**
 * Storm thunder / rumble on missed day / streak reset (no haptic per spec)
 */
export function playStormRumbleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 2.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);
    filter.frequency.linearRampToValueAtTime(55, now + 1.8);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 2.0);
  } catch (e) {}
}
