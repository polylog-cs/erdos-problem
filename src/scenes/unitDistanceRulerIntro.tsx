import { Circle, Line, Node, Rect } from '@motion-canvas/2d';
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
  Vector2,
  waitFor,
} from '@motion-canvas/core';

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
type PairEdge = [PointName, PointName];

interface PairConfiguration {
  points: Record<PointName, Point>;
  edges: PairEdge[];
}

type GrowthEndpoint =
  | { kind: 'base'; name: PointName }
  | { kind: 'growth'; index: number };

interface GrowthEdge {
  from: GrowthEndpoint;
  to: GrowthEndpoint;
}

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

const edges: PairEdge[] = [
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

const ladderPoints: Record<PointName, Point> = {
  topLeftLeaf: [-320, -185],
  top: [-160, -185],
  topRightLeaf: [0, -185],
  rightLeaf: [160, -185],
  right: [320, -185],
  left: [-320, -20],
  leftLeaf: [-160, -20],
  bottomLeftLeaf: [0, -20],
  bottom: [160, -20],
  bottomRightLeaf: [320, -20],
};

const ladderEdges: PairEdge[] = [
  ['topLeftLeaf', 'top'],
  ['top', 'topRightLeaf'],
  ['topRightLeaf', 'rightLeaf'],
  ['rightLeaf', 'right'],
  ['left', 'leftLeaf'],
  ['leftLeaf', 'bottomLeftLeaf'],
  ['bottomLeftLeaf', 'bottom'],
  ['bottom', 'bottomRightLeaf'],
  ['topLeftLeaf', 'left'],
  ['topRightLeaf', 'bottomLeftLeaf'],
  ['right', 'bottomRightLeaf'],
  ['top', 'leftLeaf'],
  ['rightLeaf', 'bottom'],
];

const hexFanPoints: Record<PointName, Point> = {
  top: [0, -190],
  topRightLeaf: [165, -95],
  right: [165, 95],
  bottom: [0, 190],
  bottomLeftLeaf: [-165, 95],
  left: [-165, -95],
  bottomRightLeaf: [0, 0],
  topLeftLeaf: [-330, 0],
  rightLeaf: [330, 0],
  leftLeaf: [0, 330],
};

const hexFanEdges: PairEdge[] = [
  ['top', 'topRightLeaf'],
  ['topRightLeaf', 'right'],
  ['right', 'bottom'],
  ['bottom', 'bottomLeftLeaf'],
  ['bottomLeftLeaf', 'left'],
  ['left', 'top'],
  ['bottomRightLeaf', 'top'],
  ['bottomRightLeaf', 'topRightLeaf'],
  ['bottomRightLeaf', 'right'],
  ['bottomRightLeaf', 'bottom'],
  ['bottomRightLeaf', 'bottomLeftLeaf'],
  ['bottomRightLeaf', 'left'],
  ['topLeftLeaf', 'left'],
  ['topLeftLeaf', 'bottomLeftLeaf'],
  ['rightLeaf', 'topRightLeaf'],
  ['rightLeaf', 'right'],
  ['leftLeaf', 'bottomLeftLeaf'],
  ['leftLeaf', 'bottom'],
];

const triangularPatchPoints: Record<PointName, Point> = {
  topLeftLeaf: [-150, -200],
  top: [0, -200],
  topRightLeaf: [150, -200],
  left: [-225, -70],
  bottomLeftLeaf: [-75, -70],
  bottomRightLeaf: [75, -70],
  right: [225, -70],
  leftLeaf: [-150, 60],
  bottom: [0, 60],
  rightLeaf: [150, 60],
};

const triangularPatchEdges: PairEdge[] = [
  ['topLeftLeaf', 'top'],
  ['top', 'topRightLeaf'],
  ['left', 'bottomLeftLeaf'],
  ['bottomLeftLeaf', 'bottomRightLeaf'],
  ['bottomRightLeaf', 'right'],
  ['leftLeaf', 'bottom'],
  ['bottom', 'rightLeaf'],
  ['topLeftLeaf', 'left'],
  ['topLeftLeaf', 'bottomLeftLeaf'],
  ['top', 'bottomLeftLeaf'],
  ['top', 'bottomRightLeaf'],
  ['topRightLeaf', 'bottomRightLeaf'],
  ['topRightLeaf', 'right'],
  ['left', 'leftLeaf'],
  ['bottomLeftLeaf', 'leftLeaf'],
  ['bottomLeftLeaf', 'bottom'],
  ['bottomRightLeaf', 'bottom'],
  ['bottomRightLeaf', 'rightLeaf'],
  ['right', 'rightLeaf'],
];

const pairConfigurations: PairConfiguration[] = [
  { points, edges },
  { points: ladderPoints, edges: ladderEdges },
  { points: hexFanPoints, edges: hexFanEdges },
  { points: triangularPatchPoints, edges: triangularPatchEdges },
];

const maxPairEdges = Math.max(
  ...pairConfigurations.map((configuration) => configuration.edges.length),
);

const base = (name: PointName): GrowthEndpoint => ({ kind: 'base', name });
const growth = (index: number): GrowthEndpoint => ({ kind: 'growth', index });

const latticeCenter: Point = [0, -120];
const latticeStepX = 155;
const latticeStepY = 134;

interface LatticePoint {
  key: string;
  row: number;
  col: number;
  point: Point;
  distance: number;
}

const baseLatticePoints: Array<{
  row: number;
  col: number;
  name: PointName;
}> = [
  { row: -1, col: -1, name: 'topLeftLeaf' },
  { row: -1, col: 0, name: 'top' },
  { row: -1, col: 1, name: 'topRightLeaf' },
  { row: 0, col: -2, name: 'left' },
  { row: 0, col: -1, name: 'bottomLeftLeaf' },
  { row: 0, col: 0, name: 'bottomRightLeaf' },
  { row: 0, col: 1, name: 'right' },
  { row: 1, col: -1, name: 'leftLeaf' },
  { row: 1, col: 0, name: 'bottom' },
  { row: 1, col: 1, name: 'rightLeaf' },
];

function latticeKey(row: number, col: number) {
  return `${row}:${col}`;
}

function latticePoint(row: number, col: number): Point {
  const xOffset = row % 2 === 0 ? latticeStepX / 2 : 0;
  return [col * latticeStepX + xOffset, latticeCenter[1] + row * latticeStepY];
}

function latticeDistance(point: Point) {
  return Math.hypot(point[0] - latticeCenter[0], point[1] - latticeCenter[1]);
}

function latticeNeighbors({ row, col }: Pick<LatticePoint, 'row' | 'col'>) {
  return [
    [row, col - 1],
    [row, col + 1],
    row % 2 === 0 ? [row - 1, col] : [row - 1, col - 1],
    row % 2 === 0 ? [row - 1, col + 1] : [row - 1, col],
    row % 2 === 0 ? [row + 1, col] : [row + 1, col - 1],
    row % 2 === 0 ? [row + 1, col + 1] : [row + 1, col],
  ] as Array<[number, number]>;
}

const baseEndpointByKey = new Map(
  baseLatticePoints.map(({ row, col, name }) => [latticeKey(row, col), base(name)]),
);

const baseKeys = new Set(baseEndpointByKey.keys());

function createGrowthLatticePoints() {
  const candidates: LatticePoint[] = [];

  for (let row = -5; row <= 6; row++) {
    const minCol = row % 2 === 0 ? -7 : -6;
    const maxCol = 4;

    for (let col = minCol; col <= maxCol; col++) {
      const key = latticeKey(row, col);
      if (baseKeys.has(key)) {
        continue;
      }

      const point = latticePoint(row, col);
      candidates.push({
        key,
        row,
        col,
        point,
        distance: latticeDistance(point),
      });
    }
  }

  return candidates.sort(
    (a, b) =>
      a.distance - b.distance ||
      Math.atan2(a.point[1] - latticeCenter[1], a.point[0] - latticeCenter[0]) -
        Math.atan2(b.point[1] - latticeCenter[1], b.point[0] - latticeCenter[0]),
  );
}

const growthLatticePoints = createGrowthLatticePoints();
const growthTargets = growthLatticePoints.map(({ point }) => point);
const growthDistances = growthLatticePoints.map(({ distance }) => distance);
const growthEndpointByKey = new Map(
  growthLatticePoints.map(({ key }, index) => [key, growth(index)]),
);

function endpointForKey(key: string) {
  return baseEndpointByKey.get(key) ?? growthEndpointByKey.get(key);
}

const growthEdges: GrowthEdge[] = growthLatticePoints.flatMap((point, index) =>
  latticeNeighbors(point).flatMap(([row, col]) => {
    const neighborKey = latticeKey(row, col);
    const neighborGrowthIndex = growthLatticePoints.findIndex(
      (candidate) => candidate.key === neighborKey,
    );
    const neighborEndpoint = endpointForKey(neighborKey);

    if (
      !neighborEndpoint ||
      (neighborEndpoint.kind === 'growth' && neighborGrowthIndex > index)
    ) {
      return [];
    }

    return [{ from: growth(index), to: neighborEndpoint }];
  }),
);

const growthRings = growthDistances.reduce<
  Array<{ distance: number; indices: number[] }>
>((rings, distance, index) => {
  const roundedDistance = Math.round(distance);
  const currentRing = rings.at(-1);

  if (currentRing && currentRing.distance === roundedDistance) {
    currentRing.indices.push(index);
  } else {
    rings.push({ distance: roundedDistance, indices: [index] });
  }

  return rings;
}, []);

function pairNumberText(count: number) {
  return `${count}`;
}

const pointIndex = Object.fromEntries(
  pointNames.map((name, index) => [name, index]),
) as Record<PointName, number>;

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
const LEFT_TWO_THIRDS_CENTER_X = -320;
const RULER_VISIT_PASSES = 5;
const RULER_VISIT_COUNT = Math.ceil(edges.length * RULER_VISIT_PASSES * 0.1);
const RULER_MOVE_DURATION = 0.34;
const RULER_HOLD_DURATION = 0.1;
const GROWTH_REVEAL_PIXELS_PER_SECOND = 155;

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const intro = createRef<Node>();
  const problemStatement = createRef<PolyLatex>();
  const ruler = createRef<Node>();
  const pairCountGroup = createRef<Node>();
  const pairCountNumber = createRef<PolyLatex>();
  const rulerLength = createSignal(260);
  const pointPositions = Object.fromEntries(
    pointNames.map((name) => [name, Vector2.createSignal(points[name])]),
  ) as Record<PointName, ReturnType<typeof Vector2.createSignal>>;
  const pairLineStarts = Array.from({ length: maxPairEdges }, (_, index) =>
    Vector2.createSignal(edges[index]?.[0] ? points[edges[index][0]] : points.top),
  );
  const pairLineEnds = Array.from({ length: maxPairEdges }, (_, index) =>
    Vector2.createSignal(edges[index]?.[1] ? points[edges[index][1]] : points.top),
  );
  const growthPositions = growthTargets.map(() => Vector2.createSignal(latticeCenter));
  const graphEdges: Line[] = [];
  const growingEdges: Line[] = [];
  const dots: Circle[] = [];
  const growingDots: Circle[] = [];

  function growthEdgeBirthIndex(edge: GrowthEdge) {
    const indices = [edge.from, edge.to]
      .filter((endpoint) => endpoint.kind === 'growth')
      .map((endpoint) => endpoint.index);

    return Math.max(...indices);
  }

  function endpointPosition(endpoint: GrowthEndpoint) {
    if (endpoint.kind === 'base') {
      return pointPositions[endpoint.name]();
    }

    return growthPositions[endpoint.index]();
  }

  function preparePairLines(configuration: PairConfiguration) {
    for (let index = 0; index < maxPairEdges; index++) {
      const edge = configuration.edges[index];

      if (edge) {
        const [from, to] = edge;
        pairLineStarts[index](pointPositions[from]());
        pairLineEnds[index](pointPositions[to]());
        graphEdges[index].end(1);
        graphEdges[index].opacity(0.18);
        graphEdges[index].stroke(palette.edge);
        graphEdges[index].lineWidth(EDGE_WIDTH);
      } else {
        graphEdges[index].opacity(0);
        graphEdges[index].end(0);
      }
    }
  }

  function* morphToConfiguration(configuration: PairConfiguration) {
    preparePairLines(configuration);
    pairCountNumber().tex(pairNumberText(configuration.edges.length));

    yield* all(
      ...pointNames.map((name) =>
        pointPositions[name](configuration.points[name], 0.8, easeInOutCubic),
      ),
      ...configuration.edges.flatMap(([from, to], index) => [
        pairLineStarts[index](configuration.points[from], 0.8, easeInOutCubic),
        pairLineEnds[index](configuration.points[to], 0.8, easeInOutCubic),
        graphEdges[index].opacity(0.52, 0.35, easeOutCubic),
        graphEdges[index].end(1, 0.45, easeInOutCubic),
      ]),
      ...graphEdges
        .slice(configuration.edges.length)
        .map((line) => line.opacity(0, 0.2, easeInOutCubic)),
    );
  }

  let currentPairCount = pairConfigurations.at(-1)!.edges.length;

  function* growRing(indices: number[]) {
    const indexSet = new Set(indices);
    const newEdges = growthEdges
      .map((edge, edgeIndex) => ({ edge, edgeIndex }))
      .filter(({ edge }) => indexSet.has(growthEdgeBirthIndex(edge)));

    currentPairCount += newEdges.length;
    pairCountNumber().tex(pairNumberText(currentPairCount));

    yield* all(
      ...indices.flatMap((index) => [
        growthPositions[index](growthTargets[index], 0.5, easeOutCubic),
        growingDots[index].opacity(1, 0.22, easeOutCubic),
        growingDots[index].scale(1, 0.34, easeOutCubic),
      ]),
      ...newEdges.map(({ edgeIndex }) =>
        all(
          growingEdges[edgeIndex].opacity(0.36, 0.28, easeOutCubic),
          growingEdges[edgeIndex].end(1, 0.42, easeInOutCubic),
        ),
      ),
    );
  }

  view.add(
    <PolyLatex
      ref={problemStatement}
      x={LEFT_TWO_THIRDS_CENTER_X}
      y={-40}
      tex={
        '\\begin{array}{c}' +
        '\\mathrm{Place\\ } n \\mathrm{\\ points\\ in\\ the\\ plane}' +
        '\\\\[0.45em]' +
        '\\mathrm{to\\ maximize\\ unit\\ distances.}' +
        '\\end{array}'
      }
      fontSize={58}
      fill={Solarized.text}
    />,
  );

  view.add(
    <Node ref={intro} x={LEFT_TWO_THIRDS_CENTER_X} y={-20} scale={0.94} opacity={0}>
      <Node>
        {Array.from({ length: maxPairEdges }, (_, index) => (
          <Line
            ref={makeRef(graphEdges, index)}
            points={() => [pairLineStarts[index](), pairLineEnds[index]()]}
            stroke={palette.edge}
            lineWidth={EDGE_WIDTH}
            lineCap={'round'}
            end={0}
            opacity={index < edges.length ? 0.52 : 0}
          />
        ))}
        {growthEdges.map((edge, index) => (
          <Line
            ref={makeRef(growingEdges, index)}
            points={() => [endpointPosition(edge.from), endpointPosition(edge.to)]}
            stroke={palette.edge}
            lineWidth={7}
            lineCap={'round'}
            end={0}
            opacity={0}
          />
        ))}
        {pointNames.map((name, index) => (
          <Circle
            ref={makeRef(dots, index)}
            position={() => pointPositions[name]()}
            size={POINT_SIZE}
            fill={palette.node}
            opacity={1}
            scale={0}
          />
        ))}
        {growthTargets.map((_, index) => (
          <Circle
            ref={makeRef(growingDots, index)}
            position={() => growthPositions[index]()}
            size={POINT_SIZE * 0.8}
            fill={palette.node}
            opacity={0}
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
        <PolyLatex tex={'1'} y={-45} fill={palette.text} fontSize={60} opacity={0.9} />
      </Node>
    </Node>,
  );

  view.add(
    <>
      <Node ref={pairCountGroup} x={LEFT_TWO_THIRDS_CENTER_X} y={260} opacity={0}>
        <Rect
          width={620}
          height={110}
          x={-120}
          radius={8}
          fill={palette.background}
          stroke={Solarized.base1}
          lineWidth={2}
          opacity={0.92}
        />
        <PolyLatex
          x={2}
          tex={'\\#\\mathrm{\\ pairs}='}
          fontSize={80}
          fill={palette.text}
          offsetX={1}
        />
        <PolyLatex
          ref={pairCountNumber}
          x={18}
          tex={pairNumberText(edges.length)}
          fontSize={80}
          fill={palette.text}
          offsetX={-1}
        />
      </Node>
    </>,
  );

  yield* problemStatement().write(2.4, easeInOutCubic);
  yield* waitFor(5);
  yield* waitFor(0.7);
  yield* problemStatement().unwrite(0.65, easeInOutCubic);
  problemStatement().opacity(0);

  yield* intro().opacity(1, 0.35, easeOutCubic);
  yield* waitFor(0.1);

  yield* sequence(
    0.06,
    ...pointNames.map((name) => dots[pointIndex[name]].scale(1, 0.22, easeOutCubic)),
  );

  yield* waitFor(0.18);

  for (const [index, [from, to]] of edges.entries()) {
    const fromDot = dots[pointIndex[from]];
    const toDot = dots[pointIndex[to]];
    const line = graphEdges[index];

    yield* all(
      line.opacity(0.86, 0.1, easeOutCubic),
      line.lineWidth(EDGE_WIDTH * 1.25, 0.12, easeOutCubic),
      line.end(1, 0.28, easeInOutCubic),
      fromDot.scale(1.18, 0.1, easeOutCubic),
      toDot.scale(1.18, 0.1, easeOutCubic),
    );

    yield* all(
      line.lineWidth(EDGE_WIDTH, 0.12, easeInOutCubic),
      line.opacity(0.52, 0.12, easeInOutCubic),
      fromDot.scale(1, 0.12, easeInOutCubic),
      toDot.scale(1, 0.12, easeInOutCubic),
    );

    yield* waitFor(0.02);
  }

  yield* waitFor(0.25);

  yield* all(
    ruler().opacity(1, 0.35, easeOutCubic),
    ruler().scale(1, 0.35, easeOutCubic),
  );

  yield* waitFor(0.35);

  const rulerVisits = Array.from({ length: RULER_VISIT_PASSES })
    .flatMap((_, pass) =>
      pass % 2 === 0
        ? edges.map((edge, index) => ({ edge, index }))
        : edges.map((edge, index) => ({ edge, index })).reverse(),
    )
    .slice(0, RULER_VISIT_COUNT);

  for (const { edge, index } of rulerVisits) {
    const { angle, length, midpoint } = edgeGeometry(edge);
    yield* all(
      ruler().position(midpoint, RULER_MOVE_DURATION, easeInOutCubic),
      ruler().rotation(angle, RULER_MOVE_DURATION, easeInOutCubic),
      rulerLength(length, RULER_MOVE_DURATION, easeInOutCubic),
      ...graphEdges
        .slice(0, edges.length)
        .map((line, edgeIndex) =>
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
    yield* waitFor(RULER_HOLD_DURATION);
  }

  yield* waitFor(0.25);

  yield* all(
    ...graphEdges
      .slice(0, edges.length)
      .map((line) =>
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

  yield* all(
    ruler().opacity(0, 0.3, easeInOutCubic),
    intro().y(-175, 0.65, easeInOutCubic),
    intro().scale(0.9, 0.65, easeInOutCubic),
    pairCountGroup().opacity(1, 0.35, easeOutCubic),
  );

  yield* waitFor(0.45);

  for (const configuration of pairConfigurations.slice(1)) {
    yield* morphToConfiguration(configuration);
    yield* waitFor(0.55);
  }

  yield* waitFor(0.25);

  yield* all(
    ...growthRings.map((ring) =>
      delay(ring.distance / GROWTH_REVEAL_PIXELS_PER_SECOND, growRing(ring.indices)),
    ),
  );

  yield* waitFor(0.9);
});
