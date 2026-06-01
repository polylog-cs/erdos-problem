# Motion Canvas Examples Reference

A comprehensive reference of Motion Canvas patterns, organized by concept. Each section shows the essential code pattern with a file path to the full example.

---

## Scene Basics

> `examples/introduction/intro.tsx` — Minimal scene: create shapes, animate appearance, fade out.

```tsx
import {Circle, makeScene2D, Rect} from '@motion-canvas/2d';
import {all, createRef, sequence} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
    const rect = createRef<Rect>();
    view.add(<Rect ref={rect} size={320} stroke={'red'} lineWidth={10} x={-300}/>);

    const circle = createRef<Circle>();
    view.add(<Circle ref={circle} size={320} stroke={'blue'} lineWidth={10} x={300}/>);

    // instant set + animated tween: object.prop(value).prop(target, duration)
    yield* all(
        rect().scale(0).scale(1, 1),
        rect().opacity(0).opacity(1, 1),
        circle().scale(0).scale(1, 1),
        circle().opacity(0).opacity(1, 1),
    );

    // sequence() staggers animations with a delay between each
    yield* sequence(
        0.25,
        rect().opacity(0, 1),
        circle().opacity(0, 1),
    );
});
```

---

## Property Animation & Chaining

> `examples/introduction/animate.tsx` — Animate individual properties (position, rotation, fill, color).

```tsx
// appear helper — reusable pattern for scaling+fading in
function* appear(object: Shape, duration = 1): ThreadGenerator {
    let scale = object.scale();
    yield* all(
        object.scale(0).scale(scale, duration),
        object.opacity(0).opacity(1, duration),
    );
}

// animate individual properties
yield* all(
    rect().position.y(rect().position.y() - rect().height() / 4, 1),
    circle().position.y(circle().position.y() + circle().height() / 4, 1),
);

yield* all(
    rect().rotation(-90, 1),
    rect().fill('rgba(255, 0, 0, 0.8)', 1),
    circle().scale(2, 1),
    circle().fill('rgba(0, 0, 255, 0.8)', 1),
);
```

> `examples/introduction/animate-complex.tsx` — Chaining with `.to()` and `delay()` for overlapping animations.

```tsx
yield* all(
    rect().x(300, n),                                        // move over n seconds
    delay(n / 4, rect().scale(1.5, n / 4).to(1, n / 4)),    // delayed scale bounce
    delay(n / 8 * 3, rect().rotation(-90, n / 4).to(90, n / 4)),  // delayed rotation
);
```

---

## Animation Flow

> `examples/groups-animations-signals-effects/animation-flow.tsx` — All flow primitives: `sequence`, `all`, `chain`, `delay`, `any`, `loop`, `waitFor`.

```tsx
import {all, any, chain, delay, loop, sequence, waitFor} from '@motion-canvas/core';

// sequence: stagger animations with delay
yield* sequence(0.15, ...rectangles.map(ref => appear(ref())));

// all: run animations simultaneously
yield* all(...rectangles.map(ref => ref().opacity(0, 1)));

// chain: run animations one after another
yield* chain(
    rectangles[0]().opacity(1, 0.5),
    rectangles[1]().opacity(1, 1),
    rectangles[2]().opacity(1, 0.25),
);

// delay: offset an animation's start time
yield* all(
    delay(0.6, rectangles[0]().opacity(0, 1)),
    delay(0.3, rectangles[1]().opacity(0, 1)),
);

// any: continue when the FIRST animation finishes
yield* any(
    delay(1, rectangles[0]().opacity(1, 1)),
    delay(0.25, rectangles[1]().opacity(1, 1)),
);

// loop: run in background (yield without star!)
yield loop(() => rectangles[1]().opacity(0, 0.25).to(1, 0.25));
// can still animate other properties while looping
yield* rectangles[1]().scale(0.5, 3);
```

---

## Positioning & Alignment (Cardinal Directions)

> `examples/introduction/next-to.tsx` — Position objects relative to each other using cardinal directions.

```tsx
// cardinal directions: .left(), .right(), .top(), .bottom(), .topLeft(), etc.
// set a circle's right edge to a rectangle's left edge (with offset)
yield* sequence(
    0.15,
    circles[0]().right(rectangle().left().addX(-50), 1),
    circles[1]().bottom(rectangle().top().addY(-50), 1),
    circles[2]().left(rectangle().right().addX(50), 1),
    circles[3]().top(rectangle().bottom().addY(50), 1),
);
```

> `examples/introduction/move-to.tsx` — Position objects at specific locations using cardinal directions.

```tsx
// position based on another object's location
numbers.forEach((ref, i) => {
    ref().position(rectangles[i]().position());
});
```

