import { Circle, Img, Line, Node, Rect } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';

import openAiLogo from '../assets/images/logos/openai-logo.svg';
import erdosPhoto from '../assets/images/people/erdos2.jpg';
import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';

type TickName = 'linear' | 'gpt' | 'threeHalves' | 'quadratic';

const axisY = 90;
const tickX: Record<TickName, number> = {
  linear: -520,
  gpt: -245,
  threeHalves: 125,
  quadratic: 520,
};

function bubble(
  text: string,
  width: number,
  height: number,
  fontSize = 34,
  fill = '#fdf6e3',
  tail: 'bottomLeft' | 'left' = 'bottomLeft',
) {
  const tailPoints: Record<
    'bottomLeft' | 'left',
    [[number, number], [number, number], [number, number]]
  > = {
    bottomLeft: [
      [-width * 0.3, height / 2 - 5],
      [-width * 0.47, height / 2 + 54],
      [-width * 0.16, height / 2 - 5],
    ],
    left: [
      [-width / 2 + 8, -24],
      [-width / 2 - 70, 0],
      [-width / 2 + 8, 24],
    ],
  };

  return (
    <Node>
      <Line
        points={tailPoints[tail]}
        fill={fill}
        stroke={Solarized.base1}
        lineWidth={0}
        closed
        lineJoin={'round'}
      />
      <Rect
        width={width}
        height={height}
        radius={height / 2}
        fill={fill}
        stroke={Solarized.base1}
        lineWidth={0}
      />
      <PolyLatex tex={text} fontSize={fontSize} fill={Solarized.background} />
    </Node>
  );
}

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const axis = createRef<Line>();
  const impossibleSegment = createRef<Line>();
  const gptSegment = createRef<Line>();
  const impossible = createRef<PolyLatex>();
  const erdos = createRef<Node>();
  const erdosBubble = createRef<Node>();
  const gpt = createRef<Node>();
  const gptBubble = createRef<Node>();
  const ticks: Line[] = [];
  const labels: Partial<Record<TickName, PolyLatex>> = {};

  view.add(
    <>
      <Line
        ref={axis}
        points={[
          [tickX.linear, axisY],
          [tickX.quadratic, axisY],
        ]}
        stroke={Solarized.base00}
        lineWidth={5}
        lineCap={'round'}
        end={0}
      />
      <Line
        ref={impossibleSegment}
        points={[
          [tickX.threeHalves, axisY],
          [tickX.quadratic, axisY],
        ]}
        stroke={Solarized.red}
        lineWidth={12}
        lineCap={'round'}
        opacity={0}
        end={0}
      />
      <Line
        ref={gptSegment}
        points={[
          [tickX.linear, axisY],
          [tickX.gpt, axisY],
        ]}
        stroke={Solarized.red}
        lineWidth={12}
        lineCap={'round'}
        opacity={0}
        end={0}
      />
      {(['linear', 'gpt', 'threeHalves', 'quadratic'] as TickName[]).map(
        (name, index) => (
          <Line
            ref={makeRef(ticks, index)}
            points={[
              [tickX[name], axisY - 26],
              [tickX[name], axisY + 26],
            ]}
            stroke={Solarized.base00}
            lineWidth={4}
            lineCap={'round'}
            opacity={name === 'gpt' || name === 'threeHalves' ? 0 : 1}
            scale={name === 'gpt' || name === 'threeHalves' ? 0 : 1}
          />
        ),
      )}
      <PolyLatex
        ref={(node) => {
          labels.linear = node;
        }}
        tex={'n'}
        x={tickX.linear}
        y={axisY + 105}
        fontSize={100}
        opacity={0}
      />
      <PolyLatex
        ref={(node) => {
          labels.gpt = node;
        }}
        tex={'n^{1.014}'}
        x={tickX.gpt}
        y={axisY + 85}
        fontSize={100}
        opacity={0}
      />
      <PolyLatex
        ref={(node) => {
          labels.threeHalves = node;
        }}
        tex={'n^{3/2}'}
        x={tickX.threeHalves}
        y={axisY + 85}
        fontSize={100}
        opacity={0}
      />
      <PolyLatex
        ref={(node) => {
          labels.quadratic = node;
        }}
        tex={'n^2'}
        x={tickX.quadratic}
        y={axisY + 85}
        fontSize={100}
        opacity={0}
      />

      <Node ref={erdos} x={305} y={-225} opacity={0} scale={0.85}>
        <Img
          src={erdosPhoto}
          width={269 * 1.3}
          height={298 * 1.3}
          radius={16}
          stroke={Solarized.base1}
          lineWidth={0}
        />
      </Node>
      <Node ref={erdosBubble} x={-205} y={-355} opacity={0} scale={0.7}>
        {bubble(
          "\\text{It's probably }n\\text{-ish}",
          470,
          120,
          40,
          Solarized.base02,
          'bottomLeft',
        )}
      </Node>

      <Node ref={gpt} x={30} y={-240} opacity={0} scale={0.65}>
        <Circle
          size={225}
          fill={Solarized.base3}
          stroke={Solarized.base1}
          lineWidth={5}
        />
        <Img src={openAiLogo} width={154} />
      </Node>
      <Node ref={gptBubble} x={450} y={-235} opacity={0} scale={0.7}>
        {bubble(
          '\\text{actually, at least }n^{1.014}',
          530,
          120,
          40,
          Solarized.base02,
          'left',
        )}
      </Node>

      <PolyLatex
        ref={impossible}
        tex={'\\mathrm{Impossible}'}
        x={320}
        y={axisY - 68}
        fontSize={54}
        fill={Solarized.red}
        opacity={0}
      />
    </>,
  );

  yield* all(
    axis().end(1, 0.8, easeInOutCubic),
    delay(0.2, labels.linear!.opacity(1, 0.35, easeOutCubic)),
    delay(0.2, labels.quadratic!.opacity(1, 0.35, easeOutCubic)),
  );
  yield* waitFor(0.35);

  yield* all(
    ticks[2].opacity(1, 0.25, easeOutCubic),
    ticks[2].scale(1, 0.25, easeOutCubic),
    labels.threeHalves!.opacity(1, 0.35, easeOutCubic),
    erdos().opacity(1, 0.45, easeOutCubic),
    erdos().scale(1, 0.45, easeOutCubic),
  );
  yield* waitFor(0.2);

  yield* all(
    impossibleSegment().opacity(1, 0.18, easeOutCubic),
    impossibleSegment().end(1, 0.65, easeInOutCubic),
    delay(0.24, impossible().opacity(1, 0.35, easeOutCubic)),
  );
  yield* waitFor(0.65);

  yield* all(
    erdos().position([tickX.linear - 18, -220], 0.9, easeInOutCubic),
    erdos().scale(0.94, 0.9, easeInOutCubic),
    impossible().opacity(0, 0.25, easeInOutCubic),
    impossibleSegment().opacity(0.42, 0.35, easeInOutCubic),
  );
  yield* all(
    erdosBubble().opacity(1, 0.35, easeOutCubic),
    erdosBubble().scale(1, 0.35),
  );
  yield* waitFor(0.75);

  yield* all(
    erdosBubble().opacity(0, 0.22, easeInOutCubic),
    erdosBubble().scale(0.92, 0.22, easeInOutCubic),
    erdos().opacity(0, 0.25, easeInOutCubic),
    erdos().scale(0.82, 0.25, easeInOutCubic),
    ticks[1].opacity(1, 0.25, easeOutCubic),
    ticks[1].scale(1, 0.25, easeOutCubic),
    labels.gpt!.opacity(1, 0.35, easeOutCubic),
    gpt().opacity(1, 0.4, easeOutCubic),
    gpt().scale(1, 0.4, easeOutCubic),
  );
  yield* waitFor(0.15);

  yield* all(
    gptSegment().opacity(1, 0.18, easeOutCubic),
    gptSegment().end(1, 0.6, easeInOutCubic),
    delay(
      0.18,
      sequence(0.08, gptBubble().opacity(1, 0.35), gptBubble().scale(1, 0.35)),
    ),
  );
  yield* waitFor(1.1);
});
