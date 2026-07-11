import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());

function readText(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

describe('application icon', () => {
  it('uses the local PNG icon in the HTML shell and PWA manifest', () => {
    expect(readText('index.html')).toContain('%BASE_URL%app-icon.png');
    expect(readText('vite.config.js')).toContain("src: 'app-icon.png'");
    expect(readText('vite.config.js')).toContain("type: 'image/png'");
    expect(readText('vite.config.js')).toContain("scope: base");
  });
});
