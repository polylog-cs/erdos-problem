import { Circle, Line, Node } from '@motion-canvas/2d';
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

import { PolyLatex } from '../utilities/latex';
import { palette } from './palette';

export type Point = [number, number];

export function colorFor(index: number, total: number) {
  return `hsl(${Math.round((360 * index) / total)}, 64%, 54%)`;
}

export function toScreen(dx: number, dy: number, step: number): Point {
  return [dx * step, -dy * step];
}

export function pythagoreanDirections(distance: number) {
  const directions: Point[] = [];

  for (let dx = -distance; dx <= distance; dx++) {
    for (let dy = -distance; dy <= distance; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      if (dx * dx + dy * dy === distance * distance) {
        directions.push([dx, dy]);
      }
    }
  }

  return directions.sort(
    ([ax, ay], [bx, by]) => Math.atan2(-ay, ax) - Math.atan2(-by, bx),
  );
}

export function undirectedDirections(distance: number) {
  return pythagoreanDirections(distance).filter(([dx, dy]) => {
    if (dy > 0) {
      return true;
    }

    return dy === 0 && dx > 0;
  });
}

export function latticeDots(extent: number, every = 1) {
  const dots: Point[] = [];

  for (let x = -extent; x <= extent; x += every) {
    for (let y = -extent; y <= extent; y += every) {
      dots.push([x, y]);
    }
  }

  return dots;
}

export function gridSegmentsForDirection([dx, dy]: Point, extent: number) {
  const segments: [Point, Point][] = [];

  for (let x = -extent; x <= extent; x++) {
    for (let y = -extent; y <= extent; y++) {
      const endX = x + dx;
      const endY = y + dy;

      if (Math.abs(endX) <= extent && Math.abs(endY) <= extent) {
        segments.push([
          [x, y],
          [endX, endY],
        ]);
      }
    }
  }

  return segments;
}

interface StarSceneOptions {
  distance: number;
  extent: number;
  step: number;
  dotEvery?: number;
  dotSize: number;
  lineWidth: number;
  endpointSize: number;
  label: string;
}

export function createPythagoreanStarScene({
  distance,
  extent,
  step,
  dotEvery = 1,
  dotSize,
  lineWidth,
  endpointSize,
  label,
}: StarSceneOptions) {
  return makeScene2D(function* (view) {
    view.fill(palette.background);

    const root = createRef<Node>();
    const dotLayer = createRef<Node>();
    const rays: Line[] = [];
    const endpoints: Circle[] = [];
    const center = createRef<Circle>();
    const directions = pythagoreanDirections(distance);

    view.add(
      <Node ref={root} y={-35}>
        <Node ref={dotLayer} opacity={0}>
          {latticeDots(extent, dotEvery).map(([x, y]) => (
            <Circle
              x={x * step}
              y={-y * step}
              size={dotSize}
              fill={palette.dot}
              opacity={dotEvery === 1 ? 0.95 : 0.42}
            />
          ))}
        </Node>
        {directions.map(([dx, dy], index) => (
          <Line
            ref={makeRef(rays, index)}
            points={[[0, 0], toScreen(dx, dy, step)]}
            stroke={colorFor(index, directions.length)}
            lineWidth={lineWidth}
            lineCap={'round'}
            end={0}
          />
        ))}
        {directions.map(([dx, dy], index) => (
          <Circle
            ref={makeRef(endpoints, index)}
            x={dx * step}
            y={-dy * step}
            size={endpointSize}
            fill={colorFor(index, directions.length)}
            scale={0}
          />
        ))}
        <Circle
          ref={center}
          size={endpointSize + 3}
          fill={palette.focus}
          stroke={palette.background}
          lineWidth={3}
          scale={0}
        />
      </Node>,
    );

    view.add(<PolyLatex y={325} tex={label} fontSize={36} />);

    yield* dotLayer().opacity(1, 0.45, easeOutCubic);
    yield* center().scale(1, 0.25, easeOutCubic);
    yield* sequence(
      distance === 65 ? 0.025 : 0.055,
      ...rays.map((ray, index) =>
        all(
          ray.end(1, 0.45, easeInOutCubic),
          endpoints[index].scale(1, 0.25, easeOutCubic),
        ),
      ),
    );

    yield* all(
      center().scale(1.28, 0.18, easeOutCubic),
      ...rays.map((ray) => ray.lineWidth(lineWidth + 1.5, 0.18, easeOutCubic)),
    );
    yield* all(
      center().scale(1, 0.25, easeInOutCubic),
      ...rays.map((ray) => ray.lineWidth(lineWidth, 0.25, easeInOutCubic)),
    );

    yield* waitFor(1.2);
  });
}

interface AllEdgesSceneOptions {
  distance: number;
  extent: number;
  step: number;
  dotSize: number;
  label: string;
}

export function createAllEdgesSweepScene({
  distance,
  extent,
  step,
  dotSize,
  label,
}: AllEdgesSceneOptions) {
  return makeScene2D(function* (view) {
    view.fill(palette.background);

    const root = createRef<Node>();
    const directionGroups: Node[] = [];
    const directions = undirectedDirections(distance);
    const dots = latticeDots(extent);

    view.add(
      <Node ref={root} y={-35}>
        {directions.map((direction, directionIndex) => (
          <Node ref={makeRef(directionGroups, directionIndex)} opacity={0}>
            {gridSegmentsForDirection(direction, extent).map(([from, to]) => (
              <Line
                points={[toScreen(...from, step), toScreen(...to, step)]}
                stroke={colorFor(directionIndex, directions.length)}
                lineWidth={1.8}
                lineCap={'round'}
                opacity={0.72}
              />
            ))}
          </Node>
        ))}
        {dots.map(([x, y]) => (
          <Circle x={x * step} y={-y * step} size={dotSize} fill={palette.dot} />
        ))}
      </Node>,
    );

    view.add(<PolyLatex y={325} tex={label} fontSize={36} />);

    yield* sequence(
      0.18,
      ...directionGroups.map((group) =>
        all(
          group.opacity(1, 0.28, easeOutCubic),
          root().scale(1.012, 0.28, easeOutCubic),
        ),
      ),
    );

    yield* root().scale(1, 0.25, easeInOutCubic);
    yield* waitFor(1.35);
  });
}
