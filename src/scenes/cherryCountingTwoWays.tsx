import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  Color,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  Vector2,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';
import { PolyTxt } from '../utilities/text';

type PointName =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topLeftLeaf'
  | 'topRightLeaf'
  | 'rightLeaf'
  | 'bottomRightLeaf'
  | 'bottomLeftLeaf'
  | 'leftLeaf';
type Point = [number, number];

const pointNames: PointName[] = [
  'top',
  'right',
  'bottom',
  'left',
  'topLeftLeaf',
  'topRightLeaf',
  'rightLeaf',
  'bottomRightLeaf',
  'bottomLeftLeaf',
  'leftLeaf',
];

const points: Record<PointName, Point> = {
  top: [0, -155],
  right: [190, 0],
  bottom: [0, 155],
  left: [-190, 0],
  topLeftLeaf: [-220, -245],
  topRightLeaf: [220, -245],
  rightLeaf: [410, -100],
  bottomRightLeaf: [220, 245],
  bottomLeftLeaf: [-220, 245],
  leftLeaf: [-410, -100],
};

const baseEdges: [PointName, PointName][] = [
  ['left', 'top'],
  ['top', 'right'],
  ['right', 'bottom'],
  ['bottom', 'left'],
  ['top', 'topLeftLeaf'],
  ['top', 'topRightLeaf'],
  ['right', 'rightLeaf'],
  ['bottom', 'bottomRightLeaf'],
  ['bottom', 'bottomLeftLeaf'],
  ['left', 'leftLeaf'],
  ['left', 'topLeftLeaf'],
  ['right', 'topRightLeaf'],
  ['right', 'bottomRightLeaf'],
  ['left', 'bottomLeftLeaf'],
  ['leftLeaf', 'topLeftLeaf'],
  ['rightLeaf', 'topRightLeaf'],
];

const firstCherryEdges: [PointName, PointName][] = [
  ['left', 'top'],
  ['top', 'right'],
];

const secondCherryEdges: [PointName, PointName][] = [
  ['left', 'bottom'],
  ['bottom', 'right'],
];

type CenterCherryStep = {
  moving: number;
  fixed: number;
  movingRotation: number;
  fixedRotation: number;
};

const centerStarAngles = [-162, -126, -90, -54, -18, 18, 54, 90, 126, 162];
const centerStarStep = 36;
const centerStarFixedStart = 2;
const centerStarClockTurns = 9;
const centerStarFastStepDuration = 0.14;
const centerStarFastStepHold = 0.11;
const centerStarWrapStepDuration = 0.46;

const samplePairs: [PointName, PointName][] = [
  ['topLeftLeaf', 'rightLeaf'],
  ['leftLeaf', 'bottomRightLeaf'],
  ['topRightLeaf', 'bottomLeftLeaf'],
  ['top', 'rightLeaf'],
  ['leftLeaf', 'topRightLeaf'],
  ['bottomLeftLeaf', 'right'],
  ['left', 'right'],
];

const pointIndex = Object.fromEntries(
  pointNames.map((name, index) => [name, index]),
) as Record<PointName, number>;

const red = Solarized.red;
const redDark = Solarized.red;
const redLight = new Color(Solarized.red).brighten(0.5);
const redShade = new Color(Solarized.red).darken(0.45);
const green = Solarized.green;
const greenLight = new Color(Solarized.green).brighten(0.5);
const brown = Solarized.base02;
const centerStemLength = 245;

const EDGE_WIDTH = 10;
const POINT_SIZE = 30;
const GRAPH_POSITION: Point = [-450, 15];
const CENTER_STAR_GRAPH_POSITION: Point = [-450, 115];
const LOCAL_CHERRY_APPROX =
  '\\#\\text{cherries around }u\\approx\\#\\mathrm{buddies}(u)^2';
const LOCAL_CHERRY_BINOMIAL =
  '\\#\\text{cherries around }u=\\binom{\\#\\mathrm{buddies}(u)}{2}';
const SUM_CHERRY_FORMULA =
  '\\#\\mathrm{cherries}\\approx\\sum_u\\#\\mathrm{buddies}(u)^2\\ge n\\left({2m\\over n}\\right)^2={2m^2\\over n}';
const LOWER_BOUND_TEX = '\\#\\mathrm{cherries}\\ge{2m^2\\over n}';

function xy(name: PointName) {
  return new Vector2(points[name][0], points[name][1]);
}

