import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const routerSource = readFileSync(resolve(process.cwd(), 'src/router.js'), 'utf8');

describe('router base', () => {
  it('uses Vite base URL for GitHub Pages deployment', () => {
    expect(routerSource).toContain('createWebHistory(import.meta.env.BASE_URL)');
  });
});
