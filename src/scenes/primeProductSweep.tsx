import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import { PolyLatex } from '../utilities/latex';

type Point = [number, number];
type Sweep = {
  distance: number;
  directions: Point[];
  endpoints: Circle[];
  rays: Line[];
  step: number;
};

const sweepDistances = [1105, 1104, 1106];
const starRadius = 370;
const rayColors = [
  '#d4473f',
  '#c87934',
  '#c4c92d',
  '#80c63b',
  '#37b94a',
  '#35b880',
  '#36c1c3',
  '#3c88d0',
  '#485fd3',
  '#7145d4',
  '#ba3fd0',
  '#d442a8',
];

function colorFor(index: number, total: number) {
  if (total <= rayColors.length) {
    return rayColors[index % rayColors.length];
  }

  return `hsl(${Math.round((360 * index) / total)}, 64%, 54%)`;
}

function toScreen(dx: number, dy: number, step: number): Point {
  return [dx * step, -dy * step];
}

function clockwiseTurn([dx, dy]: Point) {
  const screenAngle = (Math.atan2(-dy, dx) * 180) / Math.PI;
  const normalized = (screenAngle + 360) % 360;

  return (360 - normalized) % 360;
}

function rotationFor(direction: Point) {
  return -clockwiseTurn(direction);
}

