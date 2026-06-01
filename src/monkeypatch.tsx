import { Node, Rect, View2D } from '@motion-canvas/2d';
import {
  PossibleVector2,
  SimpleVector2Signal,
  Vector2,
  Vector2Signal,
} from '@motion-canvas/core';

// Canvas text rendering only sees a @font-face after that variant has been
// loaded into document.fonts. Editor chrome warms up regular+bold for us, so
// italics fall back to sans-serif unless we explicitly request them.
if (typeof document !== 'undefined' && document.fonts) {
  const families = ['Computer Modern Serif', 'TeX Gyre Schola'];
  for (const family of families) {
    for (const style of ['normal', 'italic']) {
      for (const weight of ['400', '700']) {
        document.fonts.load(`${style} ${weight} 16px "${family}"`);
      }
    }
  }
}

export type Direction = 'left' | 'right' | 'up' | 'down';
export type Corner = 'UL' | 'UR' | 'DL' | 'DR';

function directedVector(dir: Direction, offset: number) {
  const vector = new Vector2(
    dir == 'left' ? [-1, 0] : dir == 'right' ? [1, 0] : dir == 'up' ? [0, -1] : [0, 1],
  );
  return vector.mul(offset);
}

const nodeHelpers = {
  worldToView(): DOMMatrix {
    return this.view().worldToLocal();
  },
  viewToWorld(): DOMMatrix {
    return this.view().localToWorld();
  },
  localToView(): DOMMatrix {
    return this.localToWorld().multiply(this.worldToView());
  },
  viewToLocal(): DOMMatrix {
    return this.viewToWorld().multiply(this.worldToLocal());
  },
  // Bounding box in other than local coordinates. Handles rotation and scaling.
  _transformedBBox(transform: any) {
    const bbox = this.cacheBBox();
    const points = [bbox.topLeft, bbox.topRight, bbox.bottomLeft, bbox.bottomRight].map(
      transform,
    );
    const left = Math.min(...points.map((p: Vector2) => p.x));
    const right = Math.max(...points.map((p: Vector2) => p.x));
    const top = Math.min(...points.map((p: Vector2) => p.y));
    const bottom = Math.max(...points.map((p: Vector2) => p.y));
    return {
      l: left,
      r: right,
      t: top,
      b: bottom,
      w: right - left,
      h: bottom - top,
      c: new Vector2((left + right) / 2, (top + bottom) / 2),
    };
  },
  worldBBox() {
    return this._transformedBBox((p: any) => this.localToWorld().transformPoint(p));
  },
  viewBBox() {
    return this._transformedBBox((p: any) => this.localToView().transformPoint(p));
  },
  // Getter/setter for view position – the coordinate system which has (0, 0)
  // at the center of the screen. Recommended over the absolute position, since
  // it handles view scaling correctly.
  viewPosition(pos?: PossibleVector2, ...args: any) {
    if (pos === undefined) {
      const res = this.view().worldToLocal().transformPoint(this.absolutePosition());
      return new Vector2(res.x, res.y);
    }
    return this.absolutePosition(
      this.view().localToWorld().transformPoint(pos),
      ...args,
    );
  },
  // Shortcut for moving a node to a position of a different node.
  to(other: Node, ...args: any): SimpleVector2Signal<Node> {
    return this.absolutePosition(other.absolutePosition(), ...args);
  },
  // Move along a vector in local coordinate space.
  shift(offset: PossibleVector2, ...args: any) {
    return this.position(this.position().add(offset), ...args);
  },
  // Move along a vector in view coordinate space.
  absoluteShift(offset: PossibleVector2, ...args: any) {
    return this.viewPosition(this.viewPosition().add(offset), ...args);
  },
  // Common function for nextTo and alignTo. buff is in view space.
  _next_to_align_to_helper(
    other: Node,
    dir: Direction,
    buff: number,
    mapping: any,
    dir_sign: number,
    duration?: number,
  ) {
    const thisBox = this.worldBBox();
    const otherBox = other.worldBBox();
    const offset_view = directedVector(dir, buff).mul(dir_sign);
    const offset_world = new Vector2(
      this.viewToWorld().transformPoint(offset_view),
    ).sub(this.viewToWorld().transformPoint(Vector2.zero));
    const newpos = new Vector2(mapping(thisBox, otherBox, dir) as [number, number]).add(
      offset_world,
    );
    return this.absolutePosition(newpos, duration);
  },
  // Move the node next to a different node in a given direction, with a buffer of size buff (in view space) inbetween. The other coordinate is centered.
  nextTo(other: Node, dir: Direction, buff: number = 0, ...args: any) {
    const mapping = (thisBox: any, otherBox: any, dir: Direction) =>
      ({
        left: [otherBox.l - thisBox.w / 2, otherBox.c.y],
        right: [otherBox.r + thisBox.w / 2, otherBox.c.y],
        up: [otherBox.c.x, otherBox.t - thisBox.h / 2],
        down: [otherBox.c.x, otherBox.b + thisBox.h / 2],
      })[dir];
    return this._next_to_align_to_helper(other, dir, buff, mapping, 1, ...args);
  },
  // Align the node to a different node in a given direction. The other coordinate is kept the same.
  alignTo(other: Node, dir: Direction, buff: number = 0, ...args: any) {
    const mapping = (thisBox: any, otherBox: any, dir: Direction) =>
      ({
        left: [otherBox.l + thisBox.w / 2, thisBox.c.y],
        right: [otherBox.r - thisBox.w / 2, thisBox.c.y],
        up: [thisBox.c.x, otherBox.t + thisBox.h / 2],
        down: [thisBox.c.x, otherBox.b - thisBox.h / 2],
      })[dir];
    return this._next_to_align_to_helper(other, dir, buff, mapping, -1, ...args);
  },
  // Move the node to the edge of a screen in a given direction.
  toEdge(dir: Direction, buff: number = 0, ...args: any) {
    // hack because for a view, we actually don't want to take the BBox (if there are things outside of the screen). We could instead refactor the function above, but eh.
    const dummy = (
      <Rect
        position={this.view().position()}
        size={this.view().size()}
        scale={this.view().scale()}
      />
    );
    const res = this.alignTo(dummy, dir, buff, ...args);
    dummy.dispose();
    return res;
  },
  toCorner(corner: Corner, gapX = 0, gapY = 0, ...args: any) {
    this.save();
    const horiz: Direction = corner == 'DL' || corner == 'UL' ? 'left' : 'right';
    const vert: Direction = corner == 'UL' || corner == 'UR' ? 'up' : 'down';
    this.toEdge(horiz, gapX);
    this.toEdge(vert, gapY);
    const pos = this.absolutePosition();
    this.restore();
    return this.absolutePosition(pos, ...args);
  },
};

// The rest of the file is patching magic generated by ChatGPT:
Object.assign(Node.prototype, nodeHelpers);

type MethodNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type MethodType<T> = {
  [K in MethodNames<T>]: T[K];
};

declare module '@motion-canvas/2d' {
  interface Node extends MethodType<typeof nodeHelpers> {}
}