> `examples/introduction/align-to.tsx` — Align objects' edges to a common line.

```tsx
// align all circles' tops to y=-300
yield* all(...circles.map(ref => ref().top(new Vector2(ref().top().x, -300), 1)));
// align bottoms to match another circle
yield* all(
    circles[0]().bottom(new Vector2(circles[0]().position.x(), circles[1]().bottom().y), 1),
    circles[2]().bottom(new Vector2(circles[2]().position.x(), circles[1]().bottom().y), 1),
);
```

---

## Flexbox Layouts

> `examples/introduction/flexbox.tsx` — Basic flexbox layout with animated `grow` property.

```tsx
view.add(
    <Layout layout gap={10} padding={30} width={1000} height={600}>
        <Rect ref={col1} grow={1} fill={'#242424'} radius={20}/>
        <Layout gap={10} direction="column" grow={3}>
            <Rect ref={redBox} grow={8} fill={'red'} radius={50}/>
            <Rect grow={2} fill={'#242424'} radius={20}/>
        </Layout>
        <Rect ref={col3} grow={3} fill={'#242424'} radius={20}/>
    </Layout>
);
yield* all(col3().grow(1, 0.8), col1().grow(2, 0.8));
```

> `examples/introduction/move-to-flexbox.tsx` — Save/restore layout positions for animated transitions.

```tsx
// 1. create layout with positioned elements
const layout = createRef<Layout>();
view.add(<Layout layout ref={layout} gap={50}>
    {rectangles.map((ref, i) => <Rect ref={ref} .../>)}
</Layout>);

// 2. save the layout positions
rectangles.forEach(ref => ref().save());

// 3. disable layout (elements snap to origin)
layout().layout(false);

// 4. scatter them (custom initial positions)
rectangles[0]().scale(0.5);
rectangles[0]().position(new Vector2(100, 200));
rectangles[0]().rotation(30);
rectangles[0]().opacity(0);

// 5. appear + restore to layout positions
yield* sequence(0.15, ...rectangles.map(ref => appear(ref())));
yield* all(...rectangles.map(ref => ref().restore(1)));

// 6. re-enable layout
layout().layout(true);
```

> `examples/groups-animations-signals-effects/arrange.tsx` — Arrange objects using flexbox, animate gap/direction.

```tsx
yield* all(
    layout().gap(10, 1),
    layout().direction('column', 1),
);
```

> `examples/groups-animations-signals-effects/arrange-in-grid.tsx` — Grid layout with `wrap` and chroma.js color scales.

```tsx
import chroma from 'chroma-js';

let colors = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(circles.length);

view.add(
    <Layout layout gap={50} ref={layout} wrap={'wrap'} width={1400} alignItems={'center'}>
        {circles.map((ref, i) =>
            <Circle ref={ref} stroke={colors[i]} lineWidth={5} size={random.nextInt(10, 50)}/>
        )}
    </Layout>
);
```

---

## Grouping Objects

> `examples/groups-animations-signals-effects/vgroup.tsx` — Group with Layout, scale/move the group, suppress layout to move children freely.

```tsx
// scale the entire group
yield* all(
    layout().scale(1.5, 1),
    layout().position.y(-200, 1),
);

// suppress the layout to move children individually
layout().children().forEach(ref => ref.save());
layout().layout(false);
layout().children().forEach(ref => ref.restore());

// now children can be moved freely
yield* rectangles[1]().position.y(300, 1);
```

---

## Scene Hierarchy & Z-Index

> `examples/groups-animations-signals-effects/add-remove.tsx` — Add/remove nodes, reorder with `moveToTop`/`moveToBottom`, z-index.

```tsx
// add to scene (appended as last child = rendered on top)
view.add(<Circle ref={circle} fill={'red'} size={350}/>);

// reorder
circle().moveToBottom();  // rendered behind everything
circle().moveToTop();     // rendered on top

// z-index overrides render order
circle().zIndex(10);

// remove from scene
circle().remove();
```

---

## Signals

> `examples/groups-animations-signals-effects/simple-signal.tsx` — Bind properties to other nodes' signals for reactive dependencies.

```tsx
// bind text's properties to the square's signals
view.add(
    <Txt ref={text} fill={'white'}
         opacity={outerSquare().opacity}      // signal binding
         bottom={outerSquare().top}           // follows top edge
         scale={outerSquare().scale}
    />
);

// moving outerSquare automatically moves text
yield* outerSquare().position.x(-300, 1);

// can add signal bindings later too
text().rotation(outerSquare().rotation);
```

> `examples/groups-animations-signals-effects/become-signal.tsx` — Computed signals: bind to functions of other signals.

