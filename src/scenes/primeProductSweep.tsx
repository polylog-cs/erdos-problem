import { Circle, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import { pythagoreanDirections, type Point } from '../lib/pythagoreanGridScene';
import { RotatingWheel } from '../lib/rotatingWheel';
import { PolyLatex } from '../utilities/latex';

const sweepDistance = 1105;
const starRadius = 370;
const starX = -320;
const starY = 65;
const productY = -500;
const equationY = -400;
const equationJoinX = starX + 42;
const sweepDuration = 15;

function equationLhsFor([dx, dy]: Point) {
  return `${Math.abs(dx)}^2+${Math.abs(dy)}^2`;
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const product = createRef<PolyLatex>();
  const equationLhs = createRef<PolyLatex>();
  const equationRhs = createRef<PolyLatex>();
  const star = createRef<Node>();
  const center = createRef<Circle>();

  const wheel = new RotatingWheel({
    directions: pythagoreanDirections(sweepDistance),
    step: starRadius / sweepDistance,
    style: {
      rayWidth: 2.25,
      endpointSize: 5.4,
      activeLineWidth: 5.6,
      activeEndSize: 12,
    },
  });

  view.add(
    <>
      <Node ref={star} x={starX} y={starY} opacity={0}>
        {wheel.view}
        <Circle
          ref={center}
          size={13}
          fill={palette.focus}
          stroke={palette.background}
          lineWidth={3}
          scale={0}
        />
      </Node>
      <PolyLatex
        ref={product}
        x={starX}
        y={productY}
        tex={'5\\cdot13\\cdot17=1105'}
        fontSize={64}
        opacity={0}
      />
      <PolyLatex
        ref={equationLhs}
        x={equationJoinX}
        y={equationY}
        tex={equationLhsFor(wheel.directions[0])}
        fontSize={48}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={equationRhs}
        x={equationJoinX + 14}
        y={equationY}
        tex={`=${sweepDistance}^2`}
        fontSize={48}
        offsetX={-1}
        opacity={0}
      />
    </>,
  );

  function setSweepText(direction: Point) {
    equationLhs().tex(equationLhsFor(direction));
    equationRhs().tex(`=${sweepDistance}^2`);
  }

  function* runSweep(durationByIndex: (index: number, total: number) => number) {
    wheel.reset();
    setSweepText(wheel.directions[0]);

    yield* all(
      wheel.active().opacity(1, 0.25, easeOutCubic),
      equationLhs().opacity(1, 0.35, easeOutCubic),
      equationRhs().opacity(1, 0.35, easeOutCubic),
      wheel.revealRay(0, { duration: 0.2, opacity: 0.76, endDuration: 0.28 }),
    );

    for (let index = 1; index < wheel.directions.length; index++) {
      const t = durationByIndex(index, wheel.directions.length);
      yield* all(
        wheel.rotateArmTo(index, t),
        delay(t / 2, equationLhs().tex(equationLhsFor(wheel.directions[index]), 0)),
      );
      yield* wheel.revealRay(index, { duration: 0, opacity: 0.68 });
    }

    yield* wheel.active().opacity(0, 0.2, easeInOutCubic);
  }

  yield* all(
    product().opacity(1, 0.4, easeOutCubic),
    equationLhs().opacity(1, 0.4, easeOutCubic),
    equationRhs().opacity(1, 0.4, easeOutCubic),
    star().opacity(1, 0.4, easeOutCubic),
    center().scale(1, 0.28, easeOutCubic),
  );
  yield* waitFor(0.35);

  yield* runSweep((_, total) => sweepDuration / Math.max(1, total - 1));
  yield* waitFor(1.25);
});
