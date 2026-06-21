import { Circle, Line, Node } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  delay,
  easeInOutCubic,
  easeOutCubic,
  makeRef,
  sequence,
  tween,
  waitFor,
} from '@motion-canvas/core';

import { palette } from '../lib/palette';
import {
  latticeDots,
  pythagoreanDirections,
  toScreen,
  type Point,
} from '../lib/pythagoreanGridScene';
import { RotatingWheel } from '../lib/rotatingWheel';
import {
  squareGridCoordinates,
  squareGridExtent,
  squareGridStep,
} from '../lib/squareGrid';
import { PolyLatex } from '../utilities/latex';

function equationLhsFor([dx, dy]: Point) {
  return `${Math.abs(dx)}^2+${Math.abs(dy)}^2`;
}

function formatScaledNumber(value: number) {
  return value.toFixed(2);
}

function scaledFiveEquationLhs(scale: number) {
  return `${formatScaledNumber(4 * scale)}^2+${formatScaledNumber(3 * scale)}^2`;
}

function scaledFiveEquationRhs(scale: number) {
  return `=${formatScaledNumber(5 * scale)}^2`;
}

function fullGridDotsEnabled() {
  return (
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('fullGridDots') === '1'
  );
}

const smallGridX = -330;
const smallGridY = 35;
const smallFormulaJoinX = 42;
const smallFormulaY = -squareGridExtent * squareGridStep - 64;