```tsx
view.add(
    <Latex ref={text} fill={'white'}
           // computed signal: function that reads other signals
           tex={() => `p = [${circle().x().toFixed(0)}, ${circle().y().toFixed(0)}]`}
           bottom={() => circle().top().addY(-30)}
    />
);
// moving the circle automatically updates the text content and position
```

---

## Effects

> `examples/groups-animations-signals-effects/effect.tsx` — `createDeferredEffect` for physics-like simulations (non-lazy).

```tsx
import {createDeferredEffect, createSignal} from '@motion-canvas/core';

// create a repulsion force around a white circle
createDeferredEffect(() => {
    circles.forEach((ref, i) => {
        const pos = basePositions[i];
        const vector = pos.sub(circle().position());
        const direction = vector.normalized;
        const distance = vector.magnitude;
        const pushStrength = Math.max(
            Math.sqrt(distance) * circle().width() * (1 / 50),
            circle().width(),
        );
        ref().position(pos.add(direction.mul(pushStrength)));
    });
});
```

---

## Spline Movement

> `examples/groups-animations-signals-effects/shuffle-helper.tsx` — Move an object along a spline path.

```tsx
import {Spline} from '@motion-canvas/2d';
import {createSignal, easeInOutExpo} from '@motion-canvas/core';

const spline = createRef<Spline>();
const progress = createSignal(0);

view.add(
    <Spline ref={spline} lineWidth={8} stroke={'white'}
            points={[[-500, 0], [0, -250], [500, 0]]} smoothness={1}/>
);

// bind circle position to spline
<Circle position={() => spline().getPointAtPercentage(progress()).position}/>

// animate along the spline
yield* progress(1, 2, easeInOutExpo);
```

> `examples/groups-animations-signals-effects/task-shuffle.tsx` — Swap two objects along curved spline paths.

```tsx
function* swap(view: Layout, a: Layout, b: Layout, duration = 1): ThreadGenerator {
    let start = a.position();
    let end = b.position();
    let mid = new Vector2().add(start).add(end).div(2);
    const progress = createSignal(0);
    let yOffset = Math.abs(a.position().x - b.position().x) / 2.5;

    // create two curved paths
    view.add(<Spline ref={s1} points={[start, mid.addY(yOffset), end]} smoothness={1}/>);
    view.add(<Spline ref={s2} points={[end, mid.addY(-yOffset), start]} smoothness={1}/>);

    a.position(() => s1().getPointAtPercentage(progress()).position);
    b.position(() => s2().getPointAtPercentage(progress()).position);

    yield* progress(1, duration, easeInOutExpo);
    s1().remove();
    s2().remove();
}
```

---

## Text & LaTeX

> `examples/introduction/text-and-math.tsx` — Text writing, LaTeX rendering, and diffing between content.

```tsx
import {Latex, Txt} from '@motion-canvas/2d';

view.add(<>
    <Txt ref={text} fill={'white'} x={-300}></Txt>
    // double braces {{ }} mark diffable sections in LaTeX
    <Latex ref={math} fill={'white'} x={300}
           tex={"{{\\sum_{i = 0}}}{{^\\infty}} {{\\frac{1}{2^i}}} = {{2}}"}/>
</>);

// animate text writing
yield* text().text('Hello Motion Canvas!', 1);

// diff-based transitions (smoothly morphs between states)
yield* all(
    text().text('Hello everyone!', 1),
    math().tex("{{\\sum_{i = 0}}}{{^{42}}} {{\\frac{1}{2^i}}} = {{13}}", 1),
);
```

---

## Camera

> `examples/camera-and-shaders/moving-camera.tsx` — Camera zoom, centerOn, rotation, and reset.

```tsx
import {Camera} from '@motion-canvas/2d';

view.add(
    <Camera ref={camera}>
        <Layout layout gap={50} alignItems={'center'}>
            <Circle ref={circle} size={200} stroke={'blue'} lineWidth={5}/>
            <Rect ref={square} size={300} stroke={'white'} lineWidth={5}/>
        </Layout>
    </Camera>
);

yield* camera().zoom(1.5, 1);
yield* camera().centerOn(circle(), 1);
yield* all(
    camera().zoom(camera().zoom() * 1.5, 2),
    camera().centerOn(pentagon(), 2),
    camera().rotation(180, 2),
);
yield* camera().reset(2);  // reset to defaults
```

> `examples/camera-and-shaders/moving-camera-follower.tsx` — Camera that follows a node via signal binding.

```tsx
// camera position bound to a circle's position signal
<Camera ref={camera} position={() => (circles[30]().position() ?? new Vector2(0, 0))}>
    {/* children rendered through camera */}
</Camera>
```

> `examples/camera-and-shaders/multi-camera.tsx` — Multiple cameras viewing the same scene with `Camera.Stage`.

