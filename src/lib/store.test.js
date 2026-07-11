import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getButton: vi.fn(),
  saveButton: vi.fn(),
  deleteButton: vi.fn(),
  getAllButtons: vi.fn(),
  getSetting: vi.fn(),
  putSetting: vi.fn(),
  replaceAll: vi.fn(),
  saveButtonInDb: vi.fn(),
  callEntityToggle: vi.fn(),
  fetchEntityState: vi.fn(),
  fetchStates: vi.fn(),
  getEntityDomain: vi.fn((entityId) => String(entityId || '').split('.')[0] || 'switch'),
  setLightValues: vi.fn(),
  bytesToUtf8: vi.fn(() => 'mock-token'),
  createSalt: vi.fn(),
  decryptBytes: vi.fn(),
  encryptText: vi.fn(),
  formatDateTime: vi.fn((value) => value),
  nowIso: vi.fn(() => '2026-07-10T12:00:00.000Z'),
  utf8ToBytes: vi.fn(),
  wipe: vi.fn(),
  fromCsv: vi.fn(),
  toCsv: vi.fn(),
}));

vi.mock('./db.js', () => ({
  db: {
    buttons: {
      bulkPut: vi.fn(),
    },
    settings: {
      toArray: vi.fn(),
    },
    transaction: vi.fn(),
  },
  deleteButton: mocks.deleteButton,
  getAllButtons: mocks.getAllButtons,
  getButton: mocks.getButton,
  getSetting: mocks.getSetting,
  putSetting: mocks.putSetting,
  replaceAll: mocks.replaceAll,
  saveButton: mocks.saveButtonInDb,
}));

vi.mock('./crypto.js', () => ({
  bytesToUtf8: mocks.bytesToUtf8,
  createSalt: mocks.createSalt,
  decryptBytes: mocks.decryptBytes,
  encryptText: mocks.encryptText,
  formatDateTime: mocks.formatDateTime,
  nowIso: mocks.nowIso,
  utf8ToBytes: mocks.utf8ToBytes,
  wipe: mocks.wipe,
}));

vi.mock('./homeAssistant.js', () => ({
  callEntityToggle: mocks.callEntityToggle,
  fetchEntityState: mocks.fetchEntityState,
  fetchStates: mocks.fetchStates,
  getEntityDomain: mocks.getEntityDomain,
  setLightValues: mocks.setLightValues,
}));

vi.mock('./csv.js', () => ({
  fromCsv: mocks.fromCsv,
  toCsv: mocks.toCsv,
}));

import { appState, setLightState, toggleButtonState } from './store.js';

function seedRuntimeConfig() {
  appState.config = {
    serverUrl: 'https://ha.example',
    homeAssistantName: 'HA',
    tokenSecret: 'secret',
    masterPassword: 'password',
    lockMinutes: 15,
    updatedAt: '2026-07-10T12:00:00.000Z',
    unlockedTokenBytes: new Uint8Array([1, 2, 3]),
  };
  appState.locked = false;
}

function seedButton(button) {
  mocks.getButton.mockResolvedValue(button);
  appState.buttons = [button];
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  seedRuntimeConfig();
});

afterEach(() => {
  vi.useRealTimers();
});

describe.each([
  ['toggleButtonState', (button) => toggleButtonState(button), { id: 1, entityId: 'switch.kitchen', state: 'off', kind: 'switch' }],
  ['setLightState', (button) => setLightState(button.id, { brightness_pct: 65 }), { id: 2, entityId: 'light.salon', state: 'off', kind: 'light' }],
])('%s', (_label, invokeFlow, button) => {
  it('waits before reading back the confirmed state', async () => {
    seedButton(button);
    mocks.callEntityToggle.mockResolvedValue(undefined);
    mocks.setLightValues.mockResolvedValue(undefined);
    mocks.saveButtonInDb.mockResolvedValue(button.id);
    mocks.fetchEntityState
      .mockResolvedValueOnce({ entity_id: button.entityId, state: 'off', attributes: { stale: true } })
      .mockResolvedValueOnce({ entity_id: button.entityId, state: 'off', attributes: { stale: true } })
      .mockResolvedValueOnce({ entity_id: button.entityId, state: 'on', attributes: { fresh: true } });

    const task = invokeFlow(button);

    await Promise.resolve();
    expect(mocks.fetchEntityState).not.toHaveBeenCalled();
    expect(mocks.saveButtonInDb).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1999);
    expect(mocks.fetchEntityState).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(mocks.fetchEntityState).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1000);
    expect(mocks.fetchEntityState).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1000);
    expect(mocks.fetchEntityState).toHaveBeenCalledTimes(3);

    await task;

    expect(mocks.saveButtonInDb).toHaveBeenCalledWith(expect.objectContaining({ state: 'on' }));
    expect(appState.buttons[0]).toEqual(expect.objectContaining({ state: 'on' }));
  });
});
