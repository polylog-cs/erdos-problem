import { Layout, Node } from '@motion-canvas/2d';
import { all, Reference, ThreadGenerator, waitFor } from '@motion-canvas/core';

export function* appear(object: Reference<Layout>): ThreadGenerator {
  yield* all(object().opacity(0).opacity(1, 1), object().scale(0).scale(1, 1));
}

export function* indicate(node: Node, newScale: number = 1.5) {
  // Save current z-level
  const oldZ = node.zIndex(); // get current z-value

  // Move it to the front
  yield* node.zIndex(999, 0); // instantly set z to a very large number

  const scale = node.scale();
  // Animate scale up and back down
  yield* node.scale(scale.mul(newScale), 0.3);
  yield* waitFor(0.5);
  yield* node.scale(scale, 0.3);

  // Restore old z
  yield* node.zIndex(oldZ, 0);
}
