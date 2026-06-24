import { Line, Node, NodeProps } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  easeOutCubic,
  easeOutElastic,
  linear,
  SignalValue,
  SimpleSignal,
  Vector2,
  waitFor,
} from '@motion-canvas/core';
import chroma from 'chroma-js';

import { CyclotomicPoint, generateCyclotomicWindow } from '../lib/cyclotomicWindow';
import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';

const window21 = generateCyclotomicWindow(21, 44);
const maxRadius = Math.max(
  ...window21.points.map((point) => Math.hypot(point.x, point.y)),
);
const centerOutPoints = [...window21.points].sort((a, b) => {
  const radiusA = Math.hypot(a.x, a.y);
  const radiusB = Math.hypot(b.x, b.y);
  return radiusA - radiusB || a.spiralProgress - b.spiralProgress || a.id - b.id;
});

// Inverse of easeInOutCubic: given an eased value y in [0, 1], return the
// linear-time input x that produces it. Used to recover, in linear time, when
// each point's reveal front passes it.
function easeInOutCubicInverse(y: number): number {
  if (y <= 0) return 0;
  if (y >= 1) return 1;
  if (y < 0.5) {
    return Math.cbrt(y / 4);
  }
  return 1 - Math.cbrt(2 * (1 - y)) / 2;
}

interface CyclotomicPointCloudProps extends NodeProps {
  points: CyclotomicPoint[];
  unitScale?: SignalValue<number>;
  progress?: SignalValue<number>;
  radius?: SignalValue<number>;
}

class CyclotomicPointCloud extends Node {
  public readonly unitScale: SimpleSignal<number, this>;
  public readonly progress: SimpleSignal<number, this>;
  public readonly radius: SimpleSignal<number, this>;

  private readonly points: CyclotomicPoint[];

  public constructor({
    points,
    unitScale,
    progress,
    radius,
    ...props
  }: CyclotomicPointCloudProps) {
    super(props);
    this.points = points;
    this.unitScale = createSignal(unitScale ?? 1);
    this.progress = createSignal(progress ?? 0);
    this.radius = createSignal(radius ?? 5);
  }

  protected override draw(context: CanvasRenderingContext2D) {
    context.save();
    this.drawPoints(context, this.progress(), this.unitScale(), this.radius());
    context.restore();

    this.drawChildren(context);
  }

  private drawPoints(
    context: CanvasRenderingContext2D,
    progress: number,
    scale: number,
    radius: number,
  ) {
    if (progress <= 0) {
      return;
    }

    const total = this.points.length;
    // `progress` advances linearly in time; we ease only the reveal *front* so
    // the spatial reveal stays eased while each point's bounce — measured in
    // linear time below — lasts a constant wall-clock duration.
    const front = total * easeInOutCubic(progress);
    const count = Math.min(Math.ceil(front), total);

    // Bounce/fade durations as fractions of the (linear) progress, i.e.
    // constant in wall-clock time regardless of where we are in the easing.
    const bounceWindow = 0.02;
    const baseRadius = radius;
    const baseColor = chroma(Solarized.base02);
    const highlightColor = chroma(palette.accent);

    for (let index = 0; index < count; index++) {
      const point = this.points[index];
      // The linear-time progress at which this point's reveal front passes it.
      const appearProgress = easeInOutCubicInverse(index / total);
      // age in linear-time units → bounce speed is independent of the easing.
      const age = progress - appearProgress;
      if (age <= 0) {
        continue;
      }
      const t = Math.min(age / bounceWindow, 1);
      const radius = baseRadius * easeOutElastic(t);
      const pt = new Vector2(point.x, point.y);
      //const col = baseColor;
      const col = chroma.oklch(0.7, 0.4, pt.degrees * 2);
      const rad = (radius * Math.log2(pt.squaredMagnitude + 3)) / 2;
      context.fillStyle = chroma.mix(highlightColor, col, t, 'rgb').hex();
      context.beginPath();
      context.arc(
        point.x * scale,
        -point.y * scale,
        Math.max(rad, 0.01),
        0,
        2 * Math.PI,
      );
      context.fill();
    }
  }
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const cloud = createRef<CyclotomicPointCloud>();

  view.add(
    <CyclotomicPointCloud
      ref={cloud}
      points={centerOutPoints.slice(0, 15000)}
      unitScale={4000}
      radius={10}
    />,
  );
  view.add(<PolyLatex tex={'n^{1 + \\varepsilon}'} fontSize={300} x={-580} y={-330} />);
  //view.add(<Line points={[[0, 0], [100, 100]]} lineWidth={50} stroke={Solarized.text} />);

  const t = 0;

  yield* all(
    // Linear in time: the reveal easing is applied inside draw() so that each
    // point's bounce keeps a constant wall-clock duration.
    cloud().progress(1, t, linear),
    cloud().unitScale(250, t, easeOutCubic),
    cloud().position([600, 0], t, easeInOutCubic),
    cloud().radius(3, t, easeOutCubic),
  );
  yield* waitFor(0.8);
});
