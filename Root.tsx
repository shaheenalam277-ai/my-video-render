import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './Main';

const FPS = 30;
const DURATION_IN_FRAMES = Math.round((40440 / 1000) * FPS);

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={MainVideo}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
