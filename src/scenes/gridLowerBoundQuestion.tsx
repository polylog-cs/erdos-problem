import {Img, Line, Node} from '@motion-canvas/2d';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  createSignal,
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
  revealSquareGrid,
  SquareGridVisual,
} from '../lib/unitDistanceGridVisual';
import {Solarized} from '../utilities/color';
import {PolyLatex} from '../utilities/latex';
import {PolyTxt} from '../utilities/text';

const gridExtent = 4;
const gridStep = 54;
const gridSpan = gridExtent * 2 * gridStep;
const axisY = 188;
const sceneLayoutX = -240;
const sceneLayoutScale = 0.88;
const linearExampleX = -430;
const insanePointsetX = growthAxisTickX.quadratic;
const insanePointsetY = -202;
const insanePointsetScale = 0.47;
const sweepStartExponent = 2;
const sweepLeftExponent = 1.18;
const sweepRightExponent = 1.68;
const preImpossibleExponent = 1.01;
const impossibleExponent = 1.00001;
const erdosUpperBoundExponent = 1.5;
const impossibleZeroCountStart = 1;
const impossibleZeroCountEnd = 8;
const impossibleDescentDuration = 9.5;
const impossibleRegularExponentDuration = impossibleDescentDuration / 2;
const impossibleTinyExponentDuration =
  impossibleDescentDuration - impossibleRegularExponentDuration;
const cardinalNarrationOrder = ['N', 'W', 'E', 'S'] as const;
const cardinalBuddyIndex = {N: 0, E: 1, W: 2, S: 3};
type Point = [number, number];

const insanePointRings = [
  {count: 1, radius: 0, phase: 0},
  {count: 12, radius: 72, phase: 0.08},
  {count: 20, radius: 132, phase: 0.22},
  {count: 24, radius: 196, phase: 0.04},
  {count: 24, radius: 260, phase: 0.16},
];

function createInsanePointset(): Point[] {
  return insanePointRings.flatMap(({count, radius, phase}, ringIndex) =>
    Array.from({length: count}, (_, index) => {
      if (radius === 0) {
        return [0, 0] as Point;
      }

      const angle = phase + (index * Math.PI * 2) / count;
      const ripple = 1 + 0.04 * Math.sin(index * 1.91 + ringIndex * 0.73);

      return [
        Math.cos(angle) * radius * ripple + Math.cos(angle * 3) * 10,
        Math.sin(angle) * radius * ripple * 0.9 + Math.sin(angle * 2) * 8,
      ] as Point;
    }),
  );
}

function createInsanePairEdges(points: Point[]) {
  const targetLengths = [72, 118, 150];
  const candidates: Array<{from: number; to: number; score: number}> = [];

  for (let from = 0; from < points.length; from++) {
    for (let to = from + 1; to < points.length; to++) {
      const distance = Math.hypot(
        points[from][0] - points[to][0],
        points[from][1] - points[to][1],
      );
      const score = Math.min(
        ...targetLengths.map((target) => Math.abs(distance - target)),
      );

      if (score < 8) {
        candidates.push({from, to, score});
      }
    }
  }

  const degrees = Array.from({length: points.length}, () => 0);
  const edges: Array<[number, number]> = [];

  for (const {from, to} of candidates.sort((a, b) => a.score - b.score)) {
    if (degrees[from] >= 7 || degrees[to] >= 7) {
      continue;
    }

    degrees[from]++;
    degrees[to]++;
    edges.push([from, to]);

    if (edges.length >= 190) {
      break;
    }
  }

  return edges;
}

const insanePointset = createInsanePointset();
const insanePairEdges = createInsanePairEdges(insanePointset);

function exponentX(exponent: number) {
  const t = exponent - 1;

  return (
    growthAxisTickX.linear +
    t * (growthAxisTickX.quadratic - growthAxisTickX.linear)
  );
}

function formatExponent(exponent: number) {
  if (exponent > 1.95) {
    return '2';
  }

  return exponent.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
}

function impossibleExponentText(zeroCount: number) {
  return `1.${'0'.repeat(Math.max(0, Math.round(zeroCount)))}1`;
}

function exponentText(
  exponent: number,
  impossibleMode: number,
  zeroCount: number,
) {
  if (impossibleMode > 0.5) {
    return impossibleExponentText(zeroCount);
  }

  return formatExponent(exponent);
}

