import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

const milestones = [
  { label: 'দোয়া', height: 105 },
  { label: 'অপেক্ষা', height: 156 },
  { label: 'ভরসা', height: 215 },
  { label: 'আশা', height: 278 },
];

const clamped = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const IsometricJourneyChart: React.FC<{ startDelay?: number }> = ({ startDelay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gridIn = spring({ frame: frame - startDelay, fps, config: theme.spring.smooth });
  const activeIndex = Math.min(milestones.length - 1, Math.max(0, Math.floor((frame - startDelay) / 8)));
  const planeOpacity = interpolate(gridIn, [0, 1], [0, 0.72], { easing: theme.ease.out, ...clamped });

  return (
    <svg viewBox="0 0 900 760" role="img" aria-label="Axis-free isometric chart showing a symbolic journey from dua and waiting to trust and hope" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
      <g opacity={planeOpacity}>
        <path d="M105 530 L675 530 L805 465 L235 465 Z" fill={theme.colors.panel} stroke={theme.colors.hairline} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => {
          const y = 480 + i * 14;
          return <path key={`grid-${i}`} d={`M${175 + i * 12} ${y} L${745 + i * 12} ${y}`} fill="none" stroke={theme.colors.grid} strokeWidth="2" />;
        })}
        {[0, 1, 2, 3].map((i) => {
          const x = 235 + i * 142;
          return <path key={`cross-${i}`} d={`M${x} 465 L${x - 130} 530`} fill="none" stroke={theme.colors.grid} strokeWidth="2" />;
        })}
        <path d="M105 530 L675 530 L805 465" fill="none" stroke={theme.colors.hairline} strokeWidth="2" />
      </g>

      {milestones.map((item, i) => {
        const pop = spring({ frame: frame - startDelay - 8 - i * 6, fps, config: theme.spring.bouncy });
        const height = interpolate(pop, [0, 1], [0, item.height], { easing: theme.ease.out, ...clamped });
        const x = 146 + i * 143;
        const base = 529 - i * 15;
        const width = 76;
        const depth = 34;
        const top = base - height;
        const isActive = i === activeIndex && pop > 0.18;
        const front = isActive ? theme.colors.primary : theme.colors.panelLight;
        const side = isActive ? theme.colors.primaryGlow : theme.colors.panel;
        const topFace = isActive ? theme.colors.textDim : theme.colors.bgAlt;
        const scale = interpolate(pop, [0, 1], [0.9, 1], { easing: theme.ease.out, ...clamped });

        return (
          <g key={item.label} transform={`translate(${x} ${base}) scale(1 ${scale}) translate(${-x} ${-base})`}>
            <path d={`M${x + width} ${base} L${x + width + depth} ${base - 18} L${x + width + depth} ${top - 18} L${x + width} ${top} Z`} fill={side} stroke={theme.colors.hairline} strokeWidth="1.5" />
            <path d={`M${x} ${top} L${x + width} ${top} L${x + width + depth} ${top - 18} L${x + depth} ${top - 18} Z`} fill={topFace} stroke={theme.colors.hairline} strokeWidth="1.5" />
            <path d={`M${x} ${base} L${x + width} ${base} L${x + width} ${top} L${x} ${top} Z`} fill={front} stroke={theme.colors.hairline} strokeWidth="1.5" />
            <text x={x + width / 2 + depth / 2} y={base + 58} textAnchor="middle" fill={theme.colors.textDim} fontFamily={theme.fonts.display} fontSize="25" fontWeight="600" style={{ letterSpacing: 0 }}>{item.label}</text>
          </g>
        );
      })}

      <path d="M125 596 L690 596" stroke={theme.colors.hairline} strokeWidth="2" opacity="0.75" />
      <text x="450" y="686" textAnchor="middle" fill={theme.colors.faint} fontFamily={theme.fonts.display} fontSize="21" fontWeight="500" style={{ letterSpacing: 0 }}>কোনো সংখ্যা নয়—আশার পথচিত্র</text>
    </svg>
  );
};
