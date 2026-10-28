// Generative lo-fi "coding" track built with the Web Audio API — no audio files.
// Warm major-seventh chords, a soft electric-piano, a light swung beat and a pentatonic melody.

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bus: GainNode | null = null; // instruments → bus → warmth filter → master
let echo: GainNode | null = null; // send to the delay
let noise: AudioBuffer | null = null;
let timer = 0;
let stopTimer = 0;
let nextTime = 0;
let step = 0; // sixteenth-note counter

const BPM = 82;
const SIXTEENTH = 60 / BPM / 4;
const VOLUME = 0.42;

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// Fmaj9 → Em7 → Dm9 → Cmaj7, one bar each
const CHORDS = [
  { bass: 41, notes: [57, 60, 64, 67] },
  { bass: 40, notes: [55, 59, 62, 64] },
  { bass: 38, notes: [53, 57, 60, 64] },
  { bass: 36, notes: [52, 55, 59, 62] },
];
const SCALE = [72, 74, 76, 79, 81, 84]; // C major pentatonic
const MELODY = [0, -1, 2, -1, 3, 2, -1, 1, 4, -1, 3, -1, 2, 1, -1, 0]; // -1 = rest; per eighth note, two bars

function voice(type: OscillatorType, freq: number, t: number, dur: number, peak: number, attack: number, dest: AudioNode, detune = 0) {
  const c = ctx!;
  const o = c.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.05);
}

/** Electric-piano: sine carrier with a decaying FM modulator for the bell-like attack. */
function keys(freq: number, t: number, vel: number) {
  const c = ctx!;
  const car = c.createOscillator();
  const mod = c.createOscillator();
  const modGain = c.createGain();
  const g = c.createGain();
  car.frequency.value = freq;
  mod.frequency.value = freq * 2;
  modGain.gain.setValueAtTime(freq * 1.1, t);
  modGain.gain.exponentialRampToValueAtTime(freq * 0.05, t + 0.6);
  mod.connect(modGain).connect(car.frequency);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05 * vel, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
  car.connect(g);
  g.connect(bus!);
  g.connect(echo!);
  car.start(t);
  mod.start(t);
  car.stop(t + 2.5);
  mod.stop(t + 2.5);
}

function kick(t: number) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.setValueAtTime(115, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.16);
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
  o.connect(g).connect(bus!);
  o.start(t);
  o.stop(t + 0.4);
}

function hiss(t: number, dur: number, peak: number, type: BiquadFilterType, freq: number, q = 0.8) {
  const c = ctx!;
  const s = c.createBufferSource();
  s.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.setValueAtTime(peak, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(bus!);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

function schedule(t: number, n: number) {
  const inBar = n % 16;
  const bar = Math.floor(n / 16);
  const chord = CHORDS[bar % CHORDS.length];
  const swing = n % 2 ? SIXTEENTH * 0.16 : 0;
  const at = t + swing;

  if (inBar === 0) {
    // pad + bass for the whole bar
    const barLen = SIXTEENTH * 16;
    chord.notes.forEach((m, i) => {
      voice('triangle', midi(m), t, barLen + 0.6, 0.016, 0.5, bus!, -6 + i * 3);
      voice('sine', midi(m), t, barLen + 0.6, 0.014, 0.6, bus!, 5);
    });
    voice('sine', midi(chord.bass), t, barLen * 0.9, 0.11, 0.03, bus!);
  }
  // keys on 1 and the "and" of 2
  if (inBar === 0 || inBar === 6) chord.notes.forEach((m, i) => keys(midi(m + 12), at + i * 0.012, inBar === 0 ? 1 : 0.7));

  // beat: kick on 1 and 3 (+ a ghost), snare on 2 and 4, soft swung hats
  if (inBar === 0 || inBar === 8 || (inBar === 10 && bar % 2)) kick(at);
  if (inBar === 4 || inBar === 12) hiss(at, 0.2, 0.09, 'bandpass', 1700, 0.9);
  if (n % 2 === 0) hiss(at, 0.05, inBar % 4 === 2 ? 0.035 : 0.02, 'highpass', 7500);

  // melody on eighth notes, through the echo
  if (n % 2 === 0) {
    const idx = MELODY[(n / 2) % MELODY.length];
    if (idx >= 0 && (bar % 4 !== 3 || inBar < 8)) {
      const f = midi(SCALE[idx]);
      voice('sine', f, at, 0.7, 0.045, 0.01, echo!);
      voice('sine', f, at, 0.7, 0.03, 0.01, bus!);
      voice('triangle', f * 2, at, 0.25, 0.008, 0.005, bus!);
    }
  }
}

function tick() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + 0.15) {
    schedule(nextTime, step);
    nextTime += SIXTEENTH;
    step += 1;
  }
}

function build() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;

  const warmth = ctx.createBiquadFilter();
  warmth.type = 'lowpass';
  warmth.frequency.value = 5200;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  bus = ctx.createGain();
  bus.connect(warmth).connect(comp).connect(master);
  master.connect(ctx.destination);

  // dotted-eighth echo, darkened
  echo = ctx.createGain();
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = SIXTEENTH * 3;
  const fb = ctx.createGain();
  fb.gain.value = 0.32;
  const dark = ctx.createBiquadFilter();
  dark.type = 'lowpass';
  dark.frequency.value = 2400;
  echo.connect(delay);
  delay.connect(dark).connect(fb).connect(delay);
  dark.connect(bus);

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return true;
}

export function startAmbient() {
  if (!ctx && !build()) return;
  const c = ctx!;
  window.clearTimeout(stopTimer);
  void c.resume();
  nextTime = c.currentTime + 0.1;
  step = 0;
  window.clearInterval(timer);
  timer = window.setInterval(tick, 25);
  master!.gain.cancelScheduledValues(c.currentTime);
  master!.gain.setValueAtTime(master!.gain.value, c.currentTime);
  master!.gain.linearRampToValueAtTime(VOLUME, c.currentTime + 2.5);
}

export function stopAmbient() {
  if (!ctx || !master) return;
  const c = ctx;
  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.setValueAtTime(master.gain.value, c.currentTime);
  master.gain.linearRampToValueAtTime(0, c.currentTime + 0.9);
  stopTimer = window.setTimeout(() => {
    window.clearInterval(timer);
    void c.suspend();
  }, 1000);
}
