import { createAllEdgesSweepScene } from '../lib/pythagoreanGridScene';

export default createAllEdgesSweepScene({
  distance: 5,
  extent: 10,
  step: 30,
  dotSize: 6,
  label: 'a^2 + b^2 = 5^2',
});
