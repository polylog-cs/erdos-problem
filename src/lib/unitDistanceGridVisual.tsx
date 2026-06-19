import { Circle, Line, Node } from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  type Reference,
} from '@motion-canvas/core';

import { PolyLatex } from '../utilities/latex';
import { palette } from './palette';

export type Point = [number, number];
export type BuddyName = 'N' | 'W' | 'E' | 'S';

export interface SquareGridVisualRefs {
  root: Reference<Node>;
  gridLines: Line[];
  dots: Circle[];
  dotOrder: number[];
  buddyLines: Line[];
  buddyLabels: Node[];
  centerDot: Reference<Circle>;
}

export interface SquareGridVisualProps {
  refs: SquareGridVisualRefs;
  extent: number;
  step: number;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  dotSize?: number;
  dotOpacity?: number;
  centerSize?: number;
  lineWidth?: number;
  lineOpacity?: number;
  buddyLineWidth?: number;
  showBuddyLabels?: boolean;
  buddyLabelFontSize?: number;
  buddyLabelBackgroundSize?: number;
}

export function createSquareGridVisualRefs(): SquareGridVisualRefs {
  return {
    root: createRef<Node>(),
    gridLines: [],
    dots: [],
    dotOrder: [],
    buddyLines: [],
    buddyLabels: [],
    centerDot: createRef<Circle>(),
  };
}

export function squareGridCoordinates(extent: number) {
  return Array.from({ length: extent * 2 + 1 }, (_, index) => index - extent);
}

export function cardinalBuddies(step: number): {
  name: BuddyName;
  point: Point;
  label: Point;
}[] {
  return [
    { name: 'N', point: [0, -step], label: [0, -step - 42] },
    { name: 'E', point: [step, 0], label: [step + 46, 0] },
    { name: 'W', point: [-step, 0], label: [-step - 46, 0] },
    { name: 'S', point: [0, step], label: [0, step + 44] },
  ];
}

export function SquareGridVisual({
  refs,
  extent,
  step,
  x = 0,
  y = 0,
  scale = 1,
  opacity = 1,
  dotSize = 14,
  dotOpacity = 1,
  centerSize = 9,
  lineWidth = 1,
  lineOpacity = 1,
  buddyLineWidth = 8,
  showBuddyLabels = false,
  buddyLabelFontSize = 38,
  buddyLabelBackgroundSize = 48,
}: SquareGridVisualProps) {
  refs.gridLines.length = 0;
  refs.dots.length = 0;
  refs.dotOrder.length = 0;
  refs.buddyLines.length = 0;
  refs.buddyLabels.length = 0;

  const coordinates = squareGridCoordinates(extent);
  const lineMin = -extent * step;
  const lineMax = extent * step;
  const dotData = coordinates.flatMap((gridX) =>
    coordinates.map((gridY) => ({
      x: gridX * step,
      y: gridY * step,
      sort: Math.hypot(gridX, gridY),
    })),
  );
  refs.dotOrder.push(
    ...[...dotData.keys()].sort((a, b) => dotData[a].sort - dotData[b].sort),
  );

  return (
    <Node ref={refs.root} x={x} y={y} scale={scale} opacity={opacity}>
      {coordinates.map((gridX, index) => (
        <Line
          ref={makeRef(refs.gridLines, index)}
          points={[
            [gridX * step, lineMin],
            [gridX * step, lineMax],
          ]}
          stroke={palette.grid}
          lineWidth={lineWidth}
          end={0}
          opacity={0}
        />
      ))}
      {coordinates.map((gridY, index) => (
        <Line
          ref={makeRef(refs.gridLines, coordinates.length + index)}
          points={[
            [lineMin, gridY * step],
            [lineMax, gridY * step],
          ]}
          stroke={palette.grid}
          lineWidth={lineWidth}
          end={0}
          opacity={0}
        />
      ))}
      {dotData.map(({ x: dotX, y: dotY }, index) => (
        <Circle
          ref={makeRef(refs.dots, index)}
          x={dotX}
          y={dotY}
          size={dotSize}
          fill={palette.dot}
          opacity={dotOpacity}
          scale={0}
        />
      ))}
      {cardinalBuddies(step).map(({ point }, index) => (
        <Line
          ref={makeRef(refs.buddyLines, index)}
          points={[[0, 0], point]}
          stroke={palette.accent}
          lineWidth={buddyLineWidth}
          lineCap={'round'}
          end={0}
        />
      ))}
      <Circle
        ref={refs.centerDot}
        x={0}
        y={0}
        size={centerSize}
        fill={palette.focus}
        scale={0}
      />
      {showBuddyLabels &&
        cardinalBuddies(step).map(({ name, label }, index) => (
          <Node
            ref={makeRef(refs.buddyLabels, index)}
            x={label[0]}
            y={label[1]}
            opacity={0}
            scale={0}
          >
            <Circle size={buddyLabelBackgroundSize} fill={palette.background} />
            <PolyLatex
              tex={`\\mathrm{${name}}`}
              fontSize={buddyLabelFontSize}
              fill={palette.text}
            />
          </Node>
        ))}
    </Node>
  );
}

export function* revealSquareGrid(refs: SquareGridVisualRefs) {
  yield* all(
    sequence(
      0.015,
      ...refs.gridLines.map((line) =>
        all(line.opacity(1, 0.25, easeOutCubic), line.end(1, 0.75, easeInOutCubic)),
      ),
    ),
    sequence(
      0.004,
      ...refs.dotOrder.map((index) => refs.dots[index].scale(1, 0.24, easeOutCubic)),
    ),
  );
}

interface CardinalBuddyRevealOptions {
  labels?: boolean;
}

export function* revealCardinalBuddies(
  refs: SquareGridVisualRefs,
  { labels = false }: CardinalBuddyRevealOptions = {},
) {
  yield* all(
    refs.centerDot().scale(1, 0.22, easeOutCubic),
    sequence(
      0.16,
      ...refs.buddyLines.map((line, index) =>
        all(
          line.end(1, 0.42, easeInOutCubic),
          ...(labels && refs.buddyLabels[index]
            ? [
                refs.buddyLabels[index].opacity(1, 0.22, easeOutCubic),
                refs.buddyLabels[index].scale(1, 0.24, easeOutCubic),
              ]
            : []),
        ),
      ),
    ),
  );
}
