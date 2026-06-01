import { Circle, Txt } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import { all, createRef, easeInOutCubic, waitFor } from '@motion-canvas/core';

import { palette } from '../lib/palette';

export default makeScene2D(function* (view) {
  view.fill(palette.background);

  const dot = createRef<Circle>();
  const label = (
    <Txt
      y={170}
      text={'dummy animation'}
      fill={palette.ink}
      fontFamily={'Inter, Arial, sans-serif'}
      fontSize={48}
      fontWeight={600}
    />
  );

  view.add(<Circle ref={dot} size={120} fill={palette.accent} />);
  view.add(label);

  dot().scale(0);
  label.opacity(0);

  yield* all(
    dot().scale(1, 0.7, easeInOutCubic),
    label.opacity(1, 0.5, easeInOutCubic),
  );

  yield* all(
    dot().position.x(260, 1, easeInOutCubic),
    dot().fill(palette.focus, 1, easeInOutCubic),
  );

  yield* all(
    dot().position.x(-260, 1, easeInOutCubic),
    dot().fill(palette.accent, 1, easeInOutCubic),
  );

  yield* all(dot().position.x(0, 1, easeInOutCubic), dot().scale(1.2, 1));

  yield* waitFor(1);
});