function pythagoreanDirections(distance: number) {
  const directions: Point[] = [];
  const seen = new Set<string>();

  for (let dx = -distance; dx <= distance; dx++) {
    const dySquared = distance * distance - dx * dx;
    const dy = Math.sqrt(dySquared);

    if (!Number.isInteger(dy)) {
      continue;
    }

    for (const signedDy of dy === 0 ? [0] : [dy, -dy]) {
      const key = `${dx},${signedDy}`;

      if (!seen.has(key)) {
        seen.add(key);
        directions.push([dx, signedDy]);
      }
    }
  }

  return directions.sort((a, b) => clockwiseTurn(a) - clockwiseTurn(b));
}

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
  const active = createRef<Node>();
  const activeLine = createRef<Line>();
  const activeEnd = createRef<Circle>();
  const sweeps: Sweep[] = sweepDistances.map((sweepDistance) => ({
    distance: sweepDistance,
    directions: pythagoreanDirections(sweepDistance),
    endpoints: [] as Circle[],
    rays: [] as Line[],
    step: starRadius / sweepDistance,
  }));
  const featuredSweep = sweeps[0];

  view.add(
    <>
      <Node ref={star} x={-305} y={55} opacity={0}>
        {sweeps.flatMap((sweep) =>
          sweep.directions.map(([dx, dy], index) => (
            <Line
              ref={makeRef(sweep.rays, index)}
              points={[[0, 0], toScreen(dx, dy, sweep.step)]}
              stroke={colorFor(index, sweep.directions.length)}
              lineWidth={2.25}
              lineCap={'round'}
              opacity={0}
              end={0}
            />
          )),
        )}
        {sweeps.flatMap((sweep) =>
          sweep.directions.map(([dx, dy], index) => (
            <Circle
              ref={makeRef(sweep.endpoints, index)}
              x={dx * sweep.step}
              y={-dy * sweep.step}
              size={5.4}
              fill={colorFor(index, sweep.directions.length)}
              opacity={0}
              scale={0}
            />
          )),
        )}
        <Node ref={active} opacity={0}>
          <Line
            ref={activeLine}
            points={[
              [0, 0],
              [starRadius, 0],
            ]}
            stroke={colorFor(0, featuredSweep.directions.length)}
            lineWidth={5.6}
            lineCap={'round'}
          />
          <Circle
            ref={activeEnd}
            x={starRadius}
            size={12}
            fill={colorFor(0, featuredSweep.directions.length)}
            stroke={palette.background}
            lineWidth={3}
          />
        </Node>
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
        y={-360}
        tex={`${featuredSweep.distance}`}
        fill={palette.ink}
        fontSize={48}
        opacity={0}
      />
      <PolyLatex
        ref={product}
        x={360}
        y={-295}
        tex={'5\\cdot13\\cdot17=1105'}
        fill={palette.ink}
        fontSize={46}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={equationLhs}
        x={560}
        y={-195}
        tex={equationLhsFor(featuredSweep.directions[0])}
        fill={palette.ink}
        fontSize={33}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={equationRhs}
        x={574}
        y={-195}
        tex={`=${featuredSweep.distance}^2`}
        fill={palette.ink}
        fontSize={33}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={optimizeLine}
        x={320}
        y={-120}
        tex={'\\mathrm{if\\ you\\ optimize\\ for\\ general\\ }n:'}
        fill={palette.ink}
        fontSize={30}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={boundLine}
        x={320}
        y={-58}
        tex={'n<n^{1+1/\\log\\log n}\\ll n^{1.001}'}
        fill={palette.ink}
        fontSize={35}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={constructionLine}
        x={320}
        y={10}
        tex={'\\Rightarrow\\ \\mathrm{probably\\ no\\ construction}'}
        fill={palette.ink}
        fontSize={28}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={constructionDetailLine}
        x={350}
        y={58}
        tex={'\\mathrm{with\\ }n^{1.0000001}\\mathrm{\\ edges}'}
        fill={palette.ink}
        fontSize={28}
        offsetX={-1}
        opacity={0}
      />
    </>,
  );

  function setSweepText(sweep: Sweep, directionIndex = 0) {
    distanceLabel().tex(`${sweep.distance}`);
    equationLhs().tex(equationLhsFor(sweep.directions[directionIndex]));
    equationRhs().tex(`=${sweep.distance}^2`);
  }

  function resetSweep(sweep: Sweep) {
    for (const ray of sweep.rays) {
      ray.opacity(0);
      ray.end(0);
    }

    for (const endpoint of sweep.endpoints) {
      endpoint.opacity(0);
      endpoint.scale(0);
    }
  }

  function* fadeSweepOut(sweep: Sweep) {
    yield* all(
      ...sweep.rays.map((ray) => ray.opacity(0, 0.24, easeInOutCubic)),
      ...sweep.endpoints.map((endpoint) => endpoint.opacity(0, 0.24, easeInOutCubic)),
      ...sweep.endpoints.map((endpoint) => endpoint.scale(0, 0.24, easeInOutCubic)),
    );
    resetSweep(sweep);
  }

  function* runSweep(sweep: Sweep, rotationDuration: number) {
    resetSweep(sweep);
    setSweepText(sweep);
    active().rotation(rotationFor(sweep.directions[0]));
    activeLine().stroke(colorFor(0, sweep.directions.length));
    activeEnd().fill(colorFor(0, sweep.directions.length));

    yield* all(
      active().opacity(1, 0.25, easeOutCubic),
      equationLhs().opacity(1, 0.35, easeOutCubic),
      equationRhs().opacity(1, 0.35, easeOutCubic),
      sweep.rays[0].opacity(0.76, 0.2, easeOutCubic),
      sweep.rays[0].end(1, 0.28, easeInOutCubic),
      sweep.endpoints[0].opacity(1, 0.16, easeOutCubic),
      sweep.endpoints[0].scale(1, 0.16, easeOutCubic),
    );

    for (let index = 1; index < sweep.directions.length; index++) {
      const color = colorFor(index, sweep.directions.length);

      yield* all(
        active().rotation(
          rotationFor(sweep.directions[index]),
          rotationDuration,
          easeInOutCubic,
        ),
        activeLine().stroke(color, rotationDuration),
        activeEnd().fill(color, rotationDuration),
      );
      equationLhs().tex(equationLhsFor(sweep.directions[index]));
      yield* all(
        sweep.rays[index].opacity(0.68, 0.045, easeOutCubic),
        sweep.rays[index].end(1, 0.07, easeInOutCubic),
        sweep.endpoints[index].opacity(1, 0.045, easeOutCubic),
        sweep.endpoints[index].scale(1, 0.045, easeOutCubic),
      );
    }

    yield* active().opacity(0, 0.2, easeInOutCubic);
  }

  function* restoreSweepPicture(sweep: Sweep) {
    const lastDirection = sweep.directions.length - 1;

    setSweepText(sweep, lastDirection);
    for (const ray of sweep.rays) {
      ray.end(1);
    }

    yield* all(
      product().opacity(1, 0.35, easeOutCubic),
      equationLhs().opacity(1, 0.35, easeOutCubic),
      equationRhs().opacity(1, 0.35, easeOutCubic),
      ...sweep.rays.map((ray) => ray.opacity(0.68, 0.35, easeOutCubic)),
      ...sweep.endpoints.map((endpoint) => endpoint.opacity(1, 0.25, easeOutCubic)),
      ...sweep.endpoints.map((endpoint) => endpoint.scale(1, 0.25, easeOutCubic)),
    );
  }

  yield* all(
    product().opacity(1, 0.4, easeOutCubic),
    distanceLabel().opacity(1, 0.4, easeOutCubic),
    star().opacity(1, 0.4, easeOutCubic),
    center().scale(1, 0.28, easeOutCubic),
  );
  yield* waitFor(0.35);

  yield* runSweep(sweeps[0], 0.075);
  yield* waitFor(0.45);
  yield* all(
    product().opacity(0, 0.25, easeInOutCubic),
    equationLhs().opacity(0, 0.25, easeInOutCubic),
    equationRhs().opacity(0, 0.25, easeInOutCubic),
    fadeSweepOut(sweeps[0]),
  );

  yield* waitFor(0.2);
  yield* runSweep(sweeps[1], 0.28);
  yield* waitFor(0.45);
  yield* all(
    equationLhs().opacity(0, 0.25, easeInOutCubic),
    equationRhs().opacity(0, 0.25, easeInOutCubic),
    fadeSweepOut(sweeps[1]),
  );

  yield* waitFor(0.2);
  yield* runSweep(sweeps[2], 0.28);
  yield* waitFor(0.45);
  yield* all(
    equationLhs().opacity(0, 0.25, easeInOutCubic),
    equationRhs().opacity(0, 0.25, easeInOutCubic),
    fadeSweepOut(sweeps[2]),
  );

  yield* waitFor(0.25);
  yield* restoreSweepPicture(sweeps[0]);
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