```tsx
// scene must be a Node at the top level
let scene = <Node>
    <Circle ref={circle} fill={'white'}/>
    {circles.map((ref, i) => <Circle ref={ref} .../>)}
</Node>;

view.add(<>
    <Camera.Stage cameraRef={mainCamera} scene={scene}
                  size={[view.width(), view.height()]}/>
    <Camera.Stage cameraRef={sideCamera} scene={scene}
                  size={[sideWidth, sideHeight]}
                  position={...} scale={0}/>
</>);

// each camera can be controlled independently
sideCamera().position(circle().position);  // follow the circle
```

---

## Shaders

> `examples/camera-and-shaders/shader.tsx` + `shader.glsl` — Basic shader: gradient effect on a shape.

```tsx
// TSX: import and apply a shader
import shader from './shader.glsl';

<Circle size={400} shaders={shader} fill={'rgb(255,0,0)'}/>
```

```glsl
// GLSL: basic shader structure
#version 300 es
precision highp float;
#include "@motion-canvas/core/shaders/common.glsl"

void main() {
    outColor = texture(sourceTexture, sourceUV);
    vec3 col = 0.5 + 0.5 * cos(time * 3.0 + sourceUV.xyx + vec3(0, 2, 4));
    outColor.rgb = col;
}
```

Built-in uniforms: `time`, `deltaTime`, `framerate`, `frame`, `resolution`, `sourceTexture`, `destinationTexture`, `sourceUV`, `destinationUV`, `sourceMatrix`, `destinationMatrix`.

> `examples/camera-and-shaders/shader-advanced.tsx` + `shader-advanced.glsl` — Custom uniforms passed from Motion Canvas signals.

```tsx
<Rect width={1920} height={1080}
      shaders={{
          fragment: shader,
          uniforms: {
              aPos: circle().position,      // signal -> uniform vec2
              aOpacity: circle().opacity,    // signal -> uniform float
              aScale: circle().scale,        // signal -> uniform vec2
          },
      }}
      zIndex={-1}
/>
```

> `examples/camera-and-shaders/shader-combined.tsx` — Multiple shaders chained on one node.

```tsx
<Circle shaders={[{fragment: shader}, {fragment: shaderCombined}]} .../>
```

The second shader receives the first shader's output via `destinationTexture`/`destinationUV`.

---

## Complex Tasks

> `examples/introduction/task-sort.tsx` — Bubble sort visualization with `useRandom` and flexbox bar chart.

Key patterns: `useRandom()` for seeded RNG, flexbox layout for bar alignment, height swaps for sorting animation.

> `examples/introduction/task-search.tsx` — Binary search with `createRefMap` for organized refs and arrow animations.

Key patterns: `createRefMap<Line>()` for named refs (`searchArrows.left`, `.right`, `.mid`), `Line` with `startArrow`, animated `end` property for drawing.

> `examples/groups-animations-signals-effects/task-triangle.tsx` — Circumscribed circle with `createDeferredEffect` tracking moving vertices.

Key patterns: deferred effect to continuously recompute geometry, signal-bound labels that track positions.

> `examples/groups-animations-signals-effects/task-wave.tsx` — BFS maze visualization with delayed color fills.

Key patterns: grid built with flexbox `wrap`, `chroma.scale()` for color gradients, `delay()` per BFS distance for wave effect.

> `examples/groups-animations-signals-effects/task-hilbert.tsx` — Recursive Hilbert curve with `clone()`, `Knot` nodes, and `absolutePosition`.

Key patterns: `node.clone()` for copying, `<Knot>` inside `<Spline>` for accessible `absolutePosition`, `smoothness={0}` for line segments, `end` signal for draw animation.

> `examples/camera-and-shaders/task-fibonacci.tsx` — Fibonacci spiral with Camera and nested flexbox layouts.

Key patterns: dynamic layout nesting with changing `direction`, `save()`/`restore()` for animated size transitions, Camera for auto-framing.

---

## Common Imports Cheatsheet

```tsx
// Nodes
import {Circle, Rect, Layout, Line, Txt, Latex, Spline, Knot, Camera, Node, Polygon} from '@motion-canvas/2d';

// Flow & timing
import {all, any, chain, delay, loop, sequence, waitFor} from '@motion-canvas/core';

// Refs & signals
import {createRef, createRefMap, createSignal, Reference} from '@motion-canvas/core';

// Effects
import {createEffect, createDeferredEffect} from '@motion-canvas/core';

// Utilities
import {Vector2, Color, useRandom, ThreadGenerator} from '@motion-canvas/core';

// Easing
import {easeInOutExpo, easeInOutBack} from '@motion-canvas/core';

// Colors (external)
import chroma from 'chroma-js';
```
