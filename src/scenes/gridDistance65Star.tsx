import { createPythagoreanStarScene } from '../lib/pythagoreanGridScene';

export default createPythagoreanStarScene({
  distance: 65,
  extent: 70,
  step: 4.35,
  dotEvery: 2,
  dotSize: 3,
  lineWidth: 3.3,
  endpointSize: 8,
  label: 'a^2 + b^2 = 65^2',
});
