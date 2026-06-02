import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import { playGridUnitScene } from '../lib/gridUnitScene';
import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';

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

const edges: [PointName, PointName][] = [
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

const pointIndex = Object.fromEntries(
  pointNames.map((name, index) => [name, index]),
) as Record<PointName, number>;

function xy(name: PointName) {
  return points[name];
}

function edgeGeometry([from, to]: [PointName, PointName]) {
  const [x1, y1] = points[from];
  const [x2, y2] = points[to];
  const dx = x2 - x1;
  const dy = y2 - y1;
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (angle > 90) {
    angle -= 180;
  } else if (angle < -90) {
    angle += 180;
  }

  return {
    angle,
    length: Math.hypot(dx, dy),
    midpoint: [(x1 + x2) / 2, (y1 + y2) / 2] as Point,
  };
}

const EDGE_WIDTH = 10;
const POINT_SIZE = 30;

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const intro = createRef<Node>();
  const caption = createRef<PolyLatex>();
  const ruler = createRef<Node>();
  const rulerLength = createSignal(260);
  const graphEdges: Line[] = [];
  const dots: Circle[] = [];

  view.add(
    <PolyLatex
      ref={caption}
      x={0}
      y={-430}
      tex={'\\mathrm{Unit\\ distance\\ problem}'}
      opacity={0}
      fontSize={80}
    />,
  );

  view.add(
    <Node ref={intro} y={-20} scale={0.94}>
      <Node>
        {edges.map(([from, to], index) => (
          <Line
            ref={makeRef(graphEdges, index)}
            points={[xy(from), xy(to)]}
            stroke={palette.edge}
            lineWidth={EDGE_WIDTH}
            lineCap={'round'}
            end={0}
            opacity={0.52}
          />
        ))}
        {pointNames.map((name, index) => (
          <Circle
            ref={makeRef(dots, index)}
            x={points[name][0]}
            y={points[name][1]}
            size={POINT_SIZE}
            fill={palette.ink}
            opacity={0.75}
            scale={0}
          />
        ))}
      </Node>

      <Node ref={ruler} y={-320} opacity={0} scale={0.82}>
        <Line
          points={[
            () => [-rulerLength() / 2, 0] as Point,
            () => [rulerLength() / 2, 0] as Point,
          ]}
          stroke={Solarized.yellow}
          lineWidth={28}
          lineCap={'round'}
          opacity={0.52}
        />
        <Line
          points={[
            () => [-rulerLength() / 2, 0] as Point,
            () => [rulerLength() / 2, 0] as Point,
          ]}
          stroke={palette.accent}
          lineWidth={4}
          lineCap={'round'}
        />
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <Line
            points={[
              () => [(tick - 0.5) * rulerLength(), -16] as Point,
              () => [(tick - 0.5) * rulerLength(), 16] as Point,
            ]}
            stroke={palette.ink}
            lineWidth={tick === 0 || tick === 1 ? 4 : 2}
            lineCap={'round'}
            opacity={tick === 0 || tick === 1 ? 0.75 : 0.45}
          />
        ))}
        <PolyLatex tex={'1'} y={-45} fill={palette.ink} fontSize={60} opacity={0.9} />
      </Node>
    </Node>,
  );

  yield* all(
    caption().opacity(1, 0.35, easeOutCubic),
    sequence(
      0.04,
      ...pointNames.map((name) => dots[pointIndex[name]].scale(1, 0.26, easeOutCubic)),
    ),
    delay(
      1,
      sequence(0.025, ...graphEdges.map((line) => line.end(1, 0.65, easeInOutCubic))),
    ),
  );

  yield* waitFor(0.25);

  yield* all(
    ruler().opacity(1, 0.35, easeOutCubic),
    ruler().scale(1, 0.35, easeOutCubic),
  );

  yield* waitFor(0.35);

  for (const [index, edge] of edges.entries()) {
    const { angle, length, midpoint } = edgeGeometry(edge);
    yield* all(
      ruler().position(midpoint, 0.28, easeInOutCubic),
      ruler().rotation(angle, 0.28, easeInOutCubic),
      rulerLength(length, 0.28, easeInOutCubic),
      ...graphEdges.map((line, edgeIndex) =>
        all(
          line.stroke(edgeIndex === index ? palette.accent : palette.edge, 0.18),
          line.lineWidth(
            edgeIndex === index ? EDGE_WIDTH * 2 : EDGE_WIDTH,
            0.18,
            easeOutCubic,
          ),
          line.opacity(edgeIndex === index ? 0.95 : 0.32, 0.18, easeOutCubic),
        ),
      ),
    );
    yield* waitFor(0.08);
  }

  yield* waitFor(0.25);

  yield* all(
    ...graphEdges.map((line) =>
      all(
        line.stroke(palette.edge, 0.2),
        line.lineWidth(EDGE_WIDTH, 0.2, easeInOutCubic),
        line.opacity(0.52, 0.2, easeInOutCubic),
      ),
    ),
    ruler().scale(1.05, 0.2, easeOutCubic),
  );
  //yield* ruler().scale(1, 0.2, easeInOutCubic);

  yield* waitFor(0.25);

  yield* intro().opacity(0, 0.45, easeInOutCubic);
  yield* waitFor(0.15);

  yield* playGridUnitScene(view, {
    boundLabel: '\\#\\mathrm{unit\\ distances}\\le 2n',
  });
});
