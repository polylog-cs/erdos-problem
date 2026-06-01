import {Circle, Latex, Line, Node} from '@motion-canvas/2d';
import type {View2D} from '@motion-canvas/2d/lib/components';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';

import {palette} from './palette';
import {
  squareGridCoordinates,
  squareGridExtent,
  squareGridStep,
} from './squareGrid';

const step = squareGridStep;
const centerColumn = squareGridExtent;
const centerRow = squareGridExtent;
type Point = [number, number];

const gridXs = squareGridCoordinates.map(x => x * step);
const gridYs = squareGridCoordinates.map(y => y * step);

const plusSegments: [Point, Point][] = [
  [
    [0, 0],
    [step, 0],
  ],
  [
    [0, 0],
    [-step, 0],
  ],
  [
    [0, 0],
    [0, step],
  ],
  [
    [0, 0],
    [0, -step],
  ],
];

interface GridUnitSceneOptions {
  boundLabel?: string;
}

export function createGridUnitScene({boundLabel}: GridUnitSceneOptions = {}) {
  return makeScene2D(function* (view) {
    yield* playGridUnitScene(view, {boundLabel});
  });
}

export function* playGridUnitScene(
  view: View2D,
  {boundLabel}: GridUnitSceneOptions = {},
) {
    view.fill(palette.background);

    const gridLines: Line[] = [];
    const dots: Circle[] = [];
    const unitLines: Line[] = [];
    const centerDot = createRef<Circle>();
    const bound = createRef<Latex>();

    const dotData = gridXs.flatMap((x, xIndex) =>
      gridYs.map((y, yIndex) => ({
        x,
        y,
        sort: Math.hypot(xIndex - centerColumn, yIndex - centerRow),
      })),
    );
    const dotOrder = [...dotData.keys()].sort(
      (a, b) => dotData[a].sort - dotData[b].sort,
    );

    view.add(
      <Node>
        {gridXs.map((x, index) => (
          <Line
            ref={makeRef(gridLines, index)}
            points={[
              [x, gridYs[0]],
              [x, gridYs[gridYs.length - 1]],
            ]}
            stroke={palette.grid}
            lineWidth={1}
            end={0}
            opacity={0}
          />
        ))}
        {gridYs.map((y, index) => (
          <Line
            ref={makeRef(gridLines, gridXs.length + index)}
            points={[
              [gridXs[0], y],
              [gridXs[gridXs.length - 1], y],
            ]}
            stroke={palette.grid}
            lineWidth={1}
            end={0}
            opacity={0}
          />
        ))}
        {dotData.map(({x, y}, index) => (
          <Circle
            ref={makeRef(dots, index)}
            x={x}
            y={y}
            size={8}
            fill={palette.ink}
            scale={0}
          />
        ))}
        {plusSegments.map(([from, to], index) => (
          <Line
            ref={makeRef(unitLines, index)}
            points={[from, to]}
            stroke={palette.accent}
            lineWidth={8}
            lineCap={'round'}
            end={0}
          />
        ))}
        <Circle
          ref={centerDot}
          x={0}
          y={0}
          size={9}
          fill={palette.focus}
          scale={0}
        />
      </Node>,
    );

    if (boundLabel) {
      view.add(
        <Latex
          ref={bound}
          x={430}
          y={-170}
          tex={boundLabel}
          fill={palette.ink}
          fontSize={42}
          offsetX={-1}
          opacity={0}
        />,
      );
    }

    yield* all(
      sequence(
        0.015,
        ...gridLines.map(line =>
          all(
            line.opacity(1, 0.25, easeOutCubic),
            line.end(1, 0.75, easeInOutCubic),
          ),
        ),
      ),
      sequence(
        0.004,
        ...dotOrder.map(index => dots[index].scale(1, 0.24, easeOutCubic)),
      ),
    );

    yield* waitFor(0.2);

    yield* all(
      centerDot().scale(1, 0.22, easeOutCubic),
      sequence(
        0.08,
        ...unitLines.map(line => line.end(1, 0.45, easeInOutCubic)),
      ),
    );

    if (boundLabel) {
      yield* bound().opacity(1, 0.35, easeOutCubic);
    }

    yield* waitFor(0.15);
    yield* all(
      centerDot().scale(1.35, 0.18, easeOutCubic),
      ...unitLines.map(line => line.lineWidth(10, 0.18, easeOutCubic)),
    );
    yield* all(
      centerDot().scale(1, 0.22, easeInOutCubic),
      ...unitLines.map(line => line.lineWidth(8, 0.22, easeInOutCubic)),
    );

    yield* waitFor(1.2);
}
