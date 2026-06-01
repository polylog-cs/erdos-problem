# Unit Distance Motion Canvas Anims

This folder contains Motion Canvas scenes for the unit-distance video. The current project order is:

- `unitDistanceRulerIntro`
- `cherryCountingTwoWays`
- `gridPythagoreanDistances`
- `primeProductSweep`

The original PNGs are copied into `public/reference/` for side-by-side reference, but the scenes animate vector geometry directly.

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL and use the Motion Canvas editor to preview or export scenes. The project entry point is `src/project.ts`.

## Export

With the dev server running, export review frames for the current scenes with:

```bash
npm run export-scenes -- --scenes unitDistanceRulerIntro,cherryCountingTwoWays,gridPythagoreanDistances,primeProductSweep --fps 10 --scale 0.25 --quality 35 --run low-quality-review
```

The frame folders are written to `output/<run>/`. Encode them with `ffmpeg`, for example:

```bash
ffmpeg -y -framerate 10 -i output/low-quality-review/unitDistanceRulerIntro/%06d.jpeg -vf format=yuv420p -c:v libx264 -preset veryfast -crf 34 exports/unitDistanceRulerIntro-low.mp4
```

## Notes

- Use `--fullGridDots 1` for final renders of the 65-distance grid; preview renders keep the lattice sparse for speed.
- Prefer LaTeX for formulas and keep equations high enough to leave room for subtitles.
- Use `scripts/screenshot-motion.mjs` or the export script for visual checks before calling a scene finished.
