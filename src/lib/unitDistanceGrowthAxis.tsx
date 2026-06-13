import {Line, Node} from '@motion-canvas/2d';
import {createRef, type Reference} from '@motion-canvas/core';

import {Solarized} from '../utilities/color';
import {PolyLatex} from '../utilities/latex';

export type GrowthAxisTick = 'linear' | 'gpt' | 'threeHalves' | 'quadratic';

export const growthAxisTickOrder: GrowthAxisTick[] = [
  'linear',
  'gpt',
  'threeHalves',
  'quadratic',
];

export const growthAxisTickX: Record<GrowthAxisTick, number> = {
  linear: -520,
  gpt: -400,
  threeHalves: 125,
  quadratic: 520,
};

export const growthAxisTickTex: Record<GrowthAxisTick, string> = {
  linear: 'n',
  gpt: 'n^{1.014}',
  threeHalves: 'n^{3/2}',
  quadratic: 'n^2',
};

export interface GrowthAxisRefs {
  root: Reference<Node>;
  axis: Reference<Line>;
  ticks: Record<GrowthAxisTick, Reference<Line>>;
  labels: Record<GrowthAxisTick, Reference<PolyLatex>>;
}

export interface GrowthAxisProps {
  refs: GrowthAxisRefs;
  ticks?: readonly GrowthAxisTick[];
  x?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  tickHeight?: number;
  tickLineWidth?: number;
  axisLineWidth?: number;
  labelFontSize?: number;
  labelOffset?: number | Partial<Record<GrowthAxisTick, number>>;
  labelTex?: Partial<Record<GrowthAxisTick, string>>;
  initialVisibleTicks?: readonly GrowthAxisTick[];
  initialVisibleLabels?: readonly GrowthAxisTick[];
  visibleTickOpacity?: number;
  visibleLabelOpacity?: number;
}

export function createGrowthAxisRefs(): GrowthAxisRefs {
  return {
    root: createRef<Node>(),
    axis: createRef<Line>(),
    ticks: {
      linear: createRef<Line>(),
      gpt: createRef<Line>(),
      threeHalves: createRef<Line>(),
      quadratic: createRef<Line>(),
    },
    labels: {
      linear: createRef<PolyLatex>(),
      gpt: createRef<PolyLatex>(),
      threeHalves: createRef<PolyLatex>(),
      quadratic: createRef<PolyLatex>(),
    },
  };
}

function includesTick(ticks: readonly GrowthAxisTick[], tick: GrowthAxisTick) {
  return ticks.includes(tick);
}

function getLabelOffset(
  labelOffset: GrowthAxisProps['labelOffset'],
  tick: GrowthAxisTick,
) {
  if (typeof labelOffset === 'number') {
    return labelOffset;
  }

  return labelOffset?.[tick] ?? 88;
}

export function GrowthAxis({
  refs,
  ticks = growthAxisTickOrder,
  x = 0,
  y = 0,
  opacity = 1,
  scale = 1,
  tickHeight = 52,
  tickLineWidth = 4,
  axisLineWidth = 5,
  labelFontSize = 100,
  labelOffset = 88,
  labelTex = {},
  initialVisibleTicks = [],
  initialVisibleLabels = [],
  visibleTickOpacity = 1,
  visibleLabelOpacity = 1,
}: GrowthAxisProps) {
  const startTick = ticks[0];
  const endTick = ticks[ticks.length - 1];

  return (
    <Node ref={refs.root} x={x} y={y} opacity={opacity} scale={scale}>
      <Line
        ref={refs.axis}
        points={[
          [growthAxisTickX[startTick], 0],
          [growthAxisTickX[endTick], 0],
        ]}
        stroke={Solarized.base00}
        lineWidth={axisLineWidth}
        lineCap={'round'}
        end={0}
      />
      {ticks.map((tick) => {
        const visible = includesTick(initialVisibleTicks, tick);

        return (
          <Line
            ref={refs.ticks[tick]}
            points={[
              [growthAxisTickX[tick], -tickHeight / 2],
              [growthAxisTickX[tick], tickHeight / 2],
            ]}
            stroke={Solarized.base00}
            lineWidth={tickLineWidth}
            lineCap={'round'}
            opacity={visible ? visibleTickOpacity : 0}
            scale={visible ? 1 : 0}
          />
        );
      })}
      {ticks.map((tick) => (
        <PolyLatex
          ref={refs.labels[tick]}
          tex={labelTex[tick] ?? growthAxisTickTex[tick]}
          x={growthAxisTickX[tick]}
          y={getLabelOffset(labelOffset, tick)}
          fontSize={labelFontSize}
          opacity={
            includesTick(initialVisibleLabels, tick) ? visibleLabelOpacity : 0
          }
        />
      ))}
    </Node>
  );
}
