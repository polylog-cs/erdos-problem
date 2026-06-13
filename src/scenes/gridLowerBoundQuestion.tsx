import {Img, Line, Node} from '@motion-canvas/2d';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import erdosPhoto from '../assets/images/people/erdos2.jpg';
import {
  createGrowthAxisRefs,
  GrowthAxis,
  growthAxisTickX,
} from '../lib/unitDistanceGrowthAxis';
import {palette} from '../lib/palette';
import {
  createSquareGridVisualRefs,
  revealCardinalBuddies,
  revealSquareGrid,
  SquareGridVisual,
  type Point,
} from '../lib/unitDistanceGridVisual';
import {Solarized} from '../utilities/color';
import {PolyLatex} from '../utilities/latex';

const gridExtent = 4;
const gridStep = 54;
const gridSpan = gridExtent * 2 * gridStep;
const axisY = 188;
const linearExampleX = -430;
const quadraticExampleX = 430;
const exponentLabelY = axisY - 112;

function exponentX(exponent: number) {
  const t = exponent - 1;

  return (
    growthAxisTickX.linear +
    t * (growthAxisTickX.quadratic - growthAxisTickX.linear)
  );
}

function scatterPoint(index: number, total: number): Point {
  const angle = index * 2.399963229728653;
  const radius = 80 + 250 * Math.sqrt((index + 0.5) / total);

  return [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.72,
  ];
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const grid = createSquareGridVisualRefs();
  const gridStage = createRef<Node>();
  const braceGroup = createRef<Node>();
  const countLabel = createRef<PolyLatex>();
  const countPointer = createRef<Node>();
  const comparisonAxis = createGrowthAxisRefs();
  const exponentQuestion = createRef<Node>();
  const exponentDigit = createRef<PolyLatex>();
  const erdosStage = createRef<Node>();
  const impossibleSegment = createRef<Line>();
  const impossibleLabel = createRef<PolyLatex>();
  const tinyExponent = createRef<PolyLatex>();
  const braceLines: Line[] = [];

  view.add(
    <>
      <Node ref={gridStage} y={-28}>
        <SquareGridVisual
          refs={grid}
          extent={gridExtent}
          step={gridStep}
          dotSize={13}
          centerSize={12}
          buddyLineWidth={9}
          showBuddyLabels
        />
        <Node ref={braceGroup} opacity={0}>
          <Line
            ref={makeRef(braceLines, 0)}
            points={[
              [-gridSpan / 2, -gridSpan / 2 - 46],
              [-gridSpan / 2, -gridSpan / 2 - 68],
              [gridSpan / 2, -gridSpan / 2 - 68],
              [gridSpan / 2, -gridSpan / 2 - 46],
            ]}
            stroke={Solarized.base00}
            lineWidth={5}
            lineCap={'round'}
            lineJoin={'round'}
            end={0}
          />
          <Line
            ref={makeRef(braceLines, 1)}
            points={[
              [-gridSpan / 2 - 46, -gridSpan / 2],
              [-gridSpan / 2 - 68, -gridSpan / 2],
              [-gridSpan / 2 - 68, gridSpan / 2],
              [-gridSpan / 2 - 46, gridSpan / 2],
            ]}
            stroke={Solarized.base00}
            lineWidth={5}
            lineCap={'round'}
            lineJoin={'round'}
            end={0}
          />
          <PolyLatex
            tex={'\\sqrt n'}
            y={-gridSpan / 2 - 116}
            fontSize={52}
            fill={palette.ink}
          />
          <PolyLatex
            tex={'\\sqrt n'}
            x={-gridSpan / 2 - 128}
            fontSize={52}
            fill={palette.ink}
          />
        </Node>
      </Node>

      <PolyLatex
        ref={countLabel}
        tex={'2n\\text{ pairs}'}
        x={growthAxisTickX.linear}
        y={-24}
        fontSize={56}
        fill={palette.ink}
        opacity={0}
      />
      <Node ref={countPointer} x={growthAxisTickX.linear} y={axisY} opacity={0}>
        <Line
          points={[
            [0, -112],
            [0, -34],
          ]}
          stroke={palette.accent}
          lineWidth={4}
          lineCap={'round'}
        />
        <Line
          points={[
            [-14, -34],
            [14, -34],
            [0, -9],
          ]}
          fill={palette.accent}
          lineWidth={0}
          closed
          lineJoin={'round'}
        />
      </Node>

      <GrowthAxis
        refs={comparisonAxis}
        ticks={['linear', 'quadratic']}
        y={axisY}
        opacity={0}
        labelFontSize={84}
        labelOffset={88}
        initialVisibleLabels={['linear', 'quadratic']}
        visibleLabelOpacity={0.95}
      />

      <Node ref={exponentQuestion} x={exponentX(1.5)} y={exponentLabelY} opacity={0}>
        <PolyLatex tex={'n'} x={-164} y={13} fontSize={86} fill={palette.ink} />
        <PolyLatex tex={'1.'} x={-101} y={-32} fontSize={46} fill={palette.ink} />
        <PolyLatex
          ref={exponentDigit}
          tex={'5'}
          x={-61}
          y={-32}
          fontSize={46}
          fill={palette.ink}
        />
        <PolyLatex
          tex={'\\text{-ish pairs?}'}
          x={119}
          y={13}
          fontSize={72}
          fill={palette.ink}
        />
      </Node>

      <Node ref={erdosStage} opacity={0}>
        <Img
          src={erdosPhoto}
          x={405}
          y={-205}
          width={330}
          height={365}
          radius={10}
        />
      </Node>
      <Line
        ref={impossibleSegment}
        points={[
          [exponentX(1.00001), axisY],
          [growthAxisTickX.quadratic, axisY],
        ]}
        stroke={Solarized.red}
        lineWidth={13}
        lineCap={'round'}
        opacity={0}
        end={0}
      />
      <PolyLatex
        ref={impossibleLabel}
        tex={'\\mathrm{probably\\ impossible}'}
        x={150}
        y={axisY - 74}
        fontSize={54}
        fill={Solarized.red}
        opacity={0}
      />
      <PolyLatex
        ref={tinyExponent}
        tex={'n^{1.00001}\\text{ pairs}'}
        x={-270}
        y={axisY - 150}
        fontSize={64}
        fill={palette.ink}
        opacity={0}
      />
    </>,
  );

  yield* revealSquareGrid(grid);
  yield* all(
    braceGroup().opacity(1, 0.25, easeOutCubic),
    sequence(0.08, ...braceLines.map((line) => line.end(1, 0.45, easeInOutCubic))),
  );
  yield* waitFor(0.35);

  yield* revealCardinalBuddies(grid, {labels: true});
  yield* waitFor(0.65);

  yield* all(
    gridStage().position([linearExampleX, -202], 0.75, easeInOutCubic),
    gridStage().scale(0.42, 0.75, easeInOutCubic),
    braceGroup().opacity(0, 0.35, easeInOutCubic),
    ...grid.buddyLabels.map((label) => label.opacity(0, 0.35, easeInOutCubic)),
  );
  yield* countLabel().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(0.55);

  yield* all(
    comparisonAxis.root().opacity(1, 0.25, easeOutCubic),
    comparisonAxis.axis().end(1, 0.65, easeInOutCubic),
    countPointer().opacity(1, 0.25, easeOutCubic),
    ...(['linear', 'quadratic'] as const).map((tick) =>
      all(
        comparisonAxis.ticks[tick]().opacity(1, 0.25, easeOutCubic),
        comparisonAxis.ticks[tick]().scale(1, 0.25, easeOutCubic),
      ),
    ),
  );
  yield* waitFor(0.35);

  yield* all(
    gridStage().opacity(0, 0.45, easeInOutCubic),
    countLabel().x(growthAxisTickX.quadratic, 0.95, easeInOutCubic),
    countPointer().x(growthAxisTickX.quadratic, 0.95, easeInOutCubic),
    countLabel().tex('n^2\\text{-ish pairs?}', 0.55),
  );
  yield* waitFor(0.45);

  yield* all(
    countLabel().opacity(0, 0.35, easeInOutCubic),
    countPointer().opacity(0, 0.25, easeInOutCubic),
    exponentQuestion().opacity(1, 0.45, easeOutCubic),
  );

  yield* all(
    exponentQuestion().x(exponentX(1.4), 0.55, easeInOutCubic),
    exponentDigit().tex('4', 0.32),
  );
  yield* all(
    exponentQuestion().x(exponentX(1.2), 0.55, easeInOutCubic),
    exponentDigit().tex('2', 0.32),
  );
  yield* all(
    exponentQuestion().x(exponentX(1.1), 0.55, easeInOutCubic),
    exponentDigit().tex('1', 0.32),
  );
  yield* waitFor(0.35);

  yield* all(
    exponentQuestion().opacity(0, 0.35, easeInOutCubic),
    erdosStage().opacity(1, 0.45, easeOutCubic),
  );
  yield* waitFor(0.15);

  yield* all(
    erdosStage().x(-180, 2.7, linear),
    delay(0.2, impossibleSegment().opacity(1, 0.25, easeOutCubic)),
    delay(0.25, impossibleSegment().end(1, 1.8, easeInOutCubic)),
    delay(0.9, impossibleLabel().opacity(1, 0.45, easeOutCubic)),
    delay(1.55, tinyExponent().opacity(1, 0.45, easeOutCubic)),
  );
  yield* waitFor(1.0);
});
