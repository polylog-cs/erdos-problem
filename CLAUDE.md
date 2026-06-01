# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Motion Canvas animation project for a Polylog video. Motion Canvas is a TypeScript framework for creating programmatic animations using generator functions and JSX-like syntax.

## Commands

- `./setup.sh` — First-time setup: clones the Polylog fork of Motion Canvas, builds it, installs deps, sets up pre-commit hooks
- `npm run start` — Start dev preview server at http://localhost:9000/
- `npm run build` — Production build (`tsc && vite build`)

There are no tests. A pre-commit hook auto-formats staged `src/` files with Prettier.

## Architecture

**Entry point**: `src/project.ts` registers scenes, imports `global.css`, and imports `./monkeypatch` (which extends Motion Canvas `Node` with helper methods like `worldToView`/`viewToWorld`). Scenes are imported with the `?scene` suffix (a Vite plugin convention). Scenes are toggled on/off by commenting lines in the `scenes` array.

**Scenes** (`src/scenes/`): Each scene exports a `makeScene2D()` generator function. Animations are sequenced by `yield`ing timing expressions (`waitFor`, `all`, `sequence`, signal tweens). Example/demo scenes live in `src/scenes/examples/`.

**Components** (`src/components/`): Reusable scene-graph nodes used across scenes.

**Utilities** (`src/utilities/`): Shared animation helpers and styled components:
- `color.tsx` — `Solarized` color palette, `FONT_FAMILY` constant, `colorLerp`
- `text.tsx` — `PolyTxt` component (styled `Txt`), `smartTextLerp` (diff-based character interpolation)
- `latex.tsx` — `PolyLatex` component with `write()`/`unwrite()` path-drawing animations
- `visuals.tsx` — Shadow creation
- `creation.tsx` — Generic appear/disappear/indicate helpers

**Shaders** (`src/shaders/`): GLSL fragment shaders (`gradient.glsl`, `rotate3d.glsl`) used for visual effects on nodes.

**Assets** (`src/assets/images/`): Character face images organized by participant (`vv/`, `vr/`) with expression variants.

**Audio** (`audio/`): Raw `.wav` files at the repo root. Wired up in [src/utilities/audio.tsx](src/utilities/audio.tsx).

## Sounds

All sounds live in `audio/` (e.g. `audio/spin.wav`, `audio/padlock/on1.wav`) and are exposed as named factories from `src/utilities/audio.tsx`. Each exported factory returns a fresh `SoundBuilder`; call `.play()` on it (eagerly, not via `yield*`) to fire it during a generator.

```ts
import { spinSound, padlockOnSound } from '../utilities/audio';

spinSound().play();          // fire-and-forget
yield* something(2);         // sound plays during this animation
```

**Adding a new sound**:
1. Drop the `.wav` into `audio/` (or a subfolder).
2. Add an export in [src/utilities/audio.tsx](src/utilities/audio.tsx) using `makeSound`
3. Import and call `fooSound().play()` at the desired point in the generator.

## Conventions

- **Resolution**: 1920×1080 at 60fps
- **Styling**: Solarized color scheme (`Solarized` object in `color.tsx`), TeX Gyre Schola font (`FONT_FAMILY`), 50px base font size. If the font hasn't loaded in the preview, force an HMR update by touching a file.
- **Formatting**: Prettier with 88-char line width, single quotes, trailing commas, sorted imports (via `@ianvs/prettier-plugin-sort-imports`)
- **Motion Canvas fork**: Uses `@polylog-cs/motion-canvas` (cloned locally into `motion-canvas/`), linked via npm workspaces

## Examples

The `examples/` directory contains ~30 TSX example files (plus GLSL shaders) organized in 3 sections, demonstrating Motion Canvas patterns from basics to advanced. When creating animations, consult `examples/REFERENCE.md` for a comprehensive code reference organized by concept (scene basics, animation flow, flexbox, signals, effects, camera, shaders, etc.). For full examples, read the individual `.tsx` files in `examples/`.
