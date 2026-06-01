import {Circle, Line, Node} from '@motion-canvas/2d';
import {
  all,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';

import {palette} from '../lib/palette';

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
  topLeftLeaf: [-100, -360],
  topRightLeaf: [185, -315],
  rightLeaf: [420, -100],
  bottomRightLeaf: [100, 360],
  bottomLeftLeaf: [-100, 360],
  leftLeaf: [-420, -100],
};

const pointIndex = Object.fromEntries(
  pointNames.map((name, index) => [name, index]),
) as Record<PointName, number>;

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
] as [PointName, PointName][];

const highlightEdges: [PointName, PointName][] = [
  ['left', 'top'],
  ['top', 'right'],
  ['right', 'bottom'],
  ['bottom', 'left'],
] as [PointName, PointName][];

function xy(name: PointName) {
  return points[name];
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const edgeLines: Line[] = [];
  const nodes: Circle[] = [];
  const highlightLines: Line[] = [];

  view.add(
    <Node>
      {edges.map(([from, to], index) => (
        <Line
          ref={makeRef(edgeLines, index)}
          points={[xy(from), xy(to)]}
          stroke={palette.edge}
          lineWidth={3}
          lineCap={'round'}
          end={0}
        />
      ))}
      {highlightEdges.map(([from, to], index) => (
        <Line
          ref={makeRef(highlightLines, index)}
          points={[xy(from), xy(to)]}
          stroke={palette.accent}
          lineWidth={6}
          lineCap={'round'}
          end={0}
          opacity={0}
        />
      ))}
      {pointNames.map((name, index) => (
        <Circle
          ref={makeRef(nodes, index)}
          x={points[name][0]}
          y={points[name][1]}
          size={15}
          fill={palette.ink}
          scale={0}
        />
      ))}
    </Node>,
  );

  const nodeRevealOrder = [
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
  ] as PointName[];

  yield* sequence(
    0.06,
    ...nodeRevealOrder.map(name =>
      nodes[pointIndex[name]].scale(1, 0.28, easeOutCubic),
    ),
  );

  yield* sequence(
    0.08,
    ...edgeLines.map(line => line.end(1, 0.5, easeInOutCubic)),
  );

  yield* waitFor(0.2);

  yield* sequence(
    0.1,
    ...highlightLines.map(line =>
      all(
        line.opacity(1, 0.1, easeOutCubic),
        line.end(1, 0.4, easeInOutCubic),
      ),
    ),
  );

  yield* all(
    ...['top', 'right', 'bottom', 'left'].map(name =>
      nodes[pointIndex[name]].scale(1.25, 0.2, easeOutCubic),
    ),
  );
  yield* all(
    ...['top', 'right', 'bottom', 'left'].map(name =>
      nodes[pointIndex[name]].scale(1, 0.22, easeInOutCubic),
    ),
    ...highlightLines.map(line => line.opacity(0, 0.35, easeInOutCubic)),
  );

  yield* waitFor(1.2);
});
