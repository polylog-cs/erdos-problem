import { createPythagoreanStarScene } from '../lib/pythagoreanGridScene';

export default createPythagoreanStarScene({
  distance: 5,
  extent: 10,
  step: 30,
  dotSize: 7,
  lineWidth: 5,
  endpointSize: 12,
  label: 'a^2 + b^2 = 5^2',
});
