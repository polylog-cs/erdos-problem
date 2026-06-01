# Video Animation Collaboration Preferences

Use these preferences when working with Vasek on mathematical video animations,
especially Motion Canvas projects.

## Interaction

- Ask as few questions as possible. Make reasonable assumptions and keep moving.
- Prefer doing the edit, running checks, and showing the result over giving long plans.
- Ask only when a choice is genuinely blocking or risky.
- Minimize permission prompts. Use already approved command patterns when available; request escalation only when needed for the task, with a short reason.
- Keep status updates concise and practical.

## Visual Style

- Aim for a compact, clear, mathematical "Polylog-style" animation: calm layout, clean geometry, sparse text, and formulas doing most of the explanatory work.
- Use LaTeX for mathematical text and formulas.
- Formula text should usually be black. Use gray only for de-emphasized previous facts, unless specifically requested otherwise.
- Avoid unnecessary explanatory paragraphs on canvas. Prefer one or two precise formulas or labels.
- Keep point sets and diagrams visually stable unless the requested idea requires motion. Avoid accidental scaling, drifting, or graying.

## Layout Quality

- Do not rely only on TypeScript/build success. Capture screenshots of representative frames and inspect them.
- Always check formula-heavy frames for overlaps, off-canvas text, bad alignment, and collisions with diagrams.
- Keep the lower subtitle area mostly clear. Prefer putting formulas/captions at the top, top-right, or side of the main picture rather than near the bottom edge.
- For Motion Canvas scenes, screenshot at least:
  - the first meaningful visible state,
  - the main transition/animation being changed,
  - formula-heavy frames,
  - the final bound/result frame.
- Patch positions, font sizes, or line breaks until screenshots look coherent.

## Motion Canvas Workflow

- Start or reuse the Vite dev server when needed.
- Run `npx tsc --noEmit` and `npm run build` after meaningful edits.
- In this repo, screenshots can be captured with:

  ```bash
  npm run screenshot -- --frame 1000 --out screenshots/example.png
  ```

- The screenshot script opens the local Motion Canvas editor in headless Chrome, seeks to the requested frame through `localStorage`, extracts the 1920x1080 preview canvas, and saves a PNG.
- If starting a new Motion Canvas project, create or reuse a similar screenshot script early so visual checks are part of the normal loop.

## Mathematical Animation Preferences

- Keep formulas exact when that makes narration easier to follow; introduce approximations explicitly with `\approx` when desired.
- Prefer simple inequalities `\le` and `\ge` unless another relation is explicitly requested.
- When explaining asymptotics, it is fine to keep constants in formulas if they help the story.
- For counting arguments, make the visual count and formula count line up spatially: local formula near the local picture, global computation below or beside it with left alignment.
