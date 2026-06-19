import { makeProject } from '@motion-canvas/core';

import asymptoticPushExponent from './scenes/asymptoticPushExponent?scene';
import asymptoticUnitDistanceTimeline from './scenes/asymptoticUnitDistanceTimeline?scene';
import cherryCountingTwoWays from './scenes/cherryCountingTwoWays?scene';
import cyclotomicPointsetSpiral from './scenes/cyclotomicPointsetSpiral?scene';
import discreteGeometryAntIsland from './scenes/discreteGeometryAntIsland?scene';
import ergr80ProblemScroll from './scenes/ergr80ProblemScroll?scene';
import gridLowerBoundQuestion from './scenes/gridLowerBoundQuestion?scene';
import gridPythagoreanDistances from './scenes/gridPythagoreanDistances?scene';
import primeProductSweep from './scenes/primeProductSweep?scene';
import unitDistanceRulerIntro from './scenes/unitDistanceRulerIntro?scene';
import waterlineMathAbility from './scenes/waterlineMathAbility?scene';

export default makeProject({
  experimentalFeatures: true,
  scenes: [
    ergr80ProblemScroll,
    unitDistanceRulerIntro,
    gridLowerBoundQuestion,
    cherryCountingTwoWays,
    gridPythagoreanDistances,
    primeProductSweep,
    discreteGeometryAntIsland,
    cyclotomicPointsetSpiral,
    asymptoticPushExponent,
    asymptoticUnitDistanceTimeline,
    waterlineMathAbility,
  ],
});
