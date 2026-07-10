#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const child = spawn('npm', [
  'exec',
  'vite',
  '--',
  'preview',
  '--host',
  '0.0.0.0',
  '--port',
  '4173',
  '--strictPort',
], {
  cwd: root,
  stdio: 'inherit',
  env: process.env,
  detached: true,
});

function stop(signal) {
  if (!child.pid) {
    return;
  }
  try {
    process.kill(-child.pid, signal);
  } catch {
    try {
      process.kill(child.pid, signal);
    } catch {
      // ignore shutdown failures
    }
  }
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) {
    process.exitCode = 0;
    return;
  }
  process.exitCode = code ?? 0;
});
