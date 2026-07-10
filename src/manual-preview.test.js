import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

describe('manual preview launch', () => {
  it('delegates preview:manual to a dedicated helper on port 4173', () => {
    expect(packageJson.scripts['preview:manual']).toBe('node scripts/manual-preview.mjs');
  });
});
