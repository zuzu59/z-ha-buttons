import { describe, expect, it } from 'vitest';
import { createSmokePlan } from './browser-smoke.mjs';

describe('browser smoke workflow', () => {
  it('uses one visible preview server on port 4173', () => {
    const plan = createSmokePlan();
    expect(plan.previewPort).toBe(4173);
    expect(plan.allowedPreviewServers).toBe(1);
    expect(plan.cleanupEnsuresNoStrayServers).toBe(true);
  });
});
