import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IsometricJourneyChart } from './components/IsometricJourneyChart';
import { theme } from './theme';

const clamped = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

type SceneFrameProps = { children: React.ReactNode };

export const SceneFrame: React.FC<SceneFrameProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exitFrames = Math.max(10, Math.round(fps * 0.34));
  const settleFrames = Math.max(2, Math.round(fps * 0.07));
  const exitOpacity = interpolate(frame, [durationInFrames - exitFrames, durationInFrames - settleFrames], [1, 0], {
    easing: theme.ease.in,
    ...clamped,
  });
  const exitY = interpolate(frame, [durationInFrames - exitFrames, durationInFrames - settleFrames], [0, -34], {
    easing: theme.ease.in,
    ...clamped,
  });
  const float = Math.sin(frame / 29) * 1.4;
  const breathe = 1 + Math.sin(frame / 24) * 0.003;
  return <AbsoluteFill style={{ opacity: exitOpacity, transform: `translateY(${exitY + float}px) scale(${breathe})` }}>{children}</AbsoluteFill>;
};

export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  perWord?: number;
  fontSize?: number;
  lineHeight?: number;
  color?: string;
  weight?: number;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
}> = ({ text, delay = 0, perWord = 4, fontSize = 66, lineHeight = 1.2, color = theme.colors.text, weight = 700, align = 'left', maxWidth = 900 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.trim().split(/\s+/);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start', gap: '0px 15px', maxWidth, fontFamily: theme.fonts.display, fontSize, lineHeight, fontWeight: weight, color, textAlign: align, letterSpacing: 0 }}>
      {words.map((word, i) => {
        const p = spring({ frame: frame - delay - i * perWord, fps, config: theme.spring.snappy });
        const y = interpolate(p, [0, 1], [31, 0], { easing: theme.ease.out, ...clamped });
        const scale = interpolate(p, [0, 1], [0.94, 1], { easing: theme.ease.out, ...clamped });
        return <span key={`${word}-${i}`} style={{ display: 'inline-block', opacity: p, transform: `translateY(${y}px) scale(${scale})`, whiteSpace: 'pre' }}>{word}</span>;
      })}
    </div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; align?: 'left' | 'center' }> = ({ children, align = 'left' }) => (
  <div style={{ color: theme.colors.textDim, fontFamily: theme.fonts.body, fontSize: 23, fontWeight: 600, lineHeight: 1.35, letterSpacing: 0, textAlign: align }}>{children}</div>
);

const SmallRule: React.FC<{ width?: number }> = ({ width = 86 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - Math.round(fps * 0.18), fps, config: theme.spring.smooth });
  const w = interpolate(p, [0, 1], [0, width], { easing: theme.ease.out, ...clamped });
  return <div style={{ width: w, height: 3, borderRadius: 3, backgroundColor: theme.colors.hairline }} />;
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arc = spring({ frame: frame - Math.round(fps * 0.05), fps, config: theme.spring.smooth });
  const rise = interpolate(arc, [0, 1], [580, 0], { easing: theme.ease.out, ...clamped });
  const breath = 1 + Math.sin(frame / 18) * 0.03;
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '350px 96px 320px', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 640, height: 640, borderRadius: '50%', top: 405 + rise, right: -160, background: `radial-gradient(circle, ${theme.colors.primaryWash}, transparent 70%)`, transform: `scale(${breath})` }} />
        <svg viewBox="0 0 880 560" style={{ position: 'absolute', right: 50, top: 350, width: 780, height: 500, overflow: 'visible' }}>
          <path d="M245 405 C350 390 385 310 500 286 C620 260 624 188 710 151 C755 132 800 114 844 100" fill="none" stroke={theme.colors.hairline} strokeWidth="4" strokeDasharray="9 18" />
          <path d="M245 405 C350 390 385 310 500 286 C620 260 624 188 710 151 C755 132 800 114 844 100" fill="none" stroke={theme.colors.primary} strokeWidth="4" strokeDasharray="1200" strokeDashoffset={Math.max(0, 1200 * (1 - arc))} strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => {
            const p = spring({ frame: frame - Math.round(fps * 0.12) - i * 5, fps, config: theme.spring.bouncy });
            const cx = [245, 500, 710, 844][i];
            const cy = [405, 286, 151, 100][i];
            return <circle key={i} cx={cx} cy={cy} r={12 * p} fill={i === 3 ? theme.colors.primary : theme.colors.textDim} />;
          })}
        </svg>
        <div style={{ position: 'relative', maxWidth: 880, zIndex: 1 }}>
          <Eyebrow>মনের ভেতরের প্রশ্ন</Eyebrow>
          <div style={{ marginTop: 32 }}>
            <WordReveal text="দোয়া কি আকাশ ছোঁয় না?" delay={0} perWord={4} fontSize={82} lineHeight={1.18} maxWidth={820} />
          </div>
          <div style={{ marginTop: 40 }}><SmallRule width={110} /></div>
        </div>
        <div style={{ position: 'absolute', bottom: 272, left: 96, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: theme.colors.textDim }} />
          <Eyebrow>একটি অপেক্ষার গল্প</Eyebrow>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

