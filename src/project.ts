import {makeProject} from '@motion-canvas/core';

import cherryCountingTwoWays from './scenes/cherryCountingTwoWays?scene';
import discreteGeometryAntIsland from './scenes/discreteGeometryAntIsland?scene';
import gridPythagoreanDistances from './scenes/gridPythagoreanDistances?scene';
import primeProductSweep from './scenes/primeProductSweep?scene';
import unitDistanceRulerIntro from './scenes/unitDistanceRulerIntro?scene';

export default makeProject({
  scenes: [
    unitDistanceRulerIntro,
    cherryCountingTwoWays,
    gridPythagoreanDistances,
    primeProductSweep,
    discreteGeometryAntIsland,
  ],
});
