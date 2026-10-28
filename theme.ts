import { Easing } from 'remotion';

export const theme = {
  colors: {
    // Classic Islamic Gold
    bg: '#0B1C15',
    bgAlt: '#12261E',
    panel: '#1A2F28',
    panelLight: '#243B32',
    primary: '#C9A227',
    accent: '#1E6B4A',
    text: '#F8F4EC',
    textDim: '#A8B5A0',
    cream: '#F5F0E6',
    faint: '#6B7A70',
    hairline: 'rgba(248, 244, 236, 0.18)',
    grid: 'rgba(248, 244, 236, 0.07)',
    primaryGlow: 'rgba(201, 162, 39, 0.35)',
    primaryWash: 'rgba(201, 162, 39, 0.16)',
    accentGlow: 'rgba(30, 107, 74, 0.22)',
    shadow: 'rgba(0, 0, 0, 0.45)',
    grade: 'rgba(201, 162, 39, 0.05)',
    vignette: 'rgba(0, 0, 0, 0.42)',
  },
  fonts: {
    display: 'Hind Siliguri',
    body: 'Hind Siliguri',
    latin: 'Hind Siliguri',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 12, stiffness: 140, mass: 0.8 },
  },
} as const;
