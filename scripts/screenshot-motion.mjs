#!/usr/bin/env node
import {spawn} from 'node:child_process';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

const args = new Map();
for (let index = 2; index < process.argv.length; index++) {
  const arg = process.argv[index];
  if (!arg.startsWith('--')) {
    continue;
  }

  const [key, inlineValue] = arg.slice(2).split('=', 2);
  const value =
    inlineValue ?? (process.argv[index + 1]?.startsWith('--') ? 'true' : process.argv[++index]);
  args.set(key, value);
}

const url = args.get('url') ?? 'http://127.0.0.1:9000/';
const frame = Number(args.get('frame') ?? 0);
const out = args.get('out') ?? `screenshots/frame-${frame}.png`;
const width = Number(args.get('width') ?? 1600);
const height = Number(args.get('height') ?? 900);
const project = args.get('project') ?? 'project';

if (!Number.isFinite(frame) || frame < 0) {
  throw new Error(`Invalid --frame value: ${args.get('frame')}`);
}

const userDataDir = await mkdtemp(path.join(tmpdir(), 'motion-chrome-'));
const chrome = spawn(
  'google-chrome',
  [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-background-networking',
    '--disable-crash-reporter',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-sync',
    '--hide-scrollbars',
    '--mute-audio',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    `--window-size=${width},${height}`,
    'about:blank',
  ],
  {stdio: ['ignore', 'pipe', 'pipe']},
);

let stderr = '';
chrome.stderr.on('data', chunk => {
  stderr += chunk.toString();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForDevToolsPort() {
  const activePortPath = path.join(userDataDir, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const [port] = (await readFile(activePortPath, 'utf8')).trim().split('\n');
      if (port) {
        return Number(port);
      }
    } catch {
      // Chrome has not written the file yet.
    }

    await sleep(100);
  }

  throw new Error(`Chrome did not expose a DevTools port.\n${stderr}`);
}

class CdpSession {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.events = new Map();

    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
        } else {
          pending.resolve(message.result ?? {});
        }
        return;
      }

      const listeners = this.events.get(message.method) ?? [];
      for (const listener of listeners) {
        listener(message.params ?? {});
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.socket.send(JSON.stringify({id, method, params}));

    return new Promise((resolve, reject) => {
      this.pending.set(id, {resolve, reject});
    });
  }

  waitFor(method, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const listener = params => {
        clearTimeout(timeout);
        const listeners = this.events.get(method) ?? [];
        this.events.set(
          method,
          listeners.filter(candidate => candidate !== listener),
        );
        resolve(params);
      };

      const listeners = this.events.get(method) ?? [];
      listeners.push(listener);
      this.events.set(method, listeners);
    });
  }
}

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }

  return result.result.value;
}

async function waitFor(cdp, expression, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const value = await evaluate(cdp, expression);
    if (value) {
      return value;
    }

    await sleep(250);
  }

  throw new Error(`Timed out waiting for expression:\n${expression}`);
}

try {
  const port = await waitForDevToolsPort();
  const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then(response =>
    response.json(),
  );
  const page = pages.find(candidate => candidate.type === 'page') ?? pages[0];
  const socket = new WebSocket(page.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, {once: true});
    socket.addEventListener('error', reject, {once: true});
  });

  const cdp = new CdpSession(socket);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      try {
        localStorage.setItem(${JSON.stringify(`${project}/frame`)}, ${JSON.stringify(JSON.stringify(frame))});
        localStorage.setItem(${JSON.stringify(`${project}/player`)}, JSON.stringify({
          loop: true,
          muted: true,
          volume: 1,
          speed: 1,
          paused: true
        }));
      } catch (error) {
        console.error(error);
      }
    `,
  });

  const loaded = cdp.waitFor('Page.loadEventFired');
  await cdp.send('Page.navigate', {url});
  await loaded;

  await waitFor(
    cdp,
    `(() => {
      const code = [...document.querySelectorAll('code')]
        .map(element => element.textContent ?? '')
        .find(text => /\\[\\d+\\]/.test(text));
      const match = code?.match(/\\[(\\d+)\\]/);
      return match ? Number(match[1]) === ${frame} : false;
    })()`,
  );

  await waitFor(
    cdp,
    `(() => [...document.querySelectorAll('canvas')]
      .some(canvas => canvas.width === 1920 && canvas.height === 1080))()`,
  );

  await sleep(1000);

  const dataUrl = await evaluate(
    cdp,
    `(() => {
      const canvas = [...document.querySelectorAll('canvas')]
        .find(canvas => canvas.width === 1920 && canvas.height === 1080);
      return canvas?.toDataURL('image/png') ?? null;
    })()`,
  );

  if (!dataUrl) {
    throw new Error('Could not find the Motion Canvas preview canvas.');
  }

  const data = dataUrl.slice(dataUrl.indexOf(',') + 1);
  await writeFile(out, Buffer.from(data, 'base64'));
  console.log(`saved ${out}`);

  socket.close();
} finally {
  chrome.kill('SIGTERM');
  await sleep(250);
  await rm(userDataDir, {recursive: true, force: true});
}
