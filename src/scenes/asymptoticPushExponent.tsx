import { Line, Node, Rect } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';

// Exponent axis: e = 1 (n) on the left, e = 2 (n^2) on the right.
const xLeft = -640;
const xRight = 640;
const axisY = 180;
const bandTop = -220;
const bandMidY = (bandTop + axisY) / 2;
const bandHeight = axisY - bandTop;

function xForExp(e: number) {
  return xLeft + (e - 1) * (xRight - xLeft);
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const axis = createRef<Line>();
  const region = createRef<Rect>();
  const line = createRef<Line>();
  const word = createRef<PolyLatex>();
  const expLabel = createRef<PolyLatex>();
  const subtitle = createRef<PolyLatex>();
  const endTicks: Line[] = [];
  const endLabels: PolyLatex[] = [];

  // Exponent of the current "impossible" threshold; everything to its right is impossible.
  const thr = createSignal(1.5);
  const thrX = () => xForExp(thr());

  view.add(
    <>
      <Line
        ref={axis}
        points={[
          [xLeft, axisY],
          [xRight, axisY],
        ]}
        stroke={Solarized.base00}
        lineWidth={5}
        lineCap={'round'}
        end={0}
      />

      {/* Fixed endpoint ticks + labels: n and n^2 */}
      {(['n', 'n^2'] as const).map((tex, index) => (
        <Line
          ref={makeRef(endTicks, index)}
          points={[
            [index === 0 ? xLeft : xRight, axisY - 24],
            [index === 0 ? xLeft : xRight, axisY + 24],
          ]}
          stroke={Solarized.base00}
          lineWidth={4}
          lineCap={'round'}
          opacity={0}
        />
      ))}
      {(['n', 'n^2'] as const).map((tex, index) => (
        <PolyLatex
          ref={makeRef(endLabels, index)}
          tex={tex}
          x={index === 0 ? xLeft : xRight}
          y={axisY + 75}
          fontSize={70}
          fill={Solarized.base00}
          opacity={0}
        />
      ))}

      {/* Shaded "impossible" region: from the threshold to the right end. */}
      <Rect
        ref={region}
        x={xRight}
        offsetX={1}
        y={bandMidY}
        width={() => xRight - thrX()}
        height={bandHeight}
        fill={Solarized.red}
        opacity={0}
      />

      {/* The threshold line itself. */}
      <Line
        ref={line}
        points={[
          [0, bandTop],
          [0, axisY],
        ]}
        x={thrX}
        stroke={Solarized.red}
        lineWidth={9}
        lineCap={'round'}
        opacity={0}
      />

      {/* The verdict word, centered in the impossible region. */}
      <PolyLatex
        ref={word}
        tex={'\\text{Impossible}'}
        x={() => (thrX() + xRight) / 2}
        y={-110}
        fontSize={66}
        fill={Solarized.red}
        opacity={0}
      />

      {/* The current exponent, beside the middle of the threshold line. */}
      <PolyLatex
        ref={expLabel}
        tex={'n^{1.5}'}
        x={() => thrX() - 24}
        offsetX={1}
        y={bandMidY}
        fontSize={76}
        fill={Solarized.red}
        opacity={0}
      />

      <PolyLatex
        ref={subtitle}
        tex={'(\\text{for any } \\epsilon > 0)'}
        x={0}
        y={axisY + 165}
        fontSize={60}
        fill={Solarized.orange}
        opacity={0}
      />
    </>,
  );

  // Crossfade the threshold's exponent label to a new value over `dur`.
  function* relabel(tex: string, dur: number) {
    yield* expLabel().opacity(0, dur / 2, easeInOutCubic);
    expLabel().tex(tex);
    yield* expLabel().opacity(1, dur / 2, easeOutCubic);
  }

  // Crossfade the verdict word (Latex can't morph text), optionally recoloring.
  function* relabelWord(tex: string, fill: string, dur: number) {
    yield* word().opacity(0, dur / 2, easeInOutCubic);
    word().tex(tex);
    word().fill(fill);
    yield* word().opacity(1, dur / 2, easeOutCubic);
  }

  // --- Beat 1: the axis and the proven n^1.5 barrier (red, "Impossible"). ---
  yield* all(
    axis().end(1, 0.8, easeInOutCubic),
    delay(0.25, endTicks[0].opacity(1, 0.3, easeOutCubic)),
    delay(0.25, endTicks[1].opacity(1, 0.3, easeOutCubic)),
    delay(0.25, endLabels[0].opacity(1, 0.4, easeOutCubic)),
    delay(0.25, endLabels[1].opacity(1, 0.4, easeOutCubic)),
  );
  yield* waitFor(0.2);

  yield* all(
    line().opacity(1, 0.3, easeOutCubic),
    region().opacity(0.16, 0.5, easeOutCubic),
    expLabel().opacity(1, 0.4, easeOutCubic),
    delay(0.2, word().opacity(1, 0.45, easeOutCubic)),
  );
  yield* waitFor(1.4);

  // --- Beat 2: push the barrier down — n^1.4, then n^1.3 — speculatively. ---
  // First push also recolors red -> orange and turns the verdict into a question.
  yield* all(
    thr(1.4, 0.9, easeInOutCubic),
    relabel('n^{1.4}', 0.9),
    line().stroke(Solarized.orange, 0.9, easeInOutCubic),
    region().fill(Solarized.orange, 0.9, easeInOutCubic),
    expLabel().fill(Solarized.orange, 0.9, easeInOutCubic),
    relabelWord('\\text{Impossible?}', Solarized.orange, 0.9),
  );
  yield* waitFor(0.5);

  yield* all(thr(1.3, 0.8, easeInOutCubic), relabel('n^{1.3}', 0.8));
  yield* waitFor(0.7);

  // --- Beat 3: all the way down to n^{1+epsilon}. ---
  yield* all(
    thr(1.03, 1.1, easeInOutCubic),
    relabel('n^{1 + \\epsilon}', 1.1),
    delay(0.5, subtitle().opacity(1, 0.5, easeOutCubic)),
  );
  yield* waitFor(1.6);
});
