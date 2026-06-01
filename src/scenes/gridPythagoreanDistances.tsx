import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  chain,
  createRef,
  easeInBack,
  easeInOutBack,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import {
  colorFor,
  gridSegmentsForDirection,
  latticeDots,
  pythagoreanDirections,
  toScreen,
  undirectedDirections,
  type Point,
} from '../lib/pythagoreanGridScene';
import {
  squareGridCoordinates,
  squareGridExtent,
  squareGridStep,
} from '../lib/squareGrid';
import { PolyLatex } from '../utilities/latex';

function clockwiseTurn([dx, dy]: Point) {
  const screenAngle = (Math.atan2(-dy, dx) * 180) / Math.PI;
  const normalized = (screenAngle + 360) % 360;

  return (360 - normalized) % 360;
}

function sortedClockwise(directions: Point[]) {
  return [...directions].sort((a, b) => clockwiseTurn(a) - clockwiseTurn(b));
}

function rotationFor(direction: Point) {
  return -clockwiseTurn(direction);
}

function equationLhsFor([dx, dy]: Point) {
  return `${Math.abs(dx)}^2+${Math.abs(dy)}^2`;
}

function fullGridDotsEnabled() {
  return (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('fullGridDots') === '1'
  );
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const smallStep = squareGridStep;
  const smallGrid = createRef<Node>();
  const smallLines: Line[] = [];
  const smallDots: Circle[] = [];
  const centerDot = createRef<Circle>();
  const unitLabel = createRef<PolyLatex>();
  const unitDirections = sortedClockwise(pythagoreanDirections(1));
  const unitRays: Line[] = [];
  const unitEndpoints: Circle[] = [];
  const unitActive = createRef<Node>();
  const unitActiveLine = createRef<Line>();
  const unitActiveEnd = createRef<Circle>();
  const fiveFormulaLhs = createRef<PolyLatex>();
  const fiveFormulaRhs = createRef<PolyLatex>();
  const fiveDirections = sortedClockwise(pythagoreanDirections(5));
  const fiveRays: Line[] = [];
  const fiveEndpoints: Circle[] = [];
  const fiveActive = createRef<Node>();
  const fiveActiveLine = createRef<Line>();
  const fiveActiveEnd = createRef<Circle>();
  const globalFiveEdgesLayer = createRef<Node>();
  const globalFiveEdgesLayers: Node[] = [];
  const globalFiveDirections = sortedClockwise(pythagoreanDirections(5));
  const globalFiveEdges = globalFiveDirections.map((direction) =>
    gridSegmentsForDirection(direction, squareGridExtent),
  );
  const globalFiveEdgeLines = globalFiveEdges.map(() => [] as Line[]);

  view.add(
    <Node ref={smallGrid} x={-110} y={35}>
      {squareGridCoordinates.map((x, index) => (
        <Line
          ref={makeRef(smallLines, index)}
          points={[
            [x * smallStep, -squareGridExtent * smallStep],
            [x * smallStep, squareGridExtent * smallStep],
          ]}
          stroke={palette.grid}
          lineWidth={1}
          end={0}
          opacity={0}
        />
      ))}
      {squareGridCoordinates.map((y, index) => (
        <Line
          ref={makeRef(smallLines, squareGridCoordinates.length + index)}
          points={[
            [-squareGridExtent * smallStep, y * smallStep],
            [squareGridExtent * smallStep, y * smallStep],
          ]}
          stroke={palette.grid}
          lineWidth={1}
          end={0}
          opacity={0}
        />
      ))}
      <Node ref={globalFiveEdgesLayer}>
        {globalFiveEdges.flatMap((segments, directionIndex) => (
          <Node
            ref={makeRef(globalFiveEdgesLayers, directionIndex)}
            opacity={0}
            zIndex={directionIndex}
          >
            {segments.map(([[startX, startY], [endX, endY]], edgeIndex) => (
              <Line
                ref={makeRef(globalFiveEdgeLines[directionIndex], edgeIndex)}
                points={[
                  [startX * smallStep, -startY * smallStep],
                  [endX * smallStep, -endY * smallStep],
                ]}
                stroke={colorFor(directionIndex, fiveDirections.length)}
                lineWidth={2.2}
                lineCap={'round'}
                opacity={1}
                end={1}
              />
            ))}
          </Node>
        ))}
      </Node>
      {latticeDots(squareGridExtent).map(([x, y], index) => (
        <Circle
          ref={makeRef(smallDots, index)}
          x={x * smallStep}
          y={y * smallStep}
          size={7}
          fill={palette.dot}
          opacity={0.86}
          scale={0}
        />
      ))}

      <Circle
        ref={centerDot}
        size={14}
        fill={palette.focus}
        stroke={palette.background}
        lineWidth={3}
        scale={0}
      />
      <PolyLatex
        ref={unitLabel}
        x={smallStep / 2}
        y={-22}
        tex={'1'}
        fontSize={30}
        opacity={0}
      />

      {unitDirections.map(([dx, dy], index) => (
        <Line
          ref={makeRef(unitRays, index)}
          points={[[0, 0], toScreen(dx, dy, smallStep)]}
          stroke={colorFor(index, unitDirections.length)}
          lineWidth={7.5}
          lineCap={'round'}
          opacity={0}
          end={0}
        />
      ))}
      {unitDirections.map(([dx, dy], index) => (
        <Circle
          ref={makeRef(unitEndpoints, index)}
          x={dx * smallStep}
          y={-dy * smallStep}
          size={12}
          fill={colorFor(index, unitDirections.length)}
          stroke={palette.background}
          lineWidth={2.5}
          opacity={0}
          scale={0}
        />
      ))}

      <Node ref={unitActive} opacity={0}>
        <Line
          ref={unitActiveLine}
          points={[
            [0, 0],
            [smallStep, 0],
          ]}
          stroke={colorFor(0, unitDirections.length)}
          lineWidth={9}
          lineCap={'round'}
        />
        <Circle
          ref={unitActiveEnd}
          x={smallStep}
          size={14}
          fill={colorFor(0, unitDirections.length)}
          stroke={palette.background}
          lineWidth={3}
        />
      </Node>

      {fiveDirections.map(([dx, dy], index) => (
        <Line
          ref={makeRef(fiveRays, index)}
          points={[[0, 0], toScreen(dx, dy, smallStep)]}
          stroke={colorFor(index, fiveDirections.length)}
          lineWidth={4.8}
          lineCap={'round'}
          opacity={0}
          end={0}
        />
      ))}
      {fiveDirections.map(([dx, dy], index) => (
        <Circle
          ref={makeRef(fiveEndpoints, index)}
          x={dx * smallStep}
          y={-dy * smallStep}
          size={10}
          fill={colorFor(index, fiveDirections.length)}
          opacity={0}
          scale={0}
        />
      ))}

      <Node ref={fiveActive} opacity={0}>
        <Line
          ref={fiveActiveLine}
          points={[
            [0, 0],
            [5 * smallStep, 0],
          ]}
          stroke={colorFor(0, fiveDirections.length)}
          lineWidth={9}
          lineCap={'round'}
        />
        <Circle
          ref={fiveActiveEnd}
          x={5 * smallStep}
          size={15}
          fill={colorFor(0, fiveDirections.length)}
          stroke={palette.background}
          lineWidth={3}
        />
      </Node>
    </Node>,
  );

  view.add(
    <>
      <PolyLatex
        ref={fiveFormulaLhs}
        x={565}
        y={-255}
        tex={equationLhsFor(fiveDirections[0])}
        fontSize={46}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={fiveFormulaRhs}
        x={582}
        y={-255}
        tex={'=5^2'}
        fontSize={46}
        offsetX={-1}
        opacity={0}
      />
    </>,
  );

  yield* all(
    sequence(
      0.018,
      ...smallLines.map((line) =>
        all(line.opacity(1, 0.22, easeOutCubic), line.end(1, 0.68, easeInOutCubic)),
      ),
    ),
    sequence(0.0035, ...smallDots.map((dot) => dot.scale(1, 0.22, easeOutCubic))),
  );

  yield* centerDot().scale(1, 0.22, easeOutCubic);
  yield* all(
    unitActive().opacity(1, 0.22, easeOutCubic),
    unitRays[0].opacity(0.9, 0.22, easeOutCubic),
    unitRays[0].end(1, 0.34, easeInOutCubic),
    unitEndpoints[0].opacity(1, 0.2, easeOutCubic),
    unitEndpoints[0].scale(1, 0.2, easeOutCubic),
  );
  yield* unitLabel().opacity(1, 0.25, easeOutCubic);

  yield* waitFor(0.18);

  for (let index = 1; index < unitDirections.length; index++) {
    const color = colorFor(index, unitDirections.length);

    yield* all(
      unitActive().rotation(rotationFor(unitDirections[index]), 0.22, easeInOutCubic),
      unitActiveLine().stroke(color, 0.22),
      unitActiveEnd().fill(color, 0.22),
    );
    yield* all(
      unitRays[index].opacity(0.9, 0.12, easeOutCubic),
      unitRays[index].end(1, 0.18, easeInOutCubic),
      unitEndpoints[index].opacity(1, 0.12, easeOutCubic),
      unitEndpoints[index].scale(1, 0.12, easeOutCubic),
    );
    yield* waitFor(0.04);
  }

  yield* unitActive().opacity(0, 0.18, easeInOutCubic);
  yield* waitFor(0.45);

  yield* all(
    unitLabel().opacity(0, 0.25, easeInOutCubic),
    ...unitRays.map((ray) => ray.opacity(0, 0.3, easeInOutCubic)),
    ...unitEndpoints.map((endpoint) => endpoint.opacity(0, 0.3, easeInOutCubic)),
  );

  yield* all(
    fiveActive().opacity(1, 0.25, easeOutCubic),
    fiveFormulaLhs().opacity(1, 0.35, easeOutCubic),
    fiveFormulaRhs().opacity(1, 0.35, easeOutCubic),
    fiveRays[0].opacity(0.9, 0.25, easeOutCubic),
    fiveRays[0].end(1, 0.34, easeInOutCubic),
    fiveEndpoints[0].opacity(1, 0.2, easeOutCubic),
    fiveEndpoints[0].scale(1, 0.2, easeOutCubic),
  );

  yield* waitFor(0.25);

  for (let index = 1; index < fiveDirections.length; index++) {
    const color = colorFor(index, fiveDirections.length);

    yield* all(
      fiveActive().rotation(rotationFor(fiveDirections[index]), 0.36, easeInOutCubic),
      fiveActiveLine().stroke(color, 0.36),
      fiveActiveEnd().fill(color, 0.36),
    );
    fiveFormulaLhs().tex(equationLhsFor(fiveDirections[index]));
    yield* all(
      fiveRays[index].opacity(0.9, 0.16, easeOutCubic),
      fiveRays[index].end(1, 0.24, easeInOutCubic),
      fiveEndpoints[index].opacity(1, 0.16, easeOutCubic),
      fiveEndpoints[index].scale(1, 0.16, easeOutCubic),
    );
    yield* waitFor(0.04);
  }

  yield* fiveActive().opacity(0, 0.22, easeInOutCubic);
  yield* waitFor(0.35);

  yield* all(
    centerDot().opacity(0, 0.25, easeInOutCubic),
    fiveFormulaLhs().opacity(0, 0.25, easeInOutCubic),
    fiveFormulaRhs().opacity(0, 0.25, easeInOutCubic),
    ...fiveRays.map((ray) => ray.opacity(0, 0.3, easeInOutCubic)),
    ...fiveEndpoints.map((endpoint) => endpoint.opacity(0, 0.3, easeInOutCubic)),
  );

  yield* waitFor(0.18);

  yield* sequence(
    0.2,
    ...globalFiveEdgesLayers.map((layer) =>
      chain(layer.opacity(1, 0.2), layer.opacity(0.3, 0.2)),
    ),
  );

  yield* waitFor(0.7);
  yield* globalFiveEdgesLayer().opacity(0, 0.35, easeInOutCubic);
  yield* waitFor(0.22);

  const denseGrid = createRef<Node>();
  const denseVectorFormulaLhs = createRef<PolyLatex>();
  const denseVectorFormulaRhs = createRef<PolyLatex>();
  const whyTitle = createRef<PolyLatex>();
  const primeLine = createRef<PolyLatex>();
  const primeList = createRef<PolyLatex>();
  const productLine = createRef<PolyLatex>();
  const denseCenter = createRef<Circle>();
  const sixtyFiveActive = createRef<Node>();
  const sixtyFiveActiveLine = createRef<Line>();
  const sixtyFiveActiveEnd = createRef<Circle>();
  const sixtyFiveRays: Line[] = [];
  const sixtyFiveEndpoints: Circle[] = [];
  const denseStep = 5.5;
  const denseDotEvery = fullGridDotsEnabled() ? 1 : 10;
  const denseDotSize = fullGridDotsEnabled() ? 1.4 : 3.3;
  const denseDotOpacity = fullGridDotsEnabled() ? 0.25 : 0.45;
  const sixtyFiveDirections = sortedClockwise(pythagoreanDirections(65));

  view.add(
    <Node ref={denseGrid} x={-130} y={25} opacity={0}>
      {latticeDots(70, denseDotEvery).map(([x, y]) => (
        <Circle
          x={x * denseStep}
          y={-y * denseStep}
          size={denseDotSize}
          fill={palette.dot}
          opacity={denseDotOpacity}
        />
      ))}

      {sixtyFiveDirections.map(([dx, dy], index) => (
        <Line
          ref={makeRef(sixtyFiveRays, index)}
          points={[[0, 0], toScreen(dx, dy, denseStep)]}
          stroke={colorFor(index, sixtyFiveDirections.length)}
          lineWidth={2.9}
          lineCap={'round'}
          opacity={0}
          end={0}
        />
      ))}
      {sixtyFiveDirections.map(([dx, dy], index) => (
        <Circle
          ref={makeRef(sixtyFiveEndpoints, index)}
          x={dx * denseStep}
          y={-dy * denseStep}
          size={6.5}
          fill={colorFor(index, sixtyFiveDirections.length)}
          opacity={0}
          scale={0}
        />
      ))}

      <Node ref={sixtyFiveActive} opacity={0}>
        <Line
          ref={sixtyFiveActiveLine}
          points={[
            [0, 0],
            [65 * denseStep, 0],
          ]}
          stroke={colorFor(0, sixtyFiveDirections.length)}
          lineWidth={6.5}
          lineCap={'round'}
        />
        <Circle
          ref={sixtyFiveActiveEnd}
          x={65 * denseStep}
          size={13}
          fill={colorFor(0, sixtyFiveDirections.length)}
          stroke={palette.background}
          lineWidth={3}
        />
      </Node>
      <Circle
        ref={denseCenter}
        size={13}
        fill={palette.focus}
        stroke={palette.background}
        lineWidth={3}
        scale={0}
      />
    </Node>,
  );

  view.add(
    <>
      <PolyLatex
        ref={denseVectorFormulaLhs}
        x={555}
        y={-255}
        tex={equationLhsFor(sixtyFiveDirections[0])}
        fontSize={42}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={denseVectorFormulaRhs}
        x={572}
        y={-255}
        tex={'=65^2'}
        fontSize={42}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={whyTitle}
        x={275}
        y={-265}
        tex={'\\mathrm{Why\\ is\\ }65\\mathrm{\\ special?}'}
        fontSize={35}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={primeLine}
        x={275}
        y={-190}
        tex={'\\mathrm{primes\\ with\\ remainder\\ }1\\pmod4'}
        fontSize={25}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={primeList}
        x={275}
        y={-140}
        tex={'5,13,17,29,37,\\ldots'}
        fontSize={32}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={productLine}
        x={275}
        y={-75}
        tex={'5\\times13=65'}
        fontSize={37}
        offsetX={-1}
        opacity={0}
      />
    </>,
  );

  yield* all(
    smallGrid().opacity(0, 0.45, easeInOutCubic),
    fiveFormulaLhs().opacity(0, 0.3, easeInOutCubic),
    fiveFormulaRhs().opacity(0, 0.3, easeInOutCubic),
  );
  yield* all(
    denseGrid().opacity(1, 0.45, easeOutCubic),
    denseCenter().scale(1, 0.28, easeOutCubic),
  );
  yield* all(
    sixtyFiveActive().opacity(1, 0.25, easeOutCubic),
    denseVectorFormulaLhs().opacity(1, 0.35, easeOutCubic),
    denseVectorFormulaRhs().opacity(1, 0.35, easeOutCubic),
    sixtyFiveRays[0].opacity(0.82, 0.24, easeOutCubic),
    sixtyFiveRays[0].end(1, 0.34, easeInOutCubic),
    sixtyFiveEndpoints[0].opacity(1, 0.2, easeOutCubic),
    sixtyFiveEndpoints[0].scale(1, 0.2, easeOutCubic),
  );

  yield* waitFor(0.25);

  for (let index = 1; index < sixtyFiveDirections.length; index++) {
    const color = colorFor(index, sixtyFiveDirections.length);

    yield* all(
      sixtyFiveActive().rotation(
        rotationFor(sixtyFiveDirections[index]),
        0.2,
        easeInOutCubic,
      ),
      sixtyFiveActiveLine().stroke(color, 0.2),
      sixtyFiveActiveEnd().fill(color, 0.2),
    );
    denseVectorFormulaLhs().tex(equationLhsFor(sixtyFiveDirections[index]));
    yield* all(
      sixtyFiveRays[index].opacity(0.78, 0.11, easeOutCubic),
      sixtyFiveRays[index].end(1, 0.18, easeInOutCubic),
      sixtyFiveEndpoints[index].opacity(1, 0.11, easeOutCubic),
      sixtyFiveEndpoints[index].scale(1, 0.11, easeOutCubic),
    );
    yield* waitFor(0.02);
  }

  yield* sixtyFiveActive().opacity(0, 0.22, easeInOutCubic);
  yield* waitFor(0.35);
  yield* all(
    denseVectorFormulaLhs().opacity(0, 0.25, easeInOutCubic),
    denseVectorFormulaRhs().opacity(0, 0.25, easeInOutCubic),
    whyTitle().opacity(1, 0.35, easeOutCubic),
  );
  yield* all(
    primeLine().opacity(1, 0.35, easeOutCubic),
    primeList().opacity(1, 0.35, easeOutCubic),
  );
  yield* waitFor(0.35);
  yield* productLine().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(1.3);
});
