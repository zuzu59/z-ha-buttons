<!-- pi-code-planner:contracts:start -->
## Planner Contracts

### Purpose
Repository root contract for the Vue 3 Home Assistant buttons app.

### Parent
- `(root)`

### Child Index
- (none)

### Stable Contracts
- Use Vitest for regression tests and keep the test script aligned with `npm test`.
- Post-write Home Assistant state refreshes must preserve the delayed retry policy (1 second between attempts, up to 3 retries).
- Toggle and light-setting flows must share the same post-write refresh path so Dexie and `appState.buttons` stay in sync with confirmed remote state.
- The browser smoke workflow must keep preview bound to port 4173 with strict port binding and clean up all local preview/browser processes after verification.
- The manual preview workflow must expose a `preview:manual` launch path that serves the planner worktree build on port 4173 and stays open until manually stopped.

### Read First
- package.json
- README.md
- src/lib/store.js
- src/lib/homeAssistant.js
- scripts/browser-smoke.mjs

### Do Not Touch Unless
- Do not alter the delayed refresh semantics or split toggle/light refresh logic without replanning.
- Do not add unrelated test infrastructure or contract files in subdirectories unless a new durable architectural domain appears.

### Domain Details
- The app is a Vue 3 + Vite PWA that stores button state locally in Dexie and syncs entity state from Home Assistant.
- The active regression task introduced Vitest-based tests for the delayed refresh flow.
- The browser smoke helper is a repeatable verification path: one preview server on `4173` -> Chromium headless -> cleanup of all spawned processes.
- The manual preview alias is for interactive inspection before acceptance and should remain distinct from the auto-cleaning smoke workflow.
<!-- pi-code-planner:contracts:end -->
