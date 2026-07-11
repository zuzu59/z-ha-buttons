import { describe, expect, it } from 'vitest';
import { compareVersions, extractLatestChangelogVersion } from './changelog.js';

describe('changelog helpers', () => {
  it('extracts the top changelog version', () => {
    const markdown = `# Journal\n\n## [0.0.24] - 2026-07-11 11:54\n\n### Modifié\n- Exemple`;
    expect(extractLatestChangelogVersion(markdown)).toBe('0.0.24');
  });

  it('detects when GitHub changelog is newer than the current app version', () => {
    expect(compareVersions('0.0.24', '0.0.25')).toBeGreaterThan(0);
    expect(compareVersions('0.0.25', '0.0.25')).toBe(0);
    expect(compareVersions('0.0.26', '0.0.25')).toBeLessThan(0);
  });
});
