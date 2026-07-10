#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PREVIEW_PORT = 4173;
const DEVTOOLS_PORT = 9222;

export function createSmokePlan() {
  return {
    previewPort: PREVIEW_PORT,
    allowedPreviewServers: 1,
    cleanupEnsuresNoStrayServers: true,
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toExitPromise(child) {
  return new Promise((resolve) => {
    child.once('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

function attachLogging(child, prefix) {
  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${prefix}] ${chunk}`);
  });
  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${prefix}] ${chunk}`);
  });
}

function resolveChromiumBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    '/home/ubuntu/.local/bin/chromium-browser',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('No Chromium binary found');
}

async function waitForUrl(url, timeoutMs = 30000) {
  const startedAt = Date.now();
  let lastError = null;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Unexpected status ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(1000);
  }

  throw lastError || new Error(`Timed out waiting for ${url}`);
}

async function waitForDevTools(timeoutMs = 30000) {
  await waitForUrl(`http://127.0.0.1:${DEVTOOLS_PORT}/json/version`, timeoutMs);
}

function spawnPreviewServer() {
  const child = spawn('npm', [
    'exec',
    'vite',
    '--',
    'preview',
    '--host',
    '0.0.0.0',
    '--port',
    String(PREVIEW_PORT),
    '--strictPort',
  ], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  attachLogging(child, 'preview');
  return child;
}

function spawnChromium(userDataDir) {
  const binary = resolveChromiumBinary();
  const child = spawn(binary, [
    '--headless',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${DEVTOOLS_PORT}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], {
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  attachLogging(child, 'chromium');
  return child;
}

async function connectAndReadBodyText(pageUrl) {
  const version = await fetch(`http://127.0.0.1:${DEVTOOLS_PORT}/json/version`).then((response) => response.json());
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 0;

  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) {
      return;
    }
    const entry = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) {
      entry.reject(new Error(message.error.message || 'DevTools error'));
      return;
    }
    entry.resolve(message.result || {});
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Page.navigate', { url: pageUrl }, sessionId);

  let text = '';
  const startedAt = Date.now();
  while (Date.now() - startedAt < 20000) {
    await delay(250);
    const result = await send(
      'Runtime.evaluate',
      { expression: 'document.body.innerText', returnByValue: true },
      sessionId,
    );
    text = String(result.result?.value || '').trim();
    if (text.length > 0) {
      break;
    }
  }

  await ws.close();
  return text;
}

async function stopChild(child) {
  if (!child || child.killed) {
    return;
  }
  const signalTargets = child.pid ? [-child.pid, child.pid] : [child.pid];
  for (const target of signalTargets) {
    try {
      if (target) {
        process.kill(target, 'SIGTERM');
      }
    } catch {
      // ignore process-group cleanup failures
    }
  }
  await Promise.race([
    toExitPromise(child),
    delay(5000),
  ]);
  for (const target of signalTargets) {
    try {
      if (target) {
        process.kill(target, 'SIGKILL');
      }
    } catch {
      // ignore process-group cleanup failures
    }
  }
}

export async function runBrowserSmoke() {
  const plan = createSmokePlan();
  const preview = spawnPreviewServer();
  const userDataDir = await mkdtemp(join(tmpdir(), 'z-ha-buttons-chromium-'));
  const chromium = spawnChromium(userDataDir);

  try {
    await waitForUrl(`http://127.0.0.1:${plan.previewPort}`);
    await waitForDevTools();
    const text = await connectAndReadBodyText(`http://127.0.0.1:${plan.previewPort}`);

    if (!text) {
      throw new Error('Browser page stayed empty');
    }

    console.log(`Headless browser text: ${text.replace(/\s+/g, ' ').slice(0, 200)}`);
    return text;
  } finally {
    await stopChild(chromium);
    await stopChild(preview);
    await rm(userDataDir, { force: true, recursive: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runBrowserSmoke().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
