import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  Color,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  linear,
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

const centerNeighbors: PointName[] = ['left', 'right', 'topLeftLeaf', 'topRightLeaf'];

const centerCherryPairs: [PointName, PointName][] = [
  ['left', 'right'],
  ['left', 'topLeftLeaf'],
  ['left', 'topRightLeaf'],
  ['right', 'topLeftLeaf'],
  ['right', 'topRightLeaf'],
  ['topLeftLeaf', 'topRightLeaf'],
];

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
const green = Solarized.green;
const greenLight = new Color(Solarized.green).brighten(0.5);
const brown = Solarized.base02;
const centerStemLength = 245;
const upperBoundDock: Point = [205, -350];

const EDGE_WIDTH = 10;
const POINT_SIZE = 30;

function xy(name: PointName) {
  return new Vector2(points[name][0], points[name][1]);
}

function cherryCenter(phase: number, angle: () => number): Point {
  return [0, Math.sin(angle() + phase) * 126];
}

function cherryDepth(phase: number, angle: () => number) {
  return (Math.cos(angle() + phase) + 1) / 2;
}

function shinePoint(name: PointName): Point {
  return [points[name][0] - 11, points[name][1] - 13];
}

function angleFromU(name: PointName) {
  const [ux, uy] = points.top;
  const [x, y] = points[name];

  return (Math.atan2(y - uy, x - ux) * 180) / Math.PI;
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const graph = createRef<Node>();
  const flatGraph = createRef<Node>();
  const pseudo3d = createRef<Node>();
  const baseLines: Line[] = [];
  const baseDots: Circle[] = [];
  const firstLines: Line[] = [];
  const firstLineLabels: PolyTxt[] = [];
  const secondLines: Line[] = [];
  const cherryBalls: Circle[] = [];
  const cherryShines: Circle[] = [];
  const centers: Circle[] = [];
  const threeLines: Line[] = [];
  const threeCenters: Circle[] = [];
  const threeShines: Circle[] = [];
  const centerCountLines: Line[] = [];
  const rotatingCherry = createRef<Node>();
  const rotatingCherryStems: Node[] = [];
  const upperBound = createRef<PolyLatex>();
  const centerFormula = createRef<PolyLatex>();
  const uLabel = createRef<PolyLatex>();
  const finalFormula = createRef<Node>();
  const finalFormulaLines: PolyLatex[] = [];
  const lowerBoundFormula = createRef<PolyLatex>();
  const combinedFormula = createRef<PolyLatex>();
  const angle = createSignal(0);
  const threeLeft: Point = [-160, 0];
  const threeRight: Point = [160, 0];
  const phases = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
  const cherryCircles: Circle[] = [];

  view.add(
    <Node ref={graph} x={-450} y={15} scale={0.78}>
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
        {centerNeighbors.map((name, index) => (
          <Line
            ref={makeRef(centerCountLines, index)}
            points={[xy('top'), xy(name)]}
            stroke={green}
            lineWidth={7}
            lineCap={'round'}
            end={0}
            opacity={0}
          />
        ))}
        <Node ref={rotatingCherry} opacity={0}>
          {[0, 1].map((index) => (
            <Node
              ref={makeRef(rotatingCherryStems, index)}
              x={points.top[0]}
              y={points.top[1]}
              rotation={angleFromU(centerCherryPairs[0][index])}
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
              />
              {/* <Circle
                x={centerStemLength - 11}
                y={-13}
                size={12}
                fill={redLight}
                opacity={0.9}
              /> */}
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
              ref={makeRef(cherryShines, index)}
              x={-11}
              y={-13}
              size={13}
              fill={red}
              opacity={0}
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

      <Node ref={pseudo3d} x={900} y={-5} opacity={0} scale={1.18}>
        <Circle
          width={44}
          height={252}
          stroke={'#b9c2c7'}
          lineWidth={3}
          lineDash={[10, 9]}
          opacity={0.7}
        />
        <Line
          points={[threeLeft, threeRight]}
          stroke={'#cad0d4'}
          lineWidth={3}
          lineDash={[12, 10]}
        />
        {phases.map((phase, phaseIndex) => (
          <Node>
            <Line
              ref={makeRef(threeLines, phaseIndex * 2)}
              points={[threeLeft, () => cherryCenter(phase, angle)]}
              stroke={green}
              lineWidth={() => 4 + cherryDepth(phase, angle) * 5}
              lineCap={'round'}
              opacity={() => 0.24 + cherryDepth(phase, angle) * 0.7}
            />
            <Line
              ref={makeRef(threeLines, phaseIndex * 2 + 1)}
              points={[threeRight, () => cherryCenter(phase, angle)]}
              stroke={green}
              lineWidth={() => 4 + cherryDepth(phase, angle) * 5}
              lineCap={'round'}
              opacity={() => 0.24 + cherryDepth(phase, angle) * 0.7}
            />
            <Circle
              ref={makeRef(threeCenters, phaseIndex)}
              x={() => cherryCenter(phase, angle)[0]}
              y={() => cherryCenter(phase, angle)[1]}
              size={() => 15 + cherryDepth(phase, angle) * 12}
              fill={brown}
              stroke={palette.background}
              lineWidth={3}
              opacity={() => 0.38 + cherryDepth(phase, angle) * 0.62}
            />
            <Circle
              ref={makeRef(threeShines, phaseIndex)}
              x={() => cherryCenter(phase, angle)[0] - 5}
              y={() => cherryCenter(phase, angle)[1] - 6}
              size={() => 5 + cherryDepth(phase, angle) * 5}
              fill={Solarized.orange}
              opacity={() => 0 * cherryDepth(phase, angle) * 0.7}
            />
          </Node>
        ))}
        {[threeLeft, threeRight].map(([x, y]) => (
          <Node>
            <Circle x={x} y={y} size={80} fill={red} stroke={redDark} lineWidth={5} />
            <Circle x={x - 13} y={y - 16} size={15} fill={redLight} opacity={0} />
          </Node>
        ))}
      </Node>
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
      x={112}
      y={38}
      tex={'\\#\\text{cherries around } u\\approx\\#\\text{buddies}(u)^2'}
      fontSize={22}
      offsetX={-1}
      opacity={0}
      scale={1.7}
    />,
  );

  view.add(
    <Node ref={finalFormula} x={112} y={60} opacity={0} scale={1.7}>
      {[
        '\\mkern 120mu\\Downarrow',
        '\\#\\text{cherries total}\\approx\\sum_u\\#\\mathrm{buddies}(u)^2',
        '\\llap{\\textit{\\scriptsize(Cauchy-Schwarz)}\\;\\;\\;}{\\ge{}} n\\left({2m\\over n}\\right)^2={2m^2\\over n}',
      ].map((tex, index) => (
        <PolyLatex
          ref={makeRef(finalFormulaLines, index)}
          y={30 + index * 60}
          tex={tex}
          fontSize={21}
          offsetX={-1}
          opacity={0}
        />
      ))}
    </Node>,
  );

  view.add(
    <PolyLatex
      ref={lowerBoundFormula}
      x={105}
      y={265}
      tex={'2.\\;\\;\\;\\#\\mathrm{cherries}\\ge{2m^2\\over n}'}
      fontSize={64}
      offsetX={-1}
      opacity={0}
    />,
  );

  view.add(
    <PolyLatex
      ref={combinedFormula}
      x={170}
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
      x={25}
      y={282}
      tex={'1.\\;\\;\\;\\#\\mathrm{cherries}\\le 2n^2'}
      fontSize={64}
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
    ...cherryShines.map((shine) => shine.opacity(0 * 0.9, 0.35, easeOutCubic)),
    ...firstLines.map((line) => line.lineWidth(14, 0.35, easeOutCubic)),
    centers[0].scale(1.18, 0.35, easeOutCubic),
  );

  yield* all(...firstLineLabels.map((label) => label.opacity(1, 0.5)));
  yield* waitFor(0.9);
  yield* all(...firstLineLabels.map((label) => label.opacity(0, 0.5)));

  yield* waitFor(0.9);

  yield* all(
    ...firstLines.map((line) => line.opacity(0, 1)),
    centers[0].scale(0, 1),
    ...cherryBalls.map((cherry) => cherry.scale(0, 1)),
  );

  yield* waitFor(0.9);

  yield* sequence(
    1.5,
    all(...cherryBalls.map((cherry) => cherry.scale(1, 1))),
    sequence(0.3, ...cherryCircles.slice(0, 2).map((circle) => circle.end(1, 1))),
  );

  /*
  for (const [leftName, rightName] of samplePairs) {
    yield* all(
      cherryBalls[0].position(points[leftName], 0.15, easeInOutCubic),
      cherryBalls[1].position(points[rightName], 0.15, easeInOutCubic),
      cherryShines[0].position(shinePoint(leftName), 0.15, easeInOutCubic),
      cherryShines[1].position(shinePoint(rightName), 0.15, easeInOutCubic),
    );
  }*/

  yield* waitFor(1);

  yield* all(
    centers[0].scale(1.18, 0.5, easeOutCubic),
    ...firstLines.map((line) => line.opacity(1, 0.8, easeOutCubic)),
  );

  yield* waitFor(0.5);

  yield* all(
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

  yield* waitFor(2);

  yield* pseudo3d().opacity(1, 0.55, easeOutCubic);

  yield* angle(Math.PI * 2, 4.2, linear);

  yield* waitFor(0.2);

  yield* pseudo3d().opacity(0, 0.55, easeInOutCubic);

  yield* waitFor(0.35);

  yield* upperBound().opacity(1, 0.65, easeOutCubic);

  yield* all(
    upperBound().position(upperBoundDock, 0.55, easeInOutCubic),
    upperBound().scale(0.62, 0.55, easeInOutCubic),
    ...cherryCircles.slice(0, 2).map((circle) => circle.opacity(0, 0.55)),
    ...firstLines.map((line) => line.opacity(0, 0.35, easeInOutCubic)),
    ...secondLines.map((line) => line.opacity(0, 0.35, easeInOutCubic)),
    ...cherryBalls.map((ball) =>
      all(ball.opacity(0, 0.3, easeInOutCubic), ball.scale(0, 0.3, easeInOutCubic)),
    ),
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
  yield* waitFor(1);
  cherryCircles[2].zIndex(1);
  cherryCircles[2].stroke(redDark);
  yield* cherryCircles[2].end(1, 0.5);
  yield* waitFor(0.5);
  yield* all(
    rotatingCherry().opacity(1, 0.5, easeOutCubic),
    sequence(
      0.05,
      ...centerCountLines.map((line) =>
        all(line.end(1, 0.5, easeInOutCubic), line.opacity(0.18, 0.5, easeOutCubic)),
      ),
    ),
    cherryCircles[2].end(1, 0.6),
  );

  yield* waitFor(0.2);

  for (const [a, b] of centerCherryPairs) {
    const selected = [a, b];
    yield* all(
      rotatingCherryStems[0].rotation(angleFromU(a), 0.24, easeInOutCubic),
      rotatingCherryStems[1].rotation(angleFromU(b), 0.24, easeInOutCubic),
      ...centerCountLines.map((line, index) => {
        const isSelected = selected.includes(centerNeighbors[index]);
        return all(
          line.opacity(isSelected ? 0.55 : 0.12, 0.16, easeOutCubic),
          line.lineWidth(isSelected ? 8 : 5, 0.16, easeOutCubic),
        );
      }),
      centers[0].scale(1.58, 0.11, easeOutCubic).to(1.42, 0.11),
    );
    yield* waitFor(0.12);
  }

  yield* waitFor(0.25);
  yield* centerFormula().opacity(1, 0.65, easeOutCubic);
  yield* all(
    finalFormula().opacity(1, 0.65, easeOutCubic),
    sequence(
      1,
      ...finalFormulaLines.map((line) => line.opacity(1, 0.65, easeOutCubic)),
    ),
  );

  yield* waitFor(0.65);

  yield* all(
    centerFormula().opacity(0, 0.6, easeInOutCubic),
    finalFormula().opacity(0, 0.6, easeInOutCubic),
    lowerBoundFormula().opacity(1, 0.6, easeOutCubic),
  );

  yield* waitFor(0.25);

  yield* all(
    lowerBoundFormula().position([0, -40], 0.5, easeInOutCubic),
    upperBound().position([0, -200], 0.5, easeInOutCubic),
    upperBound().scale(1, 0.5, easeInOutCubic),
    upperBound().opacity(1, 0.35, easeOutCubic),
  );

  yield* waitFor(0.65);

  yield* all(
    //    upperBound().opacity(0, 0.35, easeInOutCubic),
    //    lowerBoundFormula().opacity(0, 0.35, easeInOutCubic),
    combinedFormula().opacity(1, 0.6, easeOutCubic),
  );

  yield* waitFor(1.2);
});
