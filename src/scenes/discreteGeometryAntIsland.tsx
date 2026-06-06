import {Circle, Img} from '@motion-canvas/2d';
import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {all, createRef, easeOutCubic, waitFor} from '@motion-canvas/core';

import {palette} from '../lib/palette';

const imagePath = '/reference/island/latest-download-island.png';

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const photo = createRef<Img>();
  const discreteGeometry = createRef<Circle>();
  const algebraicNumberTheory = createRef<Circle>();

  view.add(
    <>
      <Img ref={photo} src={imagePath} height={1080} opacity={0} />
      <Circle
        ref={discreteGeometry}
        x={-170}
        y={-225}
        size={230}
        fill={palette.accent}
        stroke={palette.accentDark}
        lineWidth={8}
        opacity={0}
        scale={0.88}
      />
      <Circle
        ref={algebraicNumberTheory}
        x={315}
        y={-255}
        size={235}
        fill={palette.focus}
        stroke={palette.focus}
        lineWidth={8}
        opacity={0}
        scale={0.88}
      />
    </>,
  );

  yield* photo().opacity(1, 0.5, easeOutCubic);
  yield* waitFor(0.25);

  yield* all(
    discreteGeometry().opacity(0.5, 0.35, easeOutCubic),
    discreteGeometry().scale(1, 0.35, easeOutCubic),
  );
  yield* waitFor(0.2);

  yield* all(
    algebraicNumberTheory().opacity(0.5, 0.35, easeOutCubic),
    algebraicNumberTheory().scale(1, 0.35, easeOutCubic),
  );

  yield* waitFor(1.4);
});
