import type { View2D } from '@motion-canvas/2d/lib/components';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  waitFor,
} from '@motion-canvas/core';

import { PolyLatex } from '../utilities/latex';
import { palette } from './palette';
import { squareGridExtent, squareGridStep } from './squareGrid';
import {
  createSquareGridVisualRefs,
  revealCardinalBuddies,
  revealSquareGrid,
  SquareGridVisual,
} from './unitDistanceGridVisual';

interface GridUnitSceneOptions {
  boundLabel?: string;
}

export function createGridUnitScene({ boundLabel }: GridUnitSceneOptions = {}) {
  return makeScene2D(function* (view) {
    yield* playGridUnitScene(view, { boundLabel });
  });
}

export function* playGridUnitScene(
  view: View2D,
  { boundLabel }: GridUnitSceneOptions = {},
) {
  view.fill(palette.background);

  const grid = createSquareGridVisualRefs();
  const bound = createRef<PolyLatex>();

  view.add(
    <SquareGridVisual
      refs={grid}
      extent={squareGridExtent}
      step={squareGridStep}
    />,
  );

  if (boundLabel) {
    view.add(
      <PolyLatex
        ref={bound}
        x={430}
        y={-170}
        tex={boundLabel}
        fontSize={42}
        offsetX={-1}
        opacity={0}
      />,
    );
  }

  yield* revealSquareGrid(grid);

  yield* waitFor(0.2);

  yield* revealCardinalBuddies(grid);

  if (boundLabel) {
    yield* bound().opacity(1, 0.35, easeOutCubic);
  }

  yield* waitFor(0.15);
  yield* all(
    grid.centerDot().scale(1.35, 0.18, easeOutCubic),
    ...grid.buddyLines.map((line) => line.lineWidth(10, 0.18, easeOutCubic)),
  );
  yield* all(
    grid.centerDot().scale(1, 0.22, easeInOutCubic),
    ...grid.buddyLines.map((line) => line.lineWidth(8, 0.22, easeInOutCubic)),
  );

  yield* waitFor(1.2);
}
