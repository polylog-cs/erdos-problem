import { makeScene2D } from '@motion-canvas/2d';
import {
  all,
  createRef,
  linear,
  loop,
  map,
  tween,
  useScene,
  waitFor,
} from '@motion-canvas/core';

import { Three } from '../../components/Three';
import { Solarized } from '../../utilities/color';
import * as demo from '../../three/demo';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const three = createRef<Three>();

  view.add(
    <Three
      ref={three}
      width={1920}
      height={1080}
      scene={demo.threeScene}
      camera={demo.camera}
      background={Solarized.base03}
      quality={1}
      opacity={0}
    />,
  );

  // Continuously rerender the Three.js scene each frame
  useScene().lifecycleEvents.onBeginRender.subscribe(() => {
    three().rerender();
  });

  // Fade in the 3D view
  yield* three().opacity(1, 1);

  // Animate mesh rotation and orbit camera
  yield* all(
    loop(6, () =>
      tween(6, (value) => {
        demo.mesh.rotation.x = map(0, Math.PI * 2, value);
        demo.mesh.rotation.y = map(0, Math.PI * 2, value);
      }),
    ),
    loop(6, () =>
      tween(6, (value) => {
        demo.orbit.rotation.z = map(1.6, 1.6 + Math.PI * 2, linear(value));
      }),
    ),
  );

  // Fade out
  yield* three().opacity(0, 1);

  yield* waitFor(0.5);
});
