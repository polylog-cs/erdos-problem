import { Circle, Img, Line, Node, Rect } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

import openAiLogo from '../assets/images/logos/openai-logo.svg';
import erdosPhoto from '../assets/images/people/erdos2.jpg';
import {
  createGrowthAxisRefs,
  GrowthAxis,
  growthAxisTickX as tickX,
} from '../lib/unitDistanceGrowthAxis';
import { palette } from '../lib/palette';
import { Solarized } from '../utilities/color';
import { PolyLatex } from '../utilities/latex';

const sceneX = -320;
const axisY = 90;
const markerY = -105;

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

  const growthAxis = createGrowthAxisRefs();
  const impossibleSegment = createRef<Line>();
  const gptSegment = createRef<Line>();
  const unknownSegment = createRef<Line>();
  const upperBoundSegment = createRef<Line>();
  const impossible = createRef<PolyLatex>();
  const unknownLabel = createRef<PolyLatex>();
  const upperBoundMarker = createRef<PolyLatex>();
  const erdos = createRef<Node>();
  const erdosBubble = createRef<Node>();
  const gpt = createRef<Node>();
  const gptBubble = createRef<Node>();
  const openAiMarker = createRef<Node>();

  view.add(
    <Node x={sceneX}>
      <GrowthAxis
        refs={growthAxis}
        ticks={['linear', 'gpt', 'upperBound', 'threeHalves', 'quadratic']}
        y={axisY}
        initialVisibleTicks={['linear', 'quadratic']}
        labelOffset={{
          linear: 105,
          gpt: 105,
          upperBound: 105,
          threeHalves: 105,
          quadratic: 105,
        }}
        labelTex={{
          linear: '\\;\\;n^{\\phantom1}',
          gpt: '\\;\\;\\;\\;\\;\\;n^{1.01}',
          upperBound: '\\;\\;\\;\\;n^{4/3}',
          threeHalves: '\\;\\;\\;\\;n^{3/2}',
          quadratic: '\\;\\;n^2',
        }}
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
        zIndex={1}
      />
      <Line
        ref={upperBoundSegment}
        points={[
          [tickX.upperBound, axisY],
          [tickX.quadratic, axisY],
        ]}
        stroke={Solarized.red}
        lineWidth={12}
        lineCap={'round'}
        opacity={0}
        end={0}
        zIndex={2}
      />
      <Line
        ref={unknownSegment}
        points={[
          [tickX.gpt, axisY],
          [tickX.upperBound, axisY],
        ]}
        stroke={Solarized.yellow2}
        lineWidth={12}
        lineCap={'round'}
        opacity={0}
        end={0}
        zIndex={2}
      />
      <Line
        ref={gptSegment}
        points={[
          [tickX.linear, axisY],
          [tickX.gpt, axisY],
        ]}
        stroke={Solarized.green}
        lineWidth={12}
        lineCap={'round'}
        opacity={0}
        end={0}
        zIndex={1}
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
      <Node ref={gptBubble} x={405} y={-235} opacity={0} scale={0.7}>
        {bubble(
          '\\text{actually, at least }n^{1.01}',
          470,
          120,
          40,
          Solarized.base02,
          'left',
        )}
      </Node>
      <Node
        ref={openAiMarker}
        x={tickX.gpt}
        y={markerY}
        opacity={0}
        scale={0.42}
      >
        <Circle
          size={225}
          fill={Solarized.base3}
          stroke={Solarized.base1}
          lineWidth={5}
        />
        <Img src={openAiLogo} width={154} />
      </Node>
      <PolyLatex
        ref={upperBoundMarker}
        tex={
          '\\begin{array}{c}\\text{best known}\\\\[-0.05em]\\text{upper bound}\\end{array}'
        }
        x={tickX.upperBound}
        y={markerY}
        fontSize={30}
        fill={Solarized.base00}
        opacity={0}
      />
      <PolyLatex
        ref={unknownLabel}
        tex={'???'}
        x={(tickX.gpt + tickX.upperBound) / 2}
        y={axisY - 78}
        fontSize={64}
        fill={Solarized.yellow2}
        opacity={0}
      />
      <PolyLatex
        ref={impossible}
        tex={'\\mathrm{Impossible}'}
        x={320}
        y={axisY - 68}
        fontSize={54}
        fill={Solarized.red}
        opacity={0}
      />
    </Node>,
  );

  yield* all(
    growthAxis.axis().end(1, 0.8, easeInOutCubic),
    delay(0.2, growthAxis.labels.linear().opacity(1, 0.35, easeOutCubic)),
    delay(0.2, growthAxis.labels.quadratic().opacity(1, 0.35, easeOutCubic)),
  );
  yield* waitFor(0.35);

  yield* all(
    growthAxis.ticks.threeHalves().opacity(1, 0.25, easeOutCubic),
    growthAxis.ticks.threeHalves().scale(1, 0.25, easeOutCubic),
    growthAxis.labels.threeHalves().opacity(1, 0.35, easeOutCubic),
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

  const fainterRed = Solarized.red; //colorLerp(Solarized.red, Solarized.background, 0.42);
  yield* all(
    erdos().position([tickX.linear - 18, -220], 0.9, easeInOutCubic),
    erdos().scale(0.94, 0.9, easeInOutCubic),
    impossible().opacity(0, 0.25, easeInOutCubic),
    impossibleSegment().stroke(fainterRed, 0.35, easeInOutCubic),
    //impossibleSegment().opacity(0.42, 0.35, easeInOutCubic),
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
    growthAxis.ticks.gpt().opacity(1, 0.25, easeOutCubic),
    growthAxis.ticks.gpt().scale(1, 0.25, easeOutCubic),
    growthAxis.labels.gpt().opacity(1, 0.35, easeOutCubic),
    gpt().opacity(1, 0.4, easeOutCubic),
    gpt().scale(1, 0.4, easeOutCubic),
  );
  yield* waitFor(0.15);

  yield* all(
    gptSegment().opacity(1, 0.18, easeOutCubic),
    gptSegment().end(1, 0.6, easeInOutCubic),
    delay(0.18, gptBubble().opacity(1, 0.35, easeOutCubic)),
    delay(0.18, gptBubble().scale(1, 0.35, easeOutCubic)),
  );
  yield* waitFor(1.1);

  yield* all(
    gptBubble().opacity(0, 0.24, easeInOutCubic),
    gptBubble().scale(0.92, 0.24, easeInOutCubic),
    gpt().opacity(0, 0.3, easeInOutCubic),
    gpt().scale(0.86, 0.3, easeInOutCubic),
    impossibleSegment().opacity(0, 0.25, easeInOutCubic),
  );

  yield* all(
    erdos().position([tickX.threeHalves, markerY], 0.5, easeInOutCubic),
    erdos().scale(0.3, 0.5, easeInOutCubic),
    erdos().opacity(1, 0.35, easeOutCubic),
    growthAxis.ticks.upperBound().opacity(1, 0.25, easeOutCubic),
    growthAxis.ticks.upperBound().scale(1, 0.25, easeOutCubic),
    growthAxis.labels.upperBound().opacity(1, 0.35, easeOutCubic),
    openAiMarker().opacity(1, 0.35, easeOutCubic),
    upperBoundMarker().opacity(1, 0.35, easeOutCubic),
  );
  yield* waitFor(0.15);

  yield* all(
    delay(0.12, unknownSegment().opacity(1, 0.18, easeOutCubic)),
    delay(0.12, unknownSegment().end(1, 0.65, easeInOutCubic)),
    delay(0.2, upperBoundSegment().opacity(1, 0.18, easeOutCubic)),
    delay(0.2, upperBoundSegment().end(1, 0.55, easeInOutCubic)),
    delay(0.32, unknownLabel().opacity(1, 0.35, easeOutCubic)),
  );
  yield* waitFor(1.1);
});
