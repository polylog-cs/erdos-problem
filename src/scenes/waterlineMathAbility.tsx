import { Img, Line, Node, Rect } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  createSignal,
  delay,
  easeInOutCubic,
  easeOutCubic,
  linear,
  makeRef,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import vrHeadAlarmed from '../assets/images/vr/with_border/alarmed.png';
import vrHeadNeutral from '../assets/images/vr/with_border/neutral.png';
import { Solarized } from '../utilities/color';
import { PolyTxt } from '../utilities/text';

const chartLeft = -900;
const chartRight = 300;
const chartWidth = chartRight - chartLeft;
const axisX = -520;
const axisTop = -330;
const axisBottom = 340;
const waterBottom = 440;
const headX = 105;
const headY = 76;
const headWidth = 225;

const levels = [
  {label: 'undergrad thesis', y: 278},
  {label: 'diploma thesis', y: 175},
  {label: 'average paper', y: 48},
  {label: 'cool paper', y: -100},
  {label: 'unit distance conjecture', y: -268},
] as const;

const wavePoints = Array.from({length: 97}, (_, index) => {
  const x = chartLeft + (chartWidth * index) / 96;
  const y = Math.sin(((x - chartLeft) / 180) * Math.PI * 2) * 8;
  return [x, y] as [number, number];
});

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const axis = createRef<Line>();
  const water = createRef<Rect>();
  const waterOverlay = createRef<Rect>();
  const waterSurface = createRef<Line>();
  const waterlineCallout = createRef<Node>();
  const cheapLabel = createRef<Node>();
  const head = createRef<Node>();
  const neutralHead = createRef<Img>();
  const alarmedHead = createRef<Img>();
  const unitConjectureLabel = createRef<PolyTxt>();

  const tickRefs: Line[] = [];
  const guideRefs: Line[] = [];
  const labelRefs: PolyTxt[] = [];
  const waterLevel = createSignal(waterBottom);

  view.add(
    <>
      <Rect
        ref={water}
        x={(chartLeft + chartRight) / 2}
        y={() => (waterLevel() + waterBottom) / 2}
        width={chartWidth}
        height={() => waterBottom - waterLevel()}
        fill={Solarized.blue}
        opacity={0}
        zIndex={0}
      />
      <Node ref={head} x={headX} y={headY} opacity={0} scale={0.86} zIndex={3}>
        <Img ref={neutralHead} src={vrHeadNeutral} width={headWidth} />
        <Img
          ref={alarmedHead}
          src={vrHeadAlarmed}
          width={headWidth}
          opacity={0}
        />
      </Node>
      <Rect
        ref={waterOverlay}
        x={(chartLeft + chartRight) / 2}
        y={() => (waterLevel() + waterBottom) / 2}
        width={chartWidth}
        height={() => waterBottom - waterLevel()}
        fill={Solarized.blue}
        opacity={0}
        zIndex={4}
      />
      <Line
        ref={waterSurface}
        points={wavePoints}
        y={() => waterLevel()}
        stroke={Solarized.blue}
        lineWidth={7}
        lineCap={'round'}
        lineJoin={'round'}
        opacity={0}
        zIndex={8}
      />

      {levels.map((level, index) => (
        <Line
          ref={makeRef(guideRefs, index)}
          points={[
            [axisX + 28, level.y],
            [chartRight - 38, level.y],
          ]}
          stroke={Solarized.base1}
          lineWidth={2}
          lineDash={[12, 18]}
          opacity={0.42}
          zIndex={1}
        />
      ))}
      <Line
        ref={axis}
        points={[
          [axisX, axisBottom],
          [axisX, axisTop],
        ]}
        stroke={Solarized.base01}
        lineWidth={5}
        lineCap={'round'}
        end={1}
        zIndex={5}
      />
      {levels.map((level, index) => (
        <Line
          ref={makeRef(tickRefs, index)}
          points={[
            [axisX - 24, level.y],
            [axisX + 24, level.y],
          ]}
          stroke={Solarized.base01}
          lineWidth={5}
          lineCap={'round'}
          opacity={1}
          scale={1}
          zIndex={5}
        />
      ))}
      {levels.map((level, index) => (
        <PolyTxt
          ref={(node) => {
            makeRef(labelRefs, index)(node);
            if (level.label === 'unit distance conjecture') {
              unitConjectureLabel(node);
            }
          }}
          text={level.label}
          x={axisX + 74}
          y={level.y}
          offsetX={-1}
          fontSize={42}
          fill={Solarized.base00}
          opacity={1}
          zIndex={6}
        />
      ))}

      <Node
        ref={waterlineCallout}
        y={() => waterLevel()}
        opacity={0}
        zIndex={7}
      >
        <PolyTxt
          text={'waterline'}
          x={axisX - 166}
          y={-38}
          fontSize={39}
          fill={Solarized.blue}
        />
      </Node>

      <Node
        ref={cheapLabel}
        y={() => Math.min(waterLevel() + 105, 325)}
        opacity={0}
        zIndex={7}
      >
        <Rect
          x={axisX - 205}
          width={370}
          height={74}
          radius={8}
          fill={Solarized.base3}
          stroke={Solarized.blue}
          lineWidth={3}
          opacity={0.9}
        />
        <PolyTxt
          text={'cheap to produce'}
          x={axisX - 205}
          fontSize={39}
          fill={Solarized.blue}
        />
      </Node>
    </>,
  );

  yield* waitFor(5);

  yield* all(
    water().opacity(0.24, 0.35, easeOutCubic),
    waterOverlay().opacity(0.14, 0.35, easeOutCubic),
    waterSurface().opacity(1, 0.35, easeOutCubic),
    head().opacity(1, 0.35, easeOutCubic),
    head().scale(1, 0.35, easeOutCubic),
    waterLevel(levels[1].y + 18, 1.2, easeInOutCubic),
  );
  yield* all(
    waterlineCallout().opacity(1, 0.35, easeOutCubic),
    cheapLabel().opacity(1, 0.35, easeOutCubic),
  );
  yield* waitFor(2.2);

  yield* all(
    unitConjectureLabel().fill(Solarized.red, 0.28, easeInOutCubic),
    unitConjectureLabel().scale(1.08, 0.28, easeInOutCubic),
  );
  yield* waitFor(5);
  yield* all(
    unitConjectureLabel().fill(Solarized.base00, 0.28, easeInOutCubic),
    unitConjectureLabel().scale(1, 0.28, easeInOutCubic),
  );
  yield* waitFor(5);

  yield* waterLevel(132, 2.6, linear);
  yield* all(
    neutralHead().opacity(0, 0.28, easeInOutCubic),
    alarmedHead().opacity(1, 0.28, easeInOutCubic),
    head().rotation(-4, 0.28, easeInOutCubic),
  );
  yield* waterLevel(levels[2].y + 6, 5.9, linear);
  yield* waitFor(0.5);

  yield* waterLevel(levels[3].y + 2, 7.6, linear);
  yield* waitFor(0.4);

  yield* all(
    waterLevel(levels[4].y + 10, 9.6, linear),
    delay(7.8, unitConjectureLabel().fill(Solarized.red, 0.8, easeInOutCubic)),
    delay(7.8, unitConjectureLabel().scale(1.08, 0.8, easeInOutCubic)),
  );
  yield* waitFor(5);
});