const denseGridX = -320;
const denseGridY = 25;
const denseFormulaJoinX = denseGridX + 42;
const denseFormulaY = denseGridY - 70 * 5.5 - 64;
const sixtyFiveSweepDuration = 12;

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const smallStep = squareGridStep;
  const smallStage = createRef<Node>();
  const smallGrid = createRef<Node>();
  const smallLines: Line[] = [];
  const smallDots: Circle[] = [];
  const centerDot = createRef<Circle>();
  const unitLabel = createRef<PolyLatex>();
  const fiveFormulaLhs = createRef<PolyLatex>();
  const fiveFormulaRhs = createRef<PolyLatex>();

  const unitWheel = new RotatingWheel({
    directions: pythagoreanDirections(1),
    step: smallStep,
    style: {
      rayWidth: 7.5,
      endpointSize: 12,
      activeLineWidth: 9,
      activeEndSize: 14,
      endpointStroke: true,
    },
  });
  const fiveWheel = new RotatingWheel({
    directions: pythagoreanDirections(5),
    step: smallStep,
    style: {
      rayWidth: 4.8,
      endpointSize: 10,
      activeLineWidth: 9,
      activeEndSize: 15,
    },
  });

  function* setFiveEquation(lhs: string, rhs: string, duration = 0) {
    yield* all(fiveFormulaLhs().tex(lhs, duration), fiveFormulaRhs().tex(rhs, duration));
  }

  function* tweenFiveEquationScale(
    fromScale: number,
    toScale: number,
    duration: number,
    finalLhs: string,
    finalRhs: string,
  ) {
    yield* tween(duration, (progress) => {
      const eased = easeInOutCubic(progress);
      const scale = fromScale + (toScale - fromScale) * eased;

      fiveFormulaLhs().tex(scaledFiveEquationLhs(scale));
      fiveFormulaRhs().tex(scaledFiveEquationRhs(scale));
    });

    yield* setFiveEquation(finalLhs, finalRhs);
  }

  view.add(
    <>
      <Node ref={smallStage} x={smallGridX} y={smallGridY}>
        <Node ref={smallGrid}>
          {squareGridCoordinates.map((x, index) => (
            <Line
              ref={makeRef(smallLines, index)}
              points={[
                [x * smallStep, -squareGridExtent * smallStep],
                [x * smallStep, squareGridExtent * smallStep],
              ]}
              stroke={palette.grid}
              lineWidth={1}
              end={0}
              opacity={0}
            />
          ))}
          {squareGridCoordinates.map((y, index) => (
            <Line
              ref={makeRef(smallLines, squareGridCoordinates.length + index)}
              points={[
                [-squareGridExtent * smallStep, y * smallStep],
                [squareGridExtent * smallStep, y * smallStep],
              ]}
              stroke={palette.grid}
              lineWidth={1}
              end={0}
              opacity={0}
            />
          ))}
          {latticeDots(squareGridExtent).map(([x, y], index) => (
            <Circle
              ref={makeRef(smallDots, index)}
              x={x * smallStep}
              y={y * smallStep}
              size={14}
              fill={palette.dot}
              opacity={0.86}
              scale={0}
            />
          ))}

          <Circle
            ref={centerDot}
            size={14}
            fill={palette.focus}
            stroke={palette.background}
            lineWidth={3}
            scale={0}
          />
          <PolyLatex
            ref={unitLabel}
            x={smallStep / 2}
            y={-22}
            tex={'1'}
            fontSize={30}
            opacity={0}
          />
          {unitWheel.view}
          {fiveWheel.view}
        </Node>
      </Node>
      <PolyLatex
        ref={fiveFormulaLhs}
        x={smallGridX + smallFormulaJoinX}
        y={smallGridY + smallFormulaY}
        tex={equationLhsFor(fiveWheel.directions[0])}
        fontSize={46}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={fiveFormulaRhs}
        x={smallGridX + smallFormulaJoinX + 17}
        y={smallGridY + smallFormulaY}
        tex={'=5^2'}
        fontSize={46}
        offsetX={-1}
        opacity={0}
      />
    </>,
  );

  yield* all(
    sequence(
      0.018,
      ...smallLines.map((line) =>
        all(line.opacity(1, 0.22, easeOutCubic), line.end(1, 0.68, easeInOutCubic)),
      ),
    ),
    sequence(0.0035, ...smallDots.map((dot) => dot.scale(1, 0.22, easeOutCubic))),
  );

  yield* centerDot().scale(1, 0.22, easeOutCubic);
  yield* all(
    unitWheel.active().opacity(1, 0.22, easeOutCubic),
    unitWheel.revealRay(0, { duration: 0.22, opacity: 0.9, endDuration: 0.34 }),
  );
  yield* unitLabel().opacity(1, 0.25, easeOutCubic);

  yield* waitFor(0.18);

  for (let index = 1; index < unitWheel.directions.length; index++) {
    yield* unitWheel.rotateArmTo(index, 0.22);
    yield* unitWheel.revealRay(index, { duration: 0.12, opacity: 0.9 });
    yield* waitFor(0.04);
  }

  yield* unitWheel.active().opacity(0, 0.18, easeInOutCubic);
  yield* waitFor(0.45);

  yield* all(unitLabel().opacity(0, 0.25, easeInOutCubic), unitWheel.fadeOut(0.3));

  yield* waitFor(1);

  const [fiveLabelX, fiveLabelY] = toScreen(
    fiveWheel.directions[0][0],
    fiveWheel.directions[0][1],
    smallStep,
  );
  const fiveLabel = (
    <PolyLatex
      tex="5"
      x={fiveLabelX + 24}
      y={fiveLabelY - 8}
      fill={fiveWheel.rays[0].stroke}
      opacity={0}
    />
  );
  smallGrid().add(fiveLabel);

  yield* all(
    fiveWheel.active().opacity(1, 0.25, easeOutCubic),
    fiveWheel.revealRay(0, { duration: 0.25, opacity: 0.9, endDuration: 0.34 }),
  );

  yield* waitFor(0.5);
  yield* fiveLabel.opacity(1, 0.5);
  yield* waitFor(0.5);

  yield* all(
    fiveFormulaLhs().opacity(1, 0.5, easeOutCubic),
    fiveFormulaRhs().opacity(1, 0.5, easeOutCubic),
    fiveLabel.opacity(0, 0.5),
  );

  for (let index = 1; index < fiveWheel.directions.length; index++) {
    yield* all(
      fiveWheel.rotateArmTo(index, 0.36),
      delay(0.18, fiveFormulaLhs().tex(equationLhsFor(fiveWheel.directions[index]), 0)),
    );
    yield* fiveWheel.revealRay(index, { duration: 0.16, opacity: 0.9 });
    yield* waitFor(0.04);
  }

  yield* fiveWheel.active().opacity(0, 0.22, easeInOutCubic);
  yield* waitFor(0.25);

  yield* setFiveEquation('4^2+3^2', '=5^2');
  yield* waitFor(0.35);

  const normalizeDuration = 0.95;
  yield* all(
    smallStage().scale(0.2, normalizeDuration, easeInOutCubic),
    tweenFiveEquationScale(
      1,
      0.2,
      normalizeDuration,
      '0.80^2+0.60^2',
      '=1.00^2',
    ),
  );
  yield* waitFor(2);

  yield* all(
    smallStage().scale(1, normalizeDuration, easeInOutCubic),
    tweenFiveEquationScale(
      0.2,
      1,
      normalizeDuration,
      '4^2+3^2',
      '=5^2',
    ),
  );
  yield* waitFor(0.25);

  yield* all(
    centerDot().opacity(0, 0.25, easeInOutCubic),
    fiveFormulaLhs().opacity(0, 0.25, easeInOutCubic),
    fiveFormulaRhs().opacity(0, 0.25, easeInOutCubic),
    fiveWheel.fadeOut(0.3),
  );

  yield* waitFor(0.18);

  const denseGrid = createRef<Node>();
  const denseVectorFormulaLhs = createRef<PolyLatex>();
  const denseVectorFormulaRhs = createRef<PolyLatex>();
  const whyTitle = createRef<PolyLatex>();
  const denseCenter = createRef<Circle>();
  const denseStep = 5.5;
  const denseDotEvery = fullGridDotsEnabled() ? 1 : 10;
  const denseDotSize = fullGridDotsEnabled() ? 3 : 5;
  const denseDotOpacity = fullGridDotsEnabled() ? 0.25 : 0.45;

  const sixtyFiveWheel = new RotatingWheel({
    directions: pythagoreanDirections(65),
    step: denseStep,
    style: {
      rayWidth: 2.9,
      endpointSize: 6.5,
      activeLineWidth: 6.5,
      activeEndSize: 13,
    },
  });

  view.add(
    <Node ref={denseGrid} x={denseGridX} y={denseGridY} opacity={0}>
      {latticeDots(70, denseDotEvery).map(([x, y]) => (
        <Circle
          x={x * denseStep}
          y={-y * denseStep}
          size={denseDotSize}
          fill={palette.dot}
          opacity={denseDotOpacity}
        />
      ))}
      {sixtyFiveWheel.view}
      <Circle
        ref={denseCenter}
        size={13}
        fill={palette.focus}
        stroke={palette.background}
        lineWidth={3}
        scale={0}
      />
    </Node>,
  );

  view.add(
    <>
      <PolyLatex
        ref={denseVectorFormulaLhs}
        x={denseFormulaJoinX}
        y={denseFormulaY}
        tex={equationLhsFor(sixtyFiveWheel.directions[0])}
        fontSize={42}
        offsetX={1}
        opacity={0}
      />
      <PolyLatex
        ref={denseVectorFormulaRhs}
        x={denseFormulaJoinX + 17}
        y={denseFormulaY}
        tex={'=65^2'}
        fontSize={42}
        offsetX={-1}
        opacity={0}
      />
      <PolyLatex
        ref={whyTitle}
        x={denseGridX}
        y={denseFormulaY}
        tex={'\\text{Why is 65 special?}'}
        fontSize={48}
        offsetX={0}
        opacity={0}
      />
    </>,
  );

  yield* all(
    smallGrid().opacity(0, 0.45, easeInOutCubic),
    fiveFormulaLhs().opacity(0, 0.3, easeInOutCubic),
    fiveFormulaRhs().opacity(0, 0.3, easeInOutCubic),
  );
  yield* all(
    denseGrid().opacity(1, 0.45, easeOutCubic),
    denseCenter().scale(1, 0.28, easeOutCubic),
  );
  yield* all(
    sixtyFiveWheel.active().opacity(1, 0.25, easeOutCubic),
    denseVectorFormulaLhs().opacity(1, 0.35, easeOutCubic),
    denseVectorFormulaRhs().opacity(1, 0.35, easeOutCubic),
    sixtyFiveWheel.revealRay(0, {
      duration: 0.24,
      opacity: 0.82,
      endDuration: 0.34,
    }),
  );

  yield* waitFor(0.25);

  const sixtyFiveStepDuration =
    sixtyFiveSweepDuration / Math.max(1, sixtyFiveWheel.directions.length - 1);
  const sixtyFiveRotationDuration = sixtyFiveStepDuration * 0.72;
  const sixtyFiveRevealDuration = sixtyFiveStepDuration * 0.28;

  for (let index = 1; index < sixtyFiveWheel.directions.length; index++) {
    yield* all(
      sixtyFiveWheel.rotateArmTo(index, sixtyFiveRotationDuration),
      delay(
        sixtyFiveRotationDuration,
        denseVectorFormulaLhs().tex(
          equationLhsFor(sixtyFiveWheel.directions[index]),
          0,
        ),
      ),
    );
    yield* sixtyFiveWheel.revealRay(index, {
      duration: sixtyFiveRevealDuration,
      opacity: 0.78,
      instantEnd: true,
    });
  }

  yield* sixtyFiveWheel.active().opacity(0, 0.22, easeInOutCubic);
  yield* waitFor(0.35);
  yield* all(
    denseVectorFormulaLhs().opacity(0, 0.25, easeInOutCubic),
    denseVectorFormulaRhs().opacity(0, 0.25, easeInOutCubic),
    whyTitle().opacity(1, 0.65, easeOutCubic),
  );
  yield* waitFor(2.2);
});
