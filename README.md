# Polylog Video Template

Run `./setup.sh` to set up the project. This script will:
- Install Motion Canvas from source (needed because audio support is not yet in the npm package)
- Install other `npm` packages
- Set up pre-commit hooks in a Python virtual environment

After setup is complete, run `npm run start` to start the preview server.
It'll be available on http://localhost:9000/.

## Working with LLMs
When using LLMs for Motion Canvas development, using [repomix](https://repomix.com/) to provide context on Motion Canvas, as well as the typical way we write animations, is useful.
You can use this repository, as well as the more general https://github.com/xiaoxiae/motion-canvas-examples/.

You likely want to run something like `repomix --include "**/*.tsx,**/*.glsl"` so only animation/shader files are packed.

## Sounds used

Locks: https://freesound.org/people/Davidjala/sounds/594999/

Clockwork: https://freesound.org/people/apintofmild/sounds/641577/

Box: https://freesound.org/people/OverlookHotelRecords/sounds/271378/

Texting: https://freesound.org/people/soundandmelodies/sounds/776192/ (just a recording of iOS's typing sound effect)

## Unit Distance / Erdos Problem Scenes

The active video scenes copied from the old Desktop workspace are in `src/scenes/`, with shared helpers in `src/lib/` and assets in `public/reference/`. The current project order is defined in `src/project.ts`.

Useful commands:

```bash
npm run dev
npx tsc --noEmit
npm run build
npm run export-scenes -- --scenes gridPythagoreanDistances,primeProductSweep --fps 20 --scale 0.5 --quality 70 --run medium-quality-pythagorean-scenes
```

Codex collaboration and visual-check preferences are in `AGENTS.md`. The previous project README was copied to `docs/unit-distance-motion-canvas-readme.md`. Existing rendered MP4s were copied to `exports/`.