function suffixX(exponentString: string) {
  return 78 + Math.max(0, exponentString.length - 1) * 16;
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const grid = createSquareGridVisualRefs();
  const pointsetX = createSignal(0);
  const sweepX = createSignal(growthAxisTickX.linear);
  const sweepExponent = createSignal(1);
  const impossibleMode = createSignal(0);
  const impossibleZeroCount = createSignal(impossibleZeroCountStart);
  const gridStage = createRef<Node>();
  const braceGroup = createRef<Node>();
  const countLabel = createRef<PolyLatex>();
  const countPointer = createRef<Node>();
  const movingCountLabel = createRef<Node>();
  const comparisonAxis = createGrowthAxisRefs();
  const erdosStage = createRef<Node>();
  const impossibleSegment = createRef<Line>();
  const impossibleLabel = createRef<PolyLatex>();
  const braceLines: Line[] = [];
  const insaneLayer = createRef<Node>();
  const insaneLines: Line[] = [];
  const movingExponentText = () =>
    exponentText(sweepExponent(), impossibleMode(), impossibleZeroCount());
  function* animateImpossibleExponent() {
    yield* sweepExponent(
      preImpossibleExponent,
      impossibleRegularExponentDuration,
      easeInOutCubic,
    );

    impossibleMode(1);
    impossibleZeroCount(impossibleZeroCountStart);

    yield* all(
      sweepExponent(impossibleExponent, impossibleTinyExponentDuration, linear),
      impossibleZeroCount(
        impossibleZeroCountEnd,
        impossibleTinyExponentDuration,
        linear,
      ),
    );
  }
  function* revealCardinalBuddiesInNarrationOrder() {
    yield* all(
      grid.centerDot().scale(1, 0.22, easeOutCubic),
      sequence(
        0.78,
        ...cardinalNarrationOrder.map((name) => {
          const index = cardinalBuddyIndex[name];

          return all(
            grid.buddyLines[index].end(1, 0.42, easeInOutCubic),
            delay(
              0.18,
              all(
                grid.buddyLabels[index].opacity(1, 0.22, easeOutCubic),
                grid.buddyLabels[index].scale(1, 0.24, easeOutCubic),
              ),
            ),
          );
        }),
      ),
    );
  }

  view.add(
    <Node x={sceneLayoutX} scale={sceneLayoutScale}>
      <Node ref={gridStage} x={() => pointsetX()} y={-28}>
        <Node ref={insaneLayer} opacity={0}>
          {insanePairEdges.map(([from, to], index) => (
            <Line
              ref={makeRef(insaneLines, index)}
              points={() => [
                grid.dots[from]?.position() ?? insanePointset[from],
                grid.dots[to]?.position() ?? insanePointset[to],
              ]}
              stroke={palette.accent}
              lineWidth={7}
              lineCap={'round'}
              opacity={0.26}
              end={0}
            />
          ))}
        </Node>
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
      <Node ref={countPointer} x={() => sweepX()} y={axisY} opacity={0}>
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

      <Node ref={movingCountLabel} x={() => sweepX()} y={-24} opacity={0}>
        <PolyLatex tex={'n'} x={-141} y={13} fontSize={70} fill={palette.ink} />
        <PolyTxt
          text={movingExponentText}
          x={-94}
          y={-35}
          fontSize={34}
          fill={palette.ink}
          offsetX={-1}
        />
        <PolyLatex
          tex={'\\text{-ish pairs?}'}
          x={() => suffixX(movingExponentText())}
          y={13}
          fontSize={56}
          fill={palette.ink}
        />
      </Node>

      <Node
        ref={erdosStage}
        x={() => pointsetX()}
        y={-250}
        opacity={0}
      >
        <Img
          src={erdosPhoto}
          width={292}
          height={322}
          radius={10}
        />
      </Node>
      <Line
        ref={impossibleSegment}
        points={() => [
          [sweepX(), axisY],
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
        x={() => (sweepX() + growthAxisTickX.quadratic) / 2}
        y={axisY - 74}
        fontSize={54}
        fill={Solarized.red}
        opacity={0}
      />
    </Node>,
  );

  yield* revealSquareGrid(grid);
  yield* waitFor(7);

  yield* all(
    braceGroup().opacity(1, 0.25, easeOutCubic),
    sequence(0.08, ...braceLines.map((line) => line.end(1, 0.45, easeInOutCubic))),
  );
  yield* waitFor(4.5);

  yield* revealCardinalBuddiesInNarrationOrder();
  yield* waitFor(4);

  yield* all(
    pointsetX(linearExampleX, 0.75, easeInOutCubic),
    gridStage().y(-202, 0.75, easeInOutCubic),
    gridStage().scale(0.42, 0.75, easeInOutCubic),
    ...grid.gridLines.map((line) =>
      line.stroke(palette.accent, 0.45, easeInOutCubic),
    ),
    braceGroup().opacity(0, 0.35, easeInOutCubic),
    ...grid.buddyLabels.map((label) => label.opacity(0, 0.35, easeInOutCubic)),
  );
  yield* countLabel().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(3);

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
  yield* waitFor(3);

  yield* all(
    pointsetX(insanePointsetX, 0.95, easeInOutCubic),
    sweepX(insanePointsetX, 0.95, easeInOutCubic),
    sweepExponent(sweepStartExponent, 0.95, easeInOutCubic),
    gridStage().y(insanePointsetY, 0.95, easeInOutCubic),
    gridStage().scale(insanePointsetScale, 0.95, easeInOutCubic),
    ...grid.gridLines.map((line) => line.opacity(0, 0.38, easeInOutCubic)),
    ...grid.buddyLines.map((line) => line.opacity(0, 0.25, easeInOutCubic)),
    grid.centerDot().opacity(0, 0.25, easeInOutCubic),
    ...grid.dots.map((dot, index) =>
      all(
        dot.position(insanePointset[index], 0.95, easeInOutCubic),
        dot.scale(0.82, 0.45, easeInOutCubic),
      ),
    ),
    delay(0.15, insaneLayer().opacity(1, 0.45, easeOutCubic)),
    delay(
      0.2,
      all(...insaneLines.map((line) => line.end(1, 0.65, easeInOutCubic))),
    ),
    countLabel().opacity(0, 0.28, easeInOutCubic),
    movingCountLabel().opacity(1, 0.3, easeOutCubic),
  );
  yield* waitFor(3.5);

  yield* all(
    pointsetX(exponentX(sweepLeftExponent), 1.05, easeInOutCubic),
    sweepX(exponentX(sweepLeftExponent), 1.05, easeInOutCubic),
    sweepExponent(sweepLeftExponent, 1.05, easeInOutCubic),
  );
  yield* waitFor(2.5);

  yield* all(
    pointsetX(exponentX(sweepRightExponent), 1.05, easeInOutCubic),
    sweepX(exponentX(sweepRightExponent), 1.05, easeInOutCubic),
    sweepExponent(sweepRightExponent, 1.05, easeInOutCubic),
  );
  yield* waitFor(1.5);

  yield* all(
    gridStage().opacity(0, 0.35, easeInOutCubic),
    erdosStage().opacity(1, 0.45, easeOutCubic),
  );
  yield* waitFor(3);

  yield* all(
    pointsetX(exponentX(impossibleExponent), impossibleDescentDuration, easeInOutCubic),
    sweepX(exponentX(impossibleExponent), impossibleDescentDuration, easeInOutCubic),
    animateImpossibleExponent(),
    delay(
      impossibleRegularExponentDuration + 0.1,
      impossibleSegment().opacity(1, 0.25, easeOutCubic),
    ),
    delay(
      impossibleRegularExponentDuration + 0.1,
      impossibleSegment().end(1, 0.45, easeInOutCubic),
    ),
    delay(
      impossibleRegularExponentDuration + 0.18,
      impossibleLabel().opacity(1, 0.45, easeOutCubic),
    ),
  );

  yield* waitFor(9);

  yield* all(
    impossibleLabel().opacity(0, 0.25, easeInOutCubic),
    impossibleSegment().opacity(0, 0.25, easeInOutCubic),
  );
  impossibleMode(0);
  impossibleLabel().tex('\\mathrm{impossible}');

  yield* all(
    pointsetX(growthAxisTickX.quadratic, 0.85, easeInOutCubic),
    sweepX(growthAxisTickX.quadratic, 0.85, easeInOutCubic),
    sweepExponent(sweepStartExponent, 0.85, easeInOutCubic),
  );
  yield* waitFor(0.5);

  yield* all(
    pointsetX(exponentX(erdosUpperBoundExponent), 1.6, easeInOutCubic),
    sweepX(exponentX(erdosUpperBoundExponent), 1.6, easeInOutCubic),
    sweepExponent(erdosUpperBoundExponent, 1.6, easeInOutCubic),
    delay(0.08, impossibleSegment().opacity(1, 0.25, easeOutCubic)),
    delay(0.62, impossibleLabel().opacity(1, 0.35, easeOutCubic)),
  );

  yield* waitFor(2.8);
});
