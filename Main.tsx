import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  EaseScene,
  HardshipScene,
  HookScene,
  HopeScene,
  IsometricDelayScene,
  PrayerScene,
  TearsScene,
} from './Scenes';
import { theme } from './theme';

const START_BEFORE_CUE_MS = 167;
const CUE_STARTS_MS = [0, 6880, 9740, 16200, 23040, 29680, 35320] as const;
const VIDEO_END_MS = 40440;
const SCENE_COMPONENTS = [HookScene, TearsScene, IsometricDelayScene, HardshipScene, EaseScene, PrayerScene, HopeScene] as const;
const SFX_EVENTS = [
  { ms: 0, file: 'sfx/whoosh.wav', volume: 0.25 },
  { ms: 6880, file: 'sfx/soft-pop.wav', volume: 0.24 },
  { ms: 9740, file: 'sfx/whoosh.wav', volume: 0.27 },
  { ms: 16200, file: 'sfx/soft-thud.wav', volume: 0.22 },
  { ms: 23040, file: 'sfx/pluck.wav', volume: 0.24 },
  { ms: 29680, file: 'sfx/click.wav', volume: 0.21 },
  { ms: 35320, file: 'sfx/pluck.wav', volume: 0.25 },
] as const;

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

// Keep this disabled by default. Add public/voiceover.mp3 and flip the flag to audition the supplied SRT against speech.
const ENABLE_VOICEOVER = false;
export const PreviewAudio: React.FC = () => {
  if (!ENABLE_VOICEOVER) return null;
  return <Audio src={staticFile('voiceover.mp3')} volume={1} />;
};

const FontFaces: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Hind Siliguri'; font-style: normal; font-weight: 400; src: url('${staticFile('fonts/hind-siliguri-bengali-400-normal.woff2')}') format('woff2'); unicode-range: U+0980-09FF; }
    @font-face { font-family: 'Hind Siliguri'; font-style: normal; font-weight: 600; src: url('${staticFile('fonts/hind-siliguri-bengali-600-normal.woff2')}') format('woff2'); unicode-range: U+0980-09FF; }
    @font-face { font-family: 'Hind Siliguri'; font-style: normal; font-weight: 700; src: url('${staticFile('fonts/hind-siliguri-bengali-700-normal.woff2')}') format('woff2'); unicode-range: U+0980-09FF; }
    @font-face { font-family: 'Hind Siliguri'; font-style: normal; font-weight: 400; src: url('${staticFile('fonts/hind-siliguri-latin-400-normal.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }
    @font-face { font-family: 'Hind Siliguri'; font-style: normal; font-weight: 600; src: url('${staticFile('fonts/hind-siliguri-latin-600-normal.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }
    @font-face { font-family: 'Hind Siliguri'; font-style: normal; font-weight: 700; src: url('${staticFile('fonts/hind-siliguri-latin-700-normal.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }
  `}</style>
);

const BackgroundMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 66) * 34;
  const drift2 = Math.cos(frame / 82) * 28;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: theme.colors.bg }}>
      <div style={{ position: 'absolute', width: 980, height: 980, top: -360, left: -330 + drift, borderRadius: '50%', filter: 'blur(105px)', background: `radial-gradient(circle, ${theme.colors.primaryWash}, transparent 68%)` }} />
      <div style={{ position: 'absolute', width: 880, height: 880, bottom: -400, right: -310 - drift2, borderRadius: '50%', filter: 'blur(105px)', background: `radial-gradient(circle, ${theme.colors.accentGlow}, transparent 68%)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.32, backgroundImage: `linear-gradient(${theme.colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.grid} 1px, transparent 1px)`, backgroundSize: '88px 88px', maskImage: 'linear-gradient(180deg, transparent, black 20%, black 82%, transparent)' }} />
    </AbsoluteFill>
  );
};

const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: 'soft-light', opacity: 0.055 }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.colors.shadow}, transparent 24%, transparent 76%, ${theme.colors.shadow})` }} />
  </AbsoluteFill>
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents: 'none', backgroundImage: noise, backgroundSize: '220px', backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.045, mixBlendMode: 'screen' }} />;
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse at center, transparent 54%, ${theme.colors.vignette} 100%)` }} />
);

export const MainVideo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const cueFrames = CUE_STARTS_MS.map((ms) => msToFrame(ms, fps));
  const starts = cueFrames.map((frame, i) => i === 0 ? 0 : Math.max(0, frame - msToFrame(START_BEFORE_CUE_MS, fps)));
  const finalFrame = Math.min(durationInFrames, msToFrame(VIDEO_END_MS, fps));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, color: theme.colors.text, fontFamily: theme.fonts.display, overflow: 'hidden' }}>
      <FontFaces />
      {/* Layer 1 — background mesh */}
      <BackgroundMesh />
      {/* Layers 2–3 — abstract visual assets, isometric chart and Bengali type */}
      {SCENE_COMPONENTS.map((Scene, i) => {
        const from = starts[i];
        const to = i === SCENE_COMPONENTS.length - 1 ? finalFrame : starts[i + 1];
        return <Sequence key={`scene-${i}`} from={from} durationInFrames={Math.max(1, to - from)}><Scene /></Sequence>;
      })}
      {/* SFX only. Each short sound begins three frames before its SRT-timed visual cue. */}
      {SFX_EVENTS.map((event, i) => {
        const start = Math.max(0, msToFrame(event.ms, fps) - Math.round(fps * 0.1));
        return <Sequence key={`sfx-${i}`} from={start} layout="none"><Audio src={staticFile(event.file)} volume={event.volume} /></Sequence>;
      })}
      <PreviewAudio />
      {/* Layer 4 — grade; layer 5 — grain and vignette */}
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
