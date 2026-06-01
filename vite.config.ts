import {defineConfig} from 'vite';
import motionCanvasModule from '@motion-canvas/vite-plugin';

const motionCanvas =
  'default' in motionCanvasModule
    ? motionCanvasModule.default
    : motionCanvasModule;

export default defineConfig({
  plugins: [motionCanvas()],
});
