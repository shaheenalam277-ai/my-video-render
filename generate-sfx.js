const fs = require('fs');
const path = require('path');

const sampleRate = 48000;
let seed = 671904;
const random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function lowPass(input, cutoff) {
  const out = new Float32Array(input.length);
  const rc = 1 / (2 * Math.PI * cutoff);
  const dt = 1 / sampleRate;
  const alpha = dt / (rc + dt);
  let y = 0;
  for (let i = 0; i < input.length; i++) {
    y += alpha * (input[i] - y);
    out[i] = y;
  }
  return out;
}

function highPass(input, cutoff) {
  const out = new Float32Array(input.length);
  const rc = 1 / (2 * Math.PI * cutoff);
  const dt = 1 / sampleRate;
  const alpha = rc / (rc + dt);
  let y = 0;
  let previous = 0;
  for (let i = 0; i < input.length; i++) {
    y = alpha * (y + input[i] - previous);
    previous = input[i];
    out[i] = y;
  }
  return out;
}

function create(kind, seconds) {
  const count = Math.round(seconds * sampleRate);
  let raw = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const t = i / sampleRate;
    const p = t / seconds;
    if (kind === 'soft-pop') {
      const f = 188 - 90 * (1 - Math.exp(-t * 18));
      const env = (1 - Math.exp(-t * 110)) * Math.exp(-t * 17);
      raw[i] = Math.sin(2 * Math.PI * f * t) * env * 0.38 + random() * env * 0.055;
    } else if (kind === 'click') {
      const env = Math.exp(-t * 74);
      raw[i] = random() * env * 0.42;
    } else if (kind === 'whoosh' || kind === 'swipe') {
      const env = kind === 'whoosh' ? Math.sin(Math.PI * p) ** 1.45 : Math.sin(Math.PI * p) ** 1.9;
      raw[i] = random() * env * (kind === 'whoosh' ? 0.38 : 0.31);
    } else if (kind === 'pluck') {
      const env = Math.exp(-t * 13.5) * Math.min(1, t * 38);
      raw[i] = (Math.sin(2 * Math.PI * 523.25 * t) * 0.44 + Math.sin(2 * Math.PI * 784.88 * t) * 0.19 + Math.sin(2 * Math.PI * 1046.5 * t) * 0.08) * env;
    } else if (kind === 'soft-thud') {
      const env = (1 - Math.exp(-t * 65)) * Math.exp(-t * 21);
      const f = 86 - 35 * p;
      raw[i] = Math.sin(2 * Math.PI * f * t) * env * 0.44 + random() * env * 0.075;
    }
  }

  if (kind === 'click') raw = lowPass(highPass(raw, 1500), 7200);
  if (kind === 'whoosh') raw = lowPass(highPass(raw, 560), 6200);
  if (kind === 'swipe') raw = lowPass(highPass(raw, 850), 4800);
  if (kind === 'soft-pop' || kind === 'soft-thud') raw = lowPass(raw, kind === 'soft-pop' ? 1900 : 520);
  if (kind === 'pluck') raw = lowPass(raw, 2800);

  // Tiny deterministic early reflection, deliberately short and quiet.
  const delay = Math.round(0.026 * sampleRate);
  const mixed = new Float32Array(count);
  let peak = 0;
  for (let i = 0; i < count; i++) {
    const reflection = i >= delay ? raw[i - delay] * 0.095 : 0;
    const fade = Math.min(1, i / Math.round(0.006 * sampleRate), (count - i) / Math.round(0.022 * sampleRate));
    mixed[i] = (raw[i] + reflection) * fade * 0.72;
    peak = Math.max(peak, Math.abs(mixed[i]));
  }
  const normalized = new Float32Array(count);
  const safeGain = peak > 0.62 ? 0.62 / peak : 1;
  for (let i = 0; i < count; i++) normalized[i] = clamp(mixed[i] * safeGain, -0.95, 0.95);
  return normalized;
}

function writeWav(fileName, seconds) {
  const data = create(fileName.replace('.wav', ''), seconds);
  const buffer = Buffer.alloc(44 + data.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + data.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(data.length * 2, 40);
  let peak = 0;
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    peak = Math.max(peak, Math.abs(data[i]));
    sumSquares += data[i] * data[i];
    buffer.writeInt16LE(Math.round(data[i] * 32767), 44 + i * 2);
  }
  const out = path.join(__dirname, 'public', 'sfx', fileName);
  fs.writeFileSync(out, buffer);
  console.log(`${fileName}: ${seconds.toFixed(3)}s, peak=${peak.toFixed(3)}, RMS=${Math.sqrt(sumSquares / data.length).toFixed(3)}`);
}

const outDir = path.join(__dirname, 'public', 'sfx');
fs.mkdirSync(outDir, { recursive: true });
[
  ['whoosh.wav', 0.42],
  ['soft-pop.wav', 0.18],
  ['click.wav', 0.12],
  ['pluck.wav', 0.34],
  ['soft-thud.wav', 0.22],
  ['swipe.wav', 0.36],
].forEach(([name, duration]) => writeWav(name, duration));
