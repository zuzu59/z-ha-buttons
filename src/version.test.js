import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

describe('application version', () => {
  it('is bumped to 0.0.20', () => {
    expect(packageJson.version).toBe('0.0.20');
  });
});
