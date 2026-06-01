import {
  Renderer,
  RendererResult,
  Vector2,
  type Project,
  type RendererSettings,
  type Scene,
} from '@motion-canvas/core';

import project from './project?project';

type ExportStatus = {
  done: boolean;
  error: string | null;
  progress: string;
  outputName: string;
  scenes: SceneExportInfo[];
};

type SceneExportInfo = {
  name: string;
  firstFrame: number;
  lastFrame: number;
  frameCount: number;
};

declare global {
  interface Window {
    __motionExportStatus?: ExportStatus;
  }
}

const params = new URLSearchParams(window.location.search);
const sceneNames = (params.get('scenes') ?? '')
  .split(',')
  .map(name => name.trim())
  .filter(Boolean);
const fps = Number(params.get('fps') ?? 12);
const scale = Number(params.get('scale') ?? 0.333333);
const quality = Number(params.get('quality') ?? 45);
const outputName = params.get('run') ?? `export-${Date.now()}`;

const statusElement = document.getElementById('status');

function setStatus(partial: Partial<ExportStatus>) {
  window.__motionExportStatus = {
    done: false,
    error: null,
    progress: 'starting',
    outputName,
    scenes: [],
    ...window.__motionExportStatus,
    ...partial,
  };

  if (statusElement) {
    statusElement.textContent = window.__motionExportStatus.progress;
  }
}

function settingsFor(range: [number, number]): RendererSettings {
  return {
    name: outputName,
    range,
    fps,
    size: new Vector2(1920, 1080),
    resolutionScale: scale,
    colorSpace: 'srgb',
    background: null,
    exporter: {
      name: '@motion-canvas/core/image-sequence',
      options: {
        fileType: 'image/jpeg',
        quality,
        groupByScene: true,
      },
    },
  };
}

async function getSceneInfo(project: Project): Promise<SceneExportInfo[]> {
  const renderer = new Renderer(project);
  const internals = renderer as unknown as {
    playback: {
      fps: number;
      state: number;
      recalculate(): Promise<void>;
      onScenesRecalculated: {current: Scene[]};
    };
    reloadScenes(settings: RendererSettings): Promise<void>;
    sharedWebGLContext?: {dispose(): void};
  };

  internals.playback.fps = fps;
  internals.playback.state = 1;
  await internals.reloadScenes(settingsFor([0, Number.POSITIVE_INFINITY]));
  await internals.playback.recalculate();
  const scenes = internals.playback.onScenesRecalculated.current.map(scene => ({
    name: scene.name,
    firstFrame: scene.firstFrame,
    lastFrame: scene.lastFrame,
    frameCount: Math.max(0, scene.lastFrame - scene.firstFrame),
  }));

  internals.sharedWebGLContext?.dispose();
  return scenes;
}

async function renderScene(scene: SceneExportInfo, index: number, total: number) {
  const renderer = new Renderer(project);
  let result: RendererResult | null = null;

  const unsubscribeFinished = renderer.onFinished.subscribe(finishedResult => {
    result = finishedResult;
  });
  const unsubscribeFrame = renderer.onFrameChanged.subscribe(frame => {
    const rendered = Math.max(0, frame - scene.firstFrame + 1);
    setStatus({
      progress: `Rendering ${scene.name} (${index + 1}/${total}) frame ${Math.min(
        rendered,
        scene.frameCount,
      )}/${scene.frameCount}`,
    });
  });

  const firstSecond = scene.firstFrame / fps;
  const lastSecond = Math.max(scene.firstFrame, scene.lastFrame - 1) / fps;
  await renderer.render(settingsFor([firstSecond, lastSecond]));

  unsubscribeFrame();
  unsubscribeFinished();

  if (result !== RendererResult.Success) {
    throw new Error(`Renderer finished with result ${result} for ${scene.name}`);
  }
}

async function main() {
  if (!Number.isFinite(fps) || fps <= 0) {
    throw new Error(`Invalid fps: ${params.get('fps')}`);
  }

  if (!Number.isFinite(scale) || scale <= 0 || scale > 1) {
    throw new Error(`Invalid scale: ${params.get('scale')}`);
  }

  const scenes = await getSceneInfo(project);
  const selected =
    sceneNames.length === 0
      ? scenes
      : sceneNames.map(name => {
          const scene = scenes.find(candidate => candidate.name === name);
          if (!scene) {
            throw new Error(`Scene not found: ${name}`);
          }
          return scene;
        });

  setStatus({scenes, progress: `Rendering ${selected.length} scene(s)`});

  for (let index = 0; index < selected.length; index++) {
    await renderScene(selected[index], index, selected.length);
  }

  setStatus({done: true, progress: `Done: ${outputName}`});
}

setStatus({progress: 'Loading project'});

main().catch(error => {
  const message = error instanceof Error ? error.message : String(error);
  setStatus({done: true, error: message, progress: `Error: ${message}`});
  console.error(error);
});
