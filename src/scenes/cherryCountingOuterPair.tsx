import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';

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
  rightLeaf: [405, -80],
  bottomRightLeaf: [100, 360],
  bottomLeftLeaf: [-100, 360],
  leftLeaf: [-405, -80],
};

const pointIndex = Object.fromEntries(
  pointNames.map((name, index) => [name, index]),
) as Record<PointName, number>;

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
];

const diamondEdges: [PointName, PointName][] = [
  ['left', 'top'],
  ['top', 'right'],
  ['right', 'bottom'],
  ['bottom', 'left'],
];

function xy(name: PointName) {
  return points[name];
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const baseLines: Line[] = [];
  const diamondLines: Line[] = [];
  const nodes: Circle[] = [];
  const outerPair = ['left', 'right'] as PointName[];
  const centers = ['top', 'bottom'] as PointName[];

  view.add(
    <Node>
      {baseEdges.map(([from, to], index) => (
        <Line
          ref={makeRef(baseLines, index)}
          points={[xy(from), xy(to)]}
          stroke={palette.edge}
          lineWidth={3}
          lineCap={'round'}
          end={0}
          opacity={0.8}
        />
      ))}
      {diamondEdges.map(([from, to], index) => (
        <Line
          ref={makeRef(diamondLines, index)}
          points={[xy(from), xy(to)]}
          stroke={Solarized.green}
          lineWidth={8}
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

  yield* sequence(
    0.05,
    ...pointNames.map((name) => nodes[pointIndex[name]].scale(1, 0.24, easeOutCubic)),
  );
  yield* sequence(0.04, ...baseLines.map((line) => line.end(1, 0.42, easeInOutCubic)));

  yield* waitFor(0.15);

  yield* sequence(
    0.08,
    ...diamondLines.map((line) =>
      all(line.opacity(1, 0.08, easeOutCubic), line.end(1, 0.36, easeInOutCubic)),
    ),
  );

  yield* all(
    ...outerPair.map((name) =>
      all(
        nodes[pointIndex[name]].fill('#c92932', 0.22, easeOutCubic),
        nodes[pointIndex[name]].scale(1.65, 0.22, easeOutCubic),
      ),
    ),
  );
  yield* all(
    ...outerPair.map((name) => nodes[pointIndex[name]].scale(1.35, 0.2)),
    ...centers.map((name) =>
      all(
        nodes[pointIndex[name]].fill('#8b572a', 0.24, easeOutCubic),
        nodes[pointIndex[name]].scale(1.45, 0.24, easeOutCubic),
      ),
    ),
  );

  yield* all(
    ...outerPair.map((name) =>
      nodes[pointIndex[name]].scale(1.2, 0.28, easeInOutCubic),
    ),
    ...centers.map((name) => nodes[pointIndex[name]].scale(1.2, 0.28, easeInOutCubic)),
    ...diamondLines.map((line) => line.lineWidth(6, 0.28, easeInOutCubic)),
  );

  yield* waitFor(1.25);
});
