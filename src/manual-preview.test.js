import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

describe('manual preview launch', () => {
  it('exposes a preview:manual command on port 4173', () => {
    expect(packageJson.scripts['preview:manual']).toBe(
      'vite preview --host 0.0.0.0 --port 4173 --strictPort',
    );
  });
});