export const TearsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ripple = spring({ frame: frame - Math.round(fps * 0.2), fps, config: theme.spring.smooth });
  const scale = interpolate(ripple, [0, 1], [0.72, 1], { easing: theme.ease.out, ...clamped });
  const secondAt = Math.round(fps * 1.02);
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '370px 96px 330px', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 560, height: 560, left: 258, top: 500, transform: `scale(${scale})`, borderRadius: '50%', border: `1px solid ${theme.colors.hairline}` }} />
        <div style={{ position: 'absolute', width: 390, height: 390, left: 342, top: 584, transform: `scale(${scale})`, borderRadius: '50%', border: `1px solid ${theme.colors.grid}` }} />
        <div style={{ position: 'absolute', width: 180, height: 180, left: 446, top: 690, transform: `scale(${scale})`, borderRadius: '50%', background: `radial-gradient(circle, ${theme.colors.primaryWash}, transparent 72%)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Eyebrow>ক্লান্ত হৃদয়ের স্বীকারোক্তি</Eyebrow>
          <div style={{ marginTop: 26 }}><WordReveal text="অনেক কেঁদেছো" delay={0} perWord={4} fontSize={77} maxWidth={870} /></div>
          <div style={{ marginTop: 22 }}><WordReveal text="অনেক চেয়েছো" delay={secondAt} perWord={4} fontSize={77} color={theme.colors.primary} maxWidth={870} /></div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

export const IsometricDelayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chartDelay = Math.round(fps * 0.42);
  const orbit = interpolate(frame, [0, Math.round(fps * 5)], [-8, 8], { easing: theme.ease.inOut, ...clamped });
  const breath = 1 + Math.sin(frame / 20) * 0.01;
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '310px 74px 245px', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Eyebrow>সময় লাগতে পারে</Eyebrow>
          <div style={{ marginTop: 14 }}><WordReveal text="দেরি হওয়া মানেই প্রত্যাখ্যান নয়" delay={0} perWord={4} fontSize={67} lineHeight={1.2} maxWidth={900} /></div>
          <div style={{ marginTop: 20 }}><SmallRule width={96} /></div>
        </div>
        <div style={{ width: '100%', transform: `translateY(${orbit}px) scale(${breath})`, transformOrigin: 'center center' }}>
          <IsometricJourneyChart startDelay={chartDelay} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <Eyebrow>দোয়া</Eyebrow>
          <div style={{ height: 1, flex: 1, backgroundColor: theme.colors.hairline }} />
          <Eyebrow>ভরসা</Eyebrow>
          <div style={{ height: 1, flex: 1, backgroundColor: theme.colors.hairline }} />
          <Eyebrow>আশা</Eyebrow>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

export const HardshipScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow = spring({ frame: frame - Math.round(fps * 0.85), fps, config: theme.spring.smooth });
  const lift = interpolate(glow, [0, 1], [78, 0], { easing: theme.ease.out, ...clamped });
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '340px 94px 300px', justifyContent: 'center' }}>
        <svg viewBox="0 0 900 430" style={{ position: 'absolute', width: 850, height: 500, right: 86, top: 650, overflow: 'visible' }}>
          <path d="M100 370 L310 300 L520 230 L730 160 L840 123" fill="none" stroke={theme.colors.hairline} strokeWidth="3" strokeDasharray="10 18" />
          {[0, 1, 2, 3].map((i) => {
            const p = spring({ frame: frame - Math.round(fps * 0.18) - i * 5, fps, config: theme.spring.snappy });
            const x = 136 + i * 166;
            const y = 315 - i * 55;
            const h = (54 + i * 8) * p;
            const w = 112;
            return <g key={i} transform={`translate(0 ${lift})`}>
              <path d={`M${x} ${y} L${x + w} ${y} L${x + w} ${y - h} L${x} ${y - h} Z`} fill={theme.colors.panelLight} stroke={theme.colors.hairline} strokeWidth="2" />
              <path d={`M${x + w} ${y} L${x + w + 28} ${y - 16} L${x + w + 28} ${y - h - 16} L${x + w} ${y - h} Z`} fill={theme.colors.panel} stroke={theme.colors.hairline} strokeWidth="2" />
            </g>;
          })}
        </svg>
        <div style={{ position: 'relative', maxWidth: 880, zIndex: 1 }}>
          <Eyebrow>মনে রেখো</Eyebrow>
          <div style={{ marginTop: 27 }}><WordReveal text="কঠিন সময় মানেই শাস্তি নয়" delay={0} perWord={4} fontSize={77} maxWidth={880} /></div>
          <div style={{ marginTop: 26 }}><WordReveal text="প্রতিটি অধ্যায়ের অর্থ এখনই বোঝা যায় না" delay={Math.round(fps * 1.3)} perWord={4} fontSize={37} weight={500} color={theme.colors.textDim} maxWidth={820} /></div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

export const EaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beam = spring({ frame: frame - Math.round(fps * 0.48), fps, config: theme.spring.smooth });
  const width = interpolate(beam, [0, 1], [0, 560], { easing: theme.ease.out, ...clamped });
  const sway = Math.sin(frame / 25) * 3;
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '340px 96px 300px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 650, width: width, height: 2, backgroundColor: theme.colors.hairline, transform: `translateY(${sway}px)` }} />
        <div style={{ position: 'absolute', top: 578, width: 580, height: 170, borderRadius: 85, border: `1px solid ${theme.colors.hairline}`, opacity: 0.65 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Eyebrow align="center">আল্লাহর প্রতিশ্রুতি</Eyebrow>
          <div style={{ marginTop: 28 }}>
            <WordReveal text="কষ্টের সাথেই" delay={0} perWord={4} fontSize={79} align="center" maxWidth={850} />
          </div>
          <div style={{ marginTop: 9 }}>
            <WordReveal text="স্বস্তি রয়েছে" delay={Math.round(fps * 0.33)} perWord={4} fontSize={91} align="center" color={theme.colors.primary} maxWidth={850} />
          </div>
          <div style={{ marginTop: 28 }}>
            <WordReveal text="সূরা আশ-শারহ" delay={Math.round(fps * 1.05)} perWord={4} fontSize={33} align="center" weight={500} color={theme.colors.textDim} maxWidth={850} />
          </div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

export const PrayerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - Math.round(fps * 0.14), fps, config: theme.spring.smooth });
  const matScale = interpolate(rise, [0, 1], [0.9, 1], { easing: theme.ease.out, ...clamped });
  const pulse = 1 + Math.sin(frame / 18) * 0.012;
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '320px 88px 290px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <svg viewBox="0 0 600 560" style={{ position: 'absolute', top: 430, width: 600, height: 560, transform: `scale(${matScale * pulse})`, overflow: 'visible' }}>
          <path d="M300 58 L492 185 L455 485 L145 485 L108 185 Z" fill={theme.colors.bgAlt} stroke={theme.colors.hairline} strokeWidth="3" />
          <path d="M300 110 L444 205 L417 430 L183 430 L156 205 Z" fill="none" stroke={theme.colors.accent} strokeWidth="2" opacity="0.8" />
          <path d="M300 176 L390 235 L372 380 L228 380 L210 235 Z" fill="none" stroke={theme.colors.hairline} strokeWidth="2" />
          <path d="M300 210 L355 247 L344 330 L256 330 L245 247 Z" fill={theme.colors.panelLight} stroke={theme.colors.hairline} strokeWidth="2" />
          {[0, 1, 2].map((i) => {
            const p = spring({ frame: frame - Math.round(fps * 0.22) - i * 6, fps, config: theme.spring.smooth });
            const size = interpolate(p, [0, 1], [0, 68 + i * 26], { easing: theme.ease.out, ...clamped });
            return <ellipse key={i} cx="300" cy="285" rx={size * 1.7} ry={size * 0.65} fill="none" stroke={i === 0 ? theme.colors.accent : theme.colors.hairline} strokeWidth="2" opacity={1 - i * 0.16} />;
          })}
        </svg>
        <div style={{ position: 'relative', zIndex: 1, marginTop: 285 }}>
          <Eyebrow align="center">ফিরে এসো</Eyebrow>
          <div style={{ marginTop: 22 }}><WordReveal text="নামাজে দাঁড়াও" delay={0} perWord={4} fontSize={76} align="center" maxWidth={900} /></div>
          <div style={{ marginTop: 12 }}><WordReveal text="দু’হাত তুলে দোয়া করো" delay={Math.round(fps * 0.55)} perWord={4} fontSize={62} align="center" color={theme.colors.primary} maxWidth={900} /></div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

export const HopeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const horizon = spring({ frame: frame - Math.round(fps * 0.22), fps, config: theme.spring.smooth });
  const rise = interpolate(horizon, [0, 1], [130, 0], { easing: theme.ease.out, ...clamped });
  const breathe = 1 + Math.sin(frame / 18) * 0.02;
  return (
    <SceneFrame>
      <AbsoluteFill style={{ padding: '305px 86px 280px', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'absolute', left: -80, right: -80, bottom: 470 + rise, height: 560, borderRadius: '50%', background: `radial-gradient(ellipse, ${theme.colors.primaryWash}, transparent 68%)`, transform: `scale(${breathe})` }} />
        <svg viewBox="0 0 980 490" style={{ position: 'absolute', bottom: 476 + rise, width: 980, height: 490 }}>
          <path d="M0 420 C190 360 260 380 430 332 C600 284 720 310 980 205" fill="none" stroke={theme.colors.hairline} strokeWidth="3" />
          <path d="M0 446 C188 392 300 396 460 350 C640 300 790 322 980 250" fill="none" stroke={theme.colors.accent} strokeWidth="2" opacity="0.8" />
          <circle cx="700" cy="160" r={52 * horizon} fill={theme.colors.accentGlow} />
          <circle cx="700" cy="160" r={25 * horizon} fill={theme.colors.accent} />
        </svg>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 910 }}>
          <Eyebrow align="center">আল্লাহর কাছে কিছুই গোপন নয়</Eyebrow>
          <div style={{ marginTop: 24 }}><WordReveal text="আশা হারিও না" delay={0} perWord={4} fontSize={76} align="center" maxWidth={900} /></div>
          <div style={{ marginTop: 12 }}><WordReveal text="রহমত থেকে নিরাশ হয়ো না" delay={Math.round(fps * 0.85)} perWord={4} fontSize={59} align="center" color={theme.colors.primary} maxWidth={900} /></div>
          <div style={{ marginTop: 34 }}><SmallRule width={96} /></div>
        </div>
        <div style={{ position: 'absolute', bottom: 266 }}><Eyebrow align="center">ভরসা রাখো</Eyebrow></div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
