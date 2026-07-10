import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

describe('application version', () => {
  it('is bumped above 0.0.18', () => {
    expect(packageJson.version).not.toBe('0.0.18');
  });
});
