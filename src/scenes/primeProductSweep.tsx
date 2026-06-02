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

const sweepDistances = [1105, 1104, 1106];
const starRadius = 370;

function equationLhsFor([dx, dy]: Point) {
  return `${Math.abs(dx)}^2+${Math.abs(dy)}^2`;
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const product = createRef<PolyLatex>();
  const distanceLabel = createRef<PolyLatex>();
  const equationLhs = createRef<PolyLatex>();
  const equationRhs = createRef<PolyLatex>();
  const optimizeLine = createRef<PolyLatex>();
  const boundLine = createRef<PolyLatex>();
  const constructionLine = createRef<PolyLatex>();
  const constructionDetailLine = createRef<PolyLatex>();
  const star = createRef<Node>();
  const center = createRef<Circle>();

  const wheels = sweepDistances.map(
    (distance) =>
      new RotatingWheel({
        directions: pythagoreanDirections(distance),
        step: starRadius / distance,
        style: {
          rayWidth: 2.25,
          endpointSize: 5.4,
          activeLineWidth: 5.6,
          activeEndSize: 12,
        },
      }),
  );
  const featuredWheel = wheels[0];

  view.add(
    <>
      <Node ref={star} x={-305} y={55} opacity={0}>
        {wheels.map((wheel) => wheel.view)}
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
        ref={distanceLabel}
        x={-305}
        y={-380}
        tex={`${sweepDistances[0]}`}
        fontSize={64}
        opacity={0}
      />
      <PolyLatex
        ref={product}
        x={250}
        y={-350}
        tex={'5\\cdot13\\cdot17=1105'}
        fontSize={64}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={equationLhs}
        x={560}
        y={-195}
        tex={equationLhsFor(featuredWheel.directions[0])}
        fontSize={48}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={equationRhs}
        x={574}
        y={-195}
        tex={`=${sweepDistances[0]}^2`}
        fontSize={48}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={optimizeLine}
        x={320}
        y={-120}
        tex={'\\mathrm{if\\ you\\ optimize\\ for\\ general\\ }n:'}
        fontSize={40}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={boundLine}
        x={320}
        y={-58}
        tex={'n<n^{1+1/\\log\\log n}\\ll n^{1.001}'}
        fontSize={35}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={constructionLine}
        x={320}
        y={10}
        tex={'\\Rightarrow\\ \\mathrm{probably\\ no\\ construction}'}
        fontSize={28}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={constructionDetailLine}
        x={350}
        y={58}
        tex={'\\mathrm{with\\ }n^{1.0000001}\\mathrm{\\ edges}'}
        fontSize={28}
        offsetX={-1}
        opacity={0}
      />
    </>,
  );

  function setSweepText(distance: number, direction: Point) {
    distanceLabel().tex(`${distance}`);
    equationLhs().tex(equationLhsFor(direction));
    equationRhs().tex(`=${distance}^2`);
  }

  function* runSweep(wheel: RotatingWheel, distance: number, durationByIndex) {
    wheel.reset();
    setSweepText(distance, wheel.directions[0]);

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

  function* fadeSweepOut(wheel: RotatingWheel) {
    yield* wheel.fadeOut(0.24);
    wheel.reset();
  }

  function* restoreSweepPicture(wheel: RotatingWheel, distance: number) {
    const lastDirection = wheel.directions[wheel.directions.length - 1];

    setSweepText(distance, lastDirection);
    wheel.showAll();

    yield* all(
      product().opacity(1, 0.35, easeOutCubic),
      //      equationLhs().opacity(1, 0.35, easeOutCubic),
      //      equationRhs().opacity(1, 0.35, easeOutCubic),
      ...wheel.rays.map((ray) => ray.opacity(0.68, 0.35, easeOutCubic)),
      ...wheel.endpoints.map((endpoint) => endpoint.opacity(1, 0.25, easeOutCubic)),
      ...wheel.endpoints.map((endpoint) => endpoint.scale(1, 0.25, easeOutCubic)),
    );
  }

  yield* all(
    product().opacity(1, 0.4, easeOutCubic),
    distanceLabel().opacity(1, 0.4, easeOutCubic),
    star().opacity(1, 0.4, easeOutCubic),
    center().scale(1, 0.28, easeOutCubic),
  );
  yield* waitFor(0.35);

  yield* runSweep(wheels[0], sweepDistances[0], (i: number) => 0.01 + 0.5 / (i + 1));
  yield* waitFor(0.45);
  yield* all(
    product().opacity(0, 0.25, easeInOutCubic),
    equationLhs().opacity(0, 0.25, easeInOutCubic),
    equationRhs().opacity(0, 0.25, easeInOutCubic),
    fadeSweepOut(wheels[0]),
  );

  yield* waitFor(1);
  yield* runSweep(wheels[1], sweepDistances[1], () => 0.28);
  yield* waitFor(0.45);
  yield* all(
    equationLhs().opacity(0, 0.25, easeInOutCubic),
    equationRhs().opacity(0, 0.25, easeInOutCubic),
    fadeSweepOut(wheels[1]),
  );

  yield* waitFor(1);
  yield* runSweep(wheels[2], sweepDistances[2], () => 0.28);
  yield* waitFor(0.45);
  yield* all(
    equationLhs().opacity(0, 0.25, easeInOutCubic),
    equationRhs().opacity(0, 0.25, easeInOutCubic),
    fadeSweepOut(wheels[2]),
  );

  yield* waitFor(0.25);
  yield* restoreSweepPicture(wheels[0], sweepDistances[0]);
  yield* waitFor(0.25);
  yield* all(
    optimizeLine().opacity(1, 0.35, easeOutCubic),
    boundLine().opacity(1, 0.35, easeOutCubic),
  );
  yield* waitFor(0.25);
  yield* all(
    constructionLine().opacity(1, 0.35, easeOutCubic),
    constructionDetailLine().opacity(1, 0.35, easeOutCubic),
  );
  yield* waitFor(1.25);
});
