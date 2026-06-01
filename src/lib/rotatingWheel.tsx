import { Circle, Line, Node } from '@motion-canvas/2d';
import {
  Reference,
  ThreadGenerator,
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
} from '@motion-canvas/core';

import { palette } from './palette';
import { colorFor, rotationFor, toScreen, type Point } from './pythagoreanGridScene';

export interface WheelStyle {
  rayWidth: number;
  endpointSize: number;
  activeLineWidth: number;
  activeEndSize: number;
  endpointStroke?: boolean;
}

export interface WheelOptions {
  directions: Point[];
  step: number;
  style: WheelStyle;
  armLength?: number;
}

export interface RevealOptions {
  duration: number;
  opacity: number;
  endDuration?: number;
  instantEnd?: boolean;
}

export class RotatingWheel {
  readonly directions: Point[];
  readonly step: number;
  readonly rays: Line[] = [];
  readonly endpoints: Circle[] = [];
  readonly active: Reference<Node> = createRef<Node>();
  readonly activeLine: Reference<Line> = createRef<Line>();
  readonly activeEnd: Reference<Circle> = createRef<Circle>();
  readonly view: Node;

  constructor(opts: WheelOptions) {
    this.directions = opts.directions;
    this.step = opts.step;
    const [fx, fy] = opts.directions[0];
    const armLength = opts.armLength ?? opts.step * Math.hypot(fx, fy);
    this.view = this.build(armLength, opts.style);
  }

  private build(armLength: number, style: WheelStyle): Node {
    const { directions, step } = this;
    const total = directions.length;
    const firstColor = colorFor(0, total);
    const endpointStrokeWidth = style.endpointStroke ? 2.5 : 0;
    const endpointStroke = style.endpointStroke ? palette.background : undefined;

    return (
      <Node>
        {directions.map(([dx, dy], index) => (
          <Line
            ref={makeRef(this.rays, index)}
            points={[
              [0, 0],
              toScreen(dx, dy, step),
            ]}
            stroke={colorFor(index, total)}
            lineWidth={style.rayWidth}
            lineCap={'round'}
            opacity={0}
            end={0}
          />
        ))}
        {directions.map(([dx, dy], index) => (
          <Circle
            ref={makeRef(this.endpoints, index)}
            x={dx * step}
            y={-dy * step}
            size={style.endpointSize}
            fill={colorFor(index, total)}
            stroke={endpointStroke}
            lineWidth={endpointStrokeWidth}
            opacity={0}
            scale={0}
          />
        ))}
        <Node ref={this.active} opacity={0}>
          <Line
            ref={this.activeLine}
            points={[
              [0, 0],
              [armLength, 0],
            ]}
            stroke={firstColor}
            lineWidth={style.activeLineWidth}
            lineCap={'round'}
          />
          <Circle
            ref={this.activeEnd}
            x={armLength}
            size={style.activeEndSize}
            fill={firstColor}
            stroke={palette.background}
            lineWidth={3}
          />
        </Node>
      </Node>
    );
  }

  *rotateArmTo(index: number, duration: number): ThreadGenerator {
    const color = colorFor(index, this.directions.length);
    yield* all(
      this.active().rotation(
        rotationFor(this.directions[index]),
        duration,
        easeInOutCubic,
      ),
      this.activeLine().stroke(color, duration),
      this.activeEnd().fill(color, duration),
    );
  }

  *revealRay(index: number, opts: RevealOptions): ThreadGenerator {
    const { duration, opacity, instantEnd } = opts;
    const endDuration = opts.endDuration ?? duration * 1.5;
    if (instantEnd) {
      this.rays[index].end(1);
    }
    yield* all(
      this.rays[index].opacity(opacity, duration, easeOutCubic),
      ...(instantEnd
        ? []
        : [this.rays[index].end(1, endDuration, easeInOutCubic)]),
      this.endpoints[index].opacity(1, duration, easeOutCubic),
      this.endpoints[index].scale(1, duration, easeOutCubic),
    );
  }

  *fadeOut(duration: number): ThreadGenerator {
    yield* all(
      ...this.rays.map((ray) => ray.opacity(0, duration, easeInOutCubic)),
      ...this.endpoints.map((endpoint) =>
        endpoint.opacity(0, duration, easeInOutCubic),
      ),
    );
  }

  reset(): void {
    this.active().rotation(rotationFor(this.directions[0]));
    const firstColor = colorFor(0, this.directions.length);
    this.activeLine().stroke(firstColor);
    this.activeEnd().fill(firstColor);
    for (const ray of this.rays) {
      ray.opacity(0);
      ray.end(0);
    }
    for (const endpoint of this.endpoints) {
      endpoint.opacity(0);
      endpoint.scale(0);
    }
  }

  showAll(): void {
    for (const ray of this.rays) {
      ray.end(1);
    }
  }
}
