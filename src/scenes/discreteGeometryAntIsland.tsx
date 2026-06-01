import { Circle, Img, Line, Node, Rect } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import { PolyLatex } from '../utilities/latex';

const imagePath = '/reference/island/latest-download-island.png';
const gridIconLines: Array<Array<[number, number]>> = [
  [
    [-32, -32],
    [0, -32],
    [32, -32],
  ],
  [
    [-32, 0],
    [0, 0],
    [32, 0],
  ],
  [
    [-32, 32],
    [0, 32],
    [32, 32],
  ],
  [
    [-32, -32],
    [-32, 0],
    [-32, 32],
  ],
  [
    [0, -32],
    [0, 0],
    [0, 32],
  ],
  [
    [32, -32],
    [32, 0],
    [32, 32],
  ],
];

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const photo = createRef<Img>();
  const island = createRef<Node>();
  const islandGlow = createRef<Circle>();
  const islandOutline = createRef<Line>();
  const leftLabel = createRef<PolyLatex>();
  const leftSub = createRef<PolyLatex>();
  const rightLabel = createRef<PolyLatex>();
  const rightSub = createRef<PolyLatex>();
  const leftArrow = createRef<Line>();
  const rightArrow = createRef<Line>();
  const gridIcon = createRef<Node>();
  const gridDots: Circle[] = [];
  const gridLines: Line[] = [];

  view.add(
    <>
      <Img ref={photo} src={imagePath} height={1080} opacity={0} scale={1.025} />

      <Node ref={island} x={18} y={158} opacity={0}>
        <Circle
          ref={islandGlow}
          size={185}
          fill={'rgba(240, 138, 22, 0.15)'}
          stroke={palette.accent}
          lineWidth={4}
          scale={0.7}
        />
        <Line
          ref={islandOutline}
          points={[
            [-78, -12],
            [-42, -50],
            [20, -55],
            [78, -20],
            [70, 34],
            [18, 60],
            [-54, 44],
            [-78, -12],
          ]}
          stroke={palette.focus}
          lineWidth={7}
          lineCap={'round'}
          lineJoin={'round'}
          end={0}
        />
      </Node>

      <PolyLatex
        ref={leftLabel}
        x={-850}
        y={-310}
        tex={'\\mathrm{discrete\\ geometry}'}
        fill={palette.ink}
        fontSize={40}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={leftSub}
        x={-850}
        y={-246}
        tex={'\\#\\mathrm{unit\\ distances}'}
        fill={palette.mutedInk}
        fontSize={31}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={rightLabel}
        x={420}
        y={-310}
        tex={'\\mathrm{algebraic\\ number\\ theory}'}
        fill={palette.ink}
        fontSize={39}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={rightSub}
        x={420}
        y={-246}
        tex={'\\mathbb{Z}[i],\\quad p\\equiv1\\pmod4'}
        fill={palette.mutedInk}
        fontSize={31}
        offsetX={-1}
        opacity={0}
      />

      <Line
        ref={leftArrow}
        points={[
          [-704, -214],
          [-318, -100],
          [-65, 118],
        ]}
        stroke={palette.accentDark}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />
      <Line
        ref={rightArrow}
        points={[
          [520, -214],
          [346, -104],
          [88, 126],
        ]}
        stroke={palette.focus}
        lineWidth={5}
        lineCap={'round'}
        end={0}
        opacity={0}
      />

      <Node ref={gridIcon} x={-795} y={-142} opacity={0}>
        {[-1, 0, 1].flatMap((x, column) =>
          [-1, 0, 1].map((y, row) => (
            <Circle
              ref={makeRef(gridDots, column * 3 + row)}
              x={x * 32}
              y={y * 32}
              size={9}
              fill={palette.ink}
              scale={0}
            />
          )),
        )}
        {gridIconLines.map((points, index) => (
          <Line
            ref={makeRef(gridLines, index)}
            points={points}
            stroke={palette.accentDark}
            lineWidth={3}
            lineCap={'round'}
            end={0}
          />
        ))}
      </Node>
    </>,
  );

  yield* photo().opacity(1, 0.65, easeOutCubic);
  yield* waitFor(0.35);

  yield* all(
    island().opacity(1, 0.25, easeOutCubic),
    islandGlow().scale(1, 0.35, easeOutCubic),
    islandOutline().end(1, 0.75, easeInOutCubic),
  );
  yield* waitFor(0.25);

  yield* all(
    leftLabel().opacity(1, 0.35, easeOutCubic),
    leftSub().opacity(1, 0.35, easeOutCubic),
    leftArrow().opacity(1, 0.18, easeOutCubic),
    leftArrow().end(1, 0.65, easeInOutCubic),
    gridIcon().opacity(1, 0.24, easeOutCubic),
    sequence(0.035, ...gridLines.map((line) => line.end(1, 0.24, easeOutCubic))),
    sequence(0.025, ...gridDots.map((dot) => dot.scale(1, 0.2, easeOutCubic))),
  );

  yield* waitFor(0.2);

  yield* all(
    rightLabel().opacity(1, 0.35, easeOutCubic),
    rightSub().opacity(1, 0.35, easeOutCubic),
    rightArrow().opacity(1, 0.18, easeOutCubic),
    rightArrow().end(1, 0.65, easeInOutCubic),
  );

  yield* all(
    islandGlow().scale(1.08, 0.35, easeInOutCubic),
    islandGlow().fill('rgba(240, 138, 22, 0.23)', 0.35, easeInOutCubic),
  );
  yield* all(
    islandGlow().scale(1, 0.35, easeInOutCubic),
    islandGlow().fill('rgba(240, 138, 22, 0.15)', 0.35, easeInOutCubic),
  );

  yield* waitFor(1.35);
});
