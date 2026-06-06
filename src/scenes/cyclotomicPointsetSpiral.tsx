import { Node, NodeProps } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  createSignal,
  easeInOutCubic,
  SimpleSignal,
  SignalValue,
  waitFor,
} from '@motion-canvas/core';

import {
  CyclotomicPoint,
  generateCyclotomicWindow,
} from '../lib/cyclotomicWindow';
import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';

const window21 = generateCyclotomicWindow(21, 44);
const maxRadius = Math.max(...window21.points.map((point) => Math.hypot(point.x, point.y)));
const centerOutPoints = [...window21.points].sort((a, b) => {
  const radiusA = Math.hypot(a.x, a.y);
  const radiusB = Math.hypot(b.x, b.y);
  return radiusA - radiusB || a.spiralProgress - b.spiralProgress || a.id - b.id;
});

interface CyclotomicPointCloudProps extends NodeProps {
  points: CyclotomicPoint[];
  unitScale?: SignalValue<number>;
  progress?: SignalValue<number>;
}

class CyclotomicPointCloud extends Node {
  public readonly unitScale: SimpleSignal<number, this>;
  public readonly progress: SimpleSignal<number, this>;

  private readonly points: CyclotomicPoint[];

  public constructor({ points, unitScale, progress, ...props }: CyclotomicPointCloudProps) {
    super(props);
    this.points = points;
    this.unitScale = createSignal(unitScale ?? 1);
    this.progress = createSignal(progress ?? 0);
  }

  protected override draw(context: CanvasRenderingContext2D) {
    const progress = this.progress();
    const scale = this.unitScale();
    const visibleCount = Math.floor(this.points.length * progress);

    context.save();
    this.drawPoints(context, visibleCount, scale);
    context.restore();

    this.drawChildren(context);
  }

  private drawPoints(context: CanvasRenderingContext2D, count: number, scale: number) {
    if (count <= 0) {
      return;
    }

    const radius = 2.25;
    context.fillStyle = Solarized.base02;
    context.globalAlpha = 0.84;
    context.beginPath();
    for (let index = 0; index < count; index++) {
      const point = this.points[index];
      context.moveTo(point.x * scale + radius, -point.y * scale);
      context.arc(point.x * scale, -point.y * scale, radius, 0, 2 * Math.PI);
    }
    context.fill();
  }
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const cloud = createRef<CyclotomicPointCloud>();

  view.add(
    <CyclotomicPointCloud
      ref={cloud}
      points={centerOutPoints}
      unitScale={1400}
    />,
  );

  yield* all(
    cloud().progress(1, 10, easeInOutCubic),
    cloud().unitScale(116, 10, easeInOutCubic),
    cloud().position([0, 0], 10, easeInOutCubic),
  );
  yield* waitFor(0.8);
});