function pointFromAngle(angle: number, radius = centerStemLength): Point {
  const radians = (angle * Math.PI) / 180;

  return [
    points.top[0] + Math.cos(radians) * radius,
    points.top[1] + Math.sin(radians) * radius,
  ];
}

function clockCherrySteps(): CenterCherryStep[] {
  const count = centerStarAngles.length;
  const steps: CenterCherryStep[] = [];
  const fixedStartRotation = centerStarAngles[centerStarFixedStart];

  for (let tick = 0; tick <= centerStarClockTurns; tick++) {
    const fixed = (centerStarFixedStart + tick) % count;

    steps.push({
      moving: (fixed + 1) % count,
      fixed,
      fixedRotation: fixedStartRotation + tick * centerStarStep,
      movingRotation:
        fixedStartRotation + centerStarStep + tick * (360 + centerStarStep),
    });
  }

  return steps;
}

const centerStarCherrySteps = clockCherrySteps();
const initialCenterStarStep = centerStarCherrySteps[0];

function shinePoint(name: PointName): Point {
  return [points[name][0] - 11, points[name][1] - 13];
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const graph = createRef<Node>();
  const flatGraph = createRef<Node>();
  const baseLines: Line[] = [];
  const baseDots: Circle[] = [];
  const firstLines: Line[] = [];
  const firstLineLabels: PolyTxt[] = [];
  const secondLines: Line[] = [];
  const cherryBalls: Circle[] = [];
  const cherryShines: Circle[] = [];
  const intersectionArrows: Line[] = [];
  const centers: Circle[] = [];
  const starLines: Line[] = [];
  const starDots: Circle[] = [];
  const rotatingCherry = createRef<Node>();
  const rotatingCherryStems: Node[] = [];
  const upperBound = createRef<PolyLatex>();
  const centerFormula = createRef<PolyLatex>();
  const uLabel = createRef<PolyLatex>();
  const cherryLabel = createRef<PolyTxt>();
  const cherryArrow = createRef<Line>();
  const sumFormula = createRef<PolyLatex>();
  const lowerBoundFormula = createRef<PolyLatex>();
  const combinedFormula = createRef<PolyLatex>();
  const cherryCircles: Circle[] = [];

  view.add(
    <Node ref={graph} x={GRAPH_POSITION[0]} y={GRAPH_POSITION[1]} scale={0.78}>
      <Node ref={flatGraph}>
        {baseEdges.map(([from, to], index) => (
          <Line
            ref={makeRef(baseLines, index)}
            points={[xy(from), xy(to)]}
            stroke={palette.edge}
            lineWidth={EDGE_WIDTH}
            lineCap={'round'}
            end={0}
            opacity={0.5}
          />
        ))}
        {pointNames.map((name, index) => (
          <Circle
            ref={makeRef(baseDots, index)}
            x={points[name][0]}
            y={points[name][1]}
            size={POINT_SIZE}
            fill={palette.node}
            scale={0}
            opacity={1}
          />
        ))}
        {firstCherryEdges.map(([from, to], index) => (
          <Line
            ref={makeRef(firstLines, index)}
            points={[xy(from), xy(to)]}
            stroke={green}
            lineWidth={10}
            lineCap={'round'}
            end={0}
            opacity={0}
          >
            <PolyLatex
              ref={makeRef(firstLineLabels, index)}
              tex="1"
              position={xy(from)
                .add(xy(to))
                .div(2)
                .add(xy(from).sub(xy(to)).perpendicular.normalized.mul(-50))}
              fill={green}
              opacity={0}
              fontSize={80}
            />
          </Line>
        ))}
        {secondCherryEdges.map(([from, to], index) => (
          <Line
            ref={makeRef(secondLines, index)}
            points={[xy(from), xy(to)]}
            stroke={greenLight}
            lineWidth={14}
            lineCap={'round'}
            end={0}
            opacity={0}
          />
        ))}
        {centerStarAngles.map((angle, index) => (
          <Line
            ref={makeRef(starLines, index)}
            points={[points.top, pointFromAngle(angle)]}
            stroke={green}
            lineWidth={7}
            lineCap={'round'}
            end={0}
            opacity={0}
          />
        ))}
        {centerStarAngles.map((angle, index) => {
          const [x, y] = pointFromAngle(angle);

          return (
            <Circle
              ref={makeRef(starDots, index)}
              x={x}
              y={y}
              size={24}
              fill={brown}
              stroke={palette.background}
              lineWidth={3}
              scale={0}
              opacity={0}
            />
          );
        })}
        <Node ref={rotatingCherry} opacity={0}>
          {[0, 1].map((index) => (
            <Node
              ref={makeRef(rotatingCherryStems, index)}
              x={points.top[0]}
              y={points.top[1]}
              rotation={
                index === 0
                  ? initialCenterStarStep.movingRotation
                  : initialCenterStarStep.fixedRotation
              }
            >
              <Line
                points={[
                  [0, 0],
                  [centerStemLength, 0],
                ]}
                stroke={green}
                lineWidth={15}
                lineCap={'round'}
              />
              <Circle
                x={centerStemLength}
                size={120}
                fill={red}
                stroke={redDark}
                lineWidth={4}
              >
                <Circle
                  x={19}
                  y={22}
                  size={54}
                  fill={redShade}
                  opacity={0.2}
                />
                <Circle
                  x={-19}
                  y={-24}
                  size={22}
                  fill={redLight}
                  opacity={0.82}
                />
                <Circle
                  x={-10}
                  y={-33}
                  size={9}
                  fill={palette.background}
                  opacity={0.28}
                />
              </Circle>
            </Node>
          ))}
        </Node>
        {(['left', 'right'] as PointName[]).map((name, index) => (
          <Circle
            ref={makeRef(cherryBalls, index)}
            x={points[name][0]}
            y={points[name][1]}
            size={120}
            fill={red}
            stroke={redDark}
            lineWidth={4}
            scale={0}
          >
            <Circle
              x={19}
              y={22}
              size={54}
              fill={redShade}
              opacity={0.2}
            />
            <Circle
              ref={makeRef(cherryShines, index)}
              x={-19}
              y={-24}
              size={22}
              fill={redLight}
              opacity={0}
            />
            <Circle
              x={-10}
              y={-33}
              size={9}
              fill={palette.background}
              opacity={0.28}
            />
          </Circle>
        ))}
        {(['top', 'bottom'] as PointName[]).map((name, index) => (
          <Circle
            ref={makeRef(centers, index)}
            x={points[name][0]}
            y={points[name][1]}
            size={26}
            fill={brown}
            stroke={palette.background}
            lineWidth={4}
            scale={0}
          />
        ))}
        <PolyLatex
          ref={uLabel}
          x={points.top[0] + 24}
          y={points.top[1] - 40}
          tex={'u'}
          fill={brown}
          fontSize={44}
          opacity={0}
        />
      </Node>
      <Line
        ref={cherryArrow}
        points={[
          [340, -250],
          [86, -86],
        ]}
        stroke={redDark}
        lineWidth={5}
        lineCap={'round'}
        endArrow
        arrowSize={20}
        opacity={0}
        end={0}
      />
      <PolyTxt
        ref={cherryLabel}
        text={'cherry'}
        x={405}
        y={-275}
        fill={redDark}
        fontSize={54}
        fontWeight={700}
        opacity={0}
      />
      {[
        {
          from: [0, -285] as Point,
          to: [0, -185] as Point,
        },
        {
          from: [0, 285] as Point,
          to: [0, 185] as Point,
        },
      ].map(({ from, to }, index) => (
        <Line
          ref={makeRef(intersectionArrows, index)}
          points={[from, to]}
          stroke={redDark}
          lineWidth={5}
          lineCap={'round'}
          endArrow
          arrowSize={18}
          opacity={0}
          end={0}
        />
      ))}

      {(['left', 'right', 'top'] as PointName[]).map((name, index) => (
        <Circle
          ref={makeRef(cherryCircles, index)}
          position={xy(name)}
          stroke={brown}
          lineWidth={5}
          size={xy('left').sub(xy('top')).magnitude * 2}
          end={0}
        />
      ))}
    </Node>,
  );

  view.add(
    <PolyLatex
      ref={centerFormula}
      x={-760}
      y={278}
      tex={LOCAL_CHERRY_APPROX}
      fontSize={31}
      offsetX={-1}
      opacity={0}
    />,
  );

  view.add(
    <PolyLatex
      ref={sumFormula}
      x={-860}
      y={340}
      tex={SUM_CHERRY_FORMULA}
      fontSize={29}
      offsetX={-1}
      opacity={0}
    />,
  );

  view.add(
    <PolyLatex
      ref={lowerBoundFormula}
      x={-760}
      y={340}
      tex={LOWER_BOUND_TEX}
      fontSize={44}
      offsetX={-1}
      opacity={0}
    />,
  );

  view.add(
    <PolyLatex
      ref={combinedFormula}
      x={-585}
      y={200}
      tex={'\\Rightarrow\\;\\;\\;\\\\m\\le n^{1.5}'}
      fontSize={80}
      offsetX={-1}
      opacity={0}
    />,
  );

  view.add(
    <PolyLatex
      ref={upperBound}
      x={-780}
      y={-335}
      tex={'\\#\\mathrm{cherries}\\le 2n^2'}
      fontSize={54}
      offsetX={-1}
      opacity={0}
    />,
  );

  yield* all(
    sequence(
      0.04,
      ...pointNames.map((name) =>
        baseDots[pointIndex[name]].scale(1, 0.25, easeOutCubic),
      ),
    ),
    sequence(0.035, ...baseLines.map((line) => line.end(1, 0.45, easeInOutCubic))),
  );

  yield* waitFor(0.2);

  yield* all(
    sequence(
      0.08,
      ...firstLines.map((line) =>
        all(line.opacity(1, 0.1, easeOutCubic), line.end(1, 0.42, easeInOutCubic)),
      ),
    ),
    centers[0].scale(1, 0.28, easeOutCubic),
  );

  yield* waitFor(0.15);

  yield* all(
    ...cherryBalls.map((ball) => ball.scale(1, 0.45, easeOutCubic)),
    ...cherryShines.map((shine) => shine.opacity(0.68, 0.35, easeOutCubic)),
    ...firstLines.map((line) => line.lineWidth(14, 0.35, easeOutCubic)),
    centers[0].scale(1.18, 0.35, easeOutCubic),
  );

  yield* all(
    ...baseLines.map((line) => line.opacity(0, 0.35, easeInOutCubic)),
    ...baseDots.map((dot) => dot.opacity(0, 0.35, easeInOutCubic)),
    ...firstLineLabels.map((label) => label.opacity(1, 0.35, easeOutCubic)),
    cherryLabel().opacity(1, 0.35, easeOutCubic),
    all(cherryArrow().opacity(1, 0.35, easeOutCubic), cherryArrow().end(1, 0.35)),
  );

  yield* waitFor(2.6);

  yield* all(
    ...baseLines.map((line) => line.opacity(0.5, 0.45, easeInOutCubic)),
    ...baseDots.map((dot) => dot.opacity(1, 0.45, easeInOutCubic)),
    ...firstLineLabels.map((label) => label.opacity(0, 0.35, easeInOutCubic)),
    cherryLabel().opacity(0, 0.35, easeInOutCubic),
    all(cherryArrow().opacity(0, 0.35, easeInOutCubic), cherryArrow().end(0, 0.35)),
  );

  yield* waitFor(5.6);

  yield* all(
    ...firstLines.map((line) => line.opacity(0, 1)),
    centers[0].scale(0, 1),
    ...cherryBalls.map((cherry) => cherry.scale(0, 1)),
  );

  yield* waitFor(2.2);

  yield* all(...cherryBalls.map((cherry) => cherry.scale(1, 1)));

  yield* waitFor(0.8);

  yield* sequence(
    0.3,
    ...cherryCircles.slice(0, 2).map((circle) => circle.end(1, 1)),
  );

  yield* waitFor(0.7);

  /*
  for (const [leftName, rightName] of samplePairs) {
    yield* all(
      cherryBalls[0].position(points[leftName], 0.15, easeInOutCubic),
      cherryBalls[1].position(points[rightName], 0.15, easeInOutCubic),
      cherryShines[0].position(shinePoint(leftName), 0.15, easeInOutCubic),
      cherryShines[1].position(shinePoint(rightName), 0.15, easeInOutCubic),
    );
  }*/

  yield* all(
    all(
      intersectionArrows[0].opacity(1, 0.35, easeOutCubic),
      intersectionArrows[0].end(1, 0.35),
    ),
    centers[0].scale(1.18, 0.5, easeOutCubic),
    ...firstLines.map((line) => line.opacity(1, 0.8, easeOutCubic)),
  );

  yield* waitFor(1.4);

  yield* all(
    all(
      intersectionArrows[1].opacity(1, 0.35, easeOutCubic),
      intersectionArrows[1].end(1, 0.35),
    ),
    sequence(
      0,
      ...secondLines.map((line) =>
        all(line.opacity(1, 0.8, easeOutCubic), line.end(1, 0, easeInOutCubic)),
      ),
    ),
    centers[1].scale(1.18, 0.5, easeOutCubic),
  );

  /*
  yield* all(
    centers[0].scale(1.34, 0.2, easeOutCubic),
    centers[1].scale(1.34, 0.2, easeOutCubic),
    ...firstLines.map((line) => line.lineWidth(16, 0.2, easeOutCubic)),
    ...secondLines.map((line) => line.lineWidth(16, 0.2, easeOutCubic)),
  );
  yield* all(
    centers[0].scale(1.1, 0.28, easeInOutCubic),
    centers[1].scale(1.1, 0.28, easeInOutCubic),
    ...firstLines.map((line) => line.lineWidth(12, 0.28, easeInOutCubic)),
    ...secondLines.map((line) => line.lineWidth(12, 0.28, easeInOutCubic)),
  );*/

  yield* waitFor(1.2);

  yield* upperBound().opacity(1, 0.65, easeOutCubic);

  yield* waitFor(17);

  yield* all(
    ...cherryCircles.slice(0, 2).map((circle) => circle.opacity(0, 0.55)),
    ...baseLines.map((line) => line.opacity(0, 0.35, easeInOutCubic)),
    ...baseDots.map((dot) => dot.opacity(0, 0.35, easeInOutCubic)),
    ...firstLines.map((line) => line.opacity(0, 0.35, easeInOutCubic)),
    ...secondLines.map((line) => line.opacity(0, 0.35, easeInOutCubic)),
    ...intersectionArrows.map((arrow) =>
      all(arrow.opacity(0, 0.35, easeInOutCubic), arrow.end(0, 0.35)),
    ),
    ...cherryBalls.map((ball) =>
      all(ball.opacity(0, 0.3, easeInOutCubic), ball.scale(0, 0.3, easeInOutCubic)),
    ),
    graph().position(CENTER_STAR_GRAPH_POSITION, 0.55, easeInOutCubic),
    centers[0].opacity(0, 0.35, easeInOutCubic),
    centers[0].scale(0, 0.35, easeInOutCubic),
    centers[1].opacity(0, 0.35, easeInOutCubic),
    centers[1].scale(0, 0.35, easeInOutCubic),
  );

  yield* waitFor(0.1);

  yield* all(
    centers[0].opacity(1, 0.35, easeOutCubic),
    centers[0].scale(1.42, 0.35, easeOutCubic),
    centers[0].fill(brown, 0.35, easeOutCubic),
    uLabel().opacity(1, 0.35, easeOutCubic),
  );

  yield* waitFor(0.25);

  yield* sequence(
    0.06,
    ...starLines.map((line, index) =>
      all(
        line.opacity(0.2, 0.25, easeOutCubic),
        line.end(1, 0.48, easeInOutCubic),
        starDots[index].opacity(1, 0.25, easeOutCubic),
        starDots[index].scale(1, 0.28, easeOutCubic),
      ),
    ),
  );

  yield* waitFor(0.8);

  yield* all(
    rotatingCherry().opacity(1, 0.5, easeOutCubic),
    starLines[initialCenterStarStep.moving].opacity(0.55, 0.25, easeOutCubic),
    starLines[initialCenterStarStep.fixed].opacity(0.55, 0.25, easeOutCubic),
  );

  yield* waitFor(0.4);

  let fixedIndex = initialCenterStarStep.fixed;
  let movingIndex = initialCenterStarStep.moving;
  let fixedRotation = initialCenterStarStep.fixedRotation;
  let movingRotation = initialCenterStarStep.movingRotation;
  let completedClockSegments = 0;
  const totalClockSegments =
    centerStarClockTurns * (centerStarAngles.length - 1);
  const formulaAppearSegment = Math.floor(totalClockSegments * 0.5);
  const formulaBinomialSegment = Math.floor(totalClockSegments * (2 / 3));
  const formulaReturnSegment = Math.floor(totalClockSegments * 0.84);

  function* updateClockFormula() {
    if (completedClockSegments === formulaAppearSegment) {
      centerFormula().tex(LOCAL_CHERRY_APPROX);
      yield* centerFormula().opacity(1, 0.45, easeOutCubic);
    }

    if (completedClockSegments === formulaBinomialSegment) {
      yield* centerFormula().opacity(0, 0.16, easeInOutCubic);
      centerFormula().tex(LOCAL_CHERRY_BINOMIAL);
      yield* centerFormula().opacity(1, 0.24, easeOutCubic);
    }

    if (completedClockSegments === formulaReturnSegment) {
      yield* centerFormula().opacity(0, 0.16, easeInOutCubic);
      centerFormula().tex(LOCAL_CHERRY_APPROX);
      yield* centerFormula().opacity(1, 0.24, easeOutCubic);
    }
  }

  function* updateClockSelection(
    selected: number[],
    duration: number,
    pulse = true,
  ) {
    yield* all(
      ...starLines.map((line, index) => {
        const isSelected = selected.includes(index);
        return all(
          line.opacity(isSelected ? 0.58 : 0.14, 0.16, easeOutCubic),
          line.lineWidth(isSelected ? 9 : 6, 0.16, easeOutCubic),
        );
      }),
      ...starDots.map((dot, index) =>
        dot.scale(selected.includes(index) ? 1.2 : 1, 0.16, easeOutCubic),
      ),
      pulse
        ? centers[0].scale(1.56, duration / 2, easeOutCubic).to(1.42, duration / 2)
        : centers[0].scale(1.42, duration, easeInOutCubic),
    );
  }

  for (let turn = 0; turn < centerStarClockTurns; turn++) {
    for (let step = 0; step < centerStarAngles.length - 2; step++) {
      movingIndex = (movingIndex + 1) % centerStarAngles.length;
      movingRotation += centerStarStep;

      yield* all(
        rotatingCherryStems[0].rotation(
          movingRotation,
          centerStarFastStepDuration,
          easeInOutCubic,
        ),
        updateClockSelection(
          [movingIndex, fixedIndex],
          centerStarFastStepDuration,
        ),
      );

      completedClockSegments++;
      yield* updateClockFormula();
      yield* waitFor(centerStarFastStepHold);
    }

    fixedIndex = (fixedIndex + 1) % centerStarAngles.length;
    movingIndex = (fixedIndex + 1) % centerStarAngles.length;
    fixedRotation += centerStarStep;
    movingRotation += centerStarStep * 3;

    yield* all(
      rotatingCherryStems[0].rotation(
        movingRotation,
        centerStarWrapStepDuration,
        easeInOutCubic,
      ),
      rotatingCherryStems[1].rotation(
        fixedRotation,
        centerStarWrapStepDuration,
        easeInOutCubic,
      ),
      updateClockSelection(
        [movingIndex, fixedIndex],
        centerStarWrapStepDuration,
        false,
      ),
    );

    completedClockSegments++;
    yield* updateClockFormula();
    yield* waitFor(centerStarFastStepHold);
  }

  yield* waitFor(1.2);

  yield* all(
    centerFormula().opacity(0, 0.35, easeInOutCubic),
    rotatingCherry().opacity(0, 0.45, easeInOutCubic),
    ...starLines.map((line) =>
      all(line.opacity(0.1, 0.35, easeInOutCubic), line.lineWidth(6, 0.35)),
    ),
    ...starDots.map((dot) => dot.scale(1, 0.35, easeInOutCubic)),
  );

  yield* sumFormula().opacity(1, 0.55, easeOutCubic);
  yield* waitFor(6.8);

  yield* all(
    sumFormula().opacity(0, 0.3, easeInOutCubic),
    lowerBoundFormula().opacity(1, 0.45, easeOutCubic),
  );

  yield* waitFor(3);

  yield* all(
    graph().opacity(0, 0.45, easeInOutCubic),
    lowerBoundFormula().position([-650, -40], 0.5, easeInOutCubic),
    lowerBoundFormula().fontSize(60, 0.5, easeInOutCubic),
    upperBound().position([-650, -200], 0.5, easeInOutCubic),
    upperBound().fontSize(60, 0.5, easeInOutCubic),
    upperBound().scale(1, 0.5, easeInOutCubic),
    upperBound().opacity(1, 0.35, easeOutCubic),
  );

  yield* waitFor(0.65);

  yield* all(
    //    upperBound().opacity(0, 0.35, easeInOutCubic),
    //    lowerBoundFormula().opacity(0, 0.35, easeInOutCubic),
    combinedFormula().opacity(1, 0.6, easeOutCubic),
  );

  yield* waitFor(14);
});
