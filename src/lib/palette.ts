import { Color } from '@motion-canvas/core';
import chroma from 'chroma-js';

import { Solarized } from '../utilities/color.tsx';

export const palette = {
  background: Solarized.background,
  text: Solarized.text,
  ink: Solarized.base02,
  mutedInk: Solarized.text,
  dot: Solarized.text,
  grid: new Color(Solarized.background).darken(0.6),
  edge: Solarized.text,
  node: chroma.mix(Solarized.base02, Solarized.background, 0.25, 'rgb'),
  accent: '#f08a16',
  accentDark: '#cf6b00',
  focus: '#d63c36',
};
