import { reactive } from 'vue';
import { db, getAllButtons, getSetting, putSetting, replaceAll, saveButton as saveButtonInDb, deleteButton as deleteButtonInDb, getButton } from './db.js';
import {
  bytesToUtf8,
  createSalt,
  decryptBytes,
  encryptText,
  formatDateTime,
  nowIso,
  utf8ToBytes,
  wipe,
} from './crypto.js';
import {
  callEntityToggle,
  fetchEntityState,
  fetchStates,
  getEntityDomain,
  setLightValues,
} from './homeAssistant.js';
import { fromCsv, toCsv } from './csv.js';

const CONFIG_KEY = 'ha-config';
const INACTIVITY_KEY = 'ui-state';
const DEFAULT_LOCK_MINUTES = 15;

function defaultButtonOrder(buttons) {
  return buttons.length ? Math.max(...buttons.map((button) => button.order || 0)) + 1 : 1;
}

function normalizeButton(button) {
  const kind = button.kind || (button.entityId?.startsWith('light.') ? 'light' : 'switch');
  return {
    id: button.id,
    label: button.label || button.entityId || 'Bouton',
    entityId: button.entityId || '',
    icon: button.icon || 'bolt',
    color: button.color || '#38bdf8',
    kind,
    order: Number(button.order || 0),
    createdAt: button.createdAt || nowIso(),
    updatedAt: button.updatedAt || nowIso(),
    state: button.state || 'unknown',
    attributes: button.attributes || {},
    lastSyncedAt: button.lastSyncedAt || null,
  };
}

export const appState = reactive({
  ready: false,
  busy: false,
  locked: true,
  setupNeeded: false,
  error: '',
  info: '',
  version: __APP_VERSION__,
  config: null,
  unlockHint: '',
  buttons: [],
  selectedButton: null,
  lastRelease: null,
  lastActivityAt: new Date().toISOString(),
  lockMinutes: DEFAULT_LOCK_MINUTES,
});

let inactivityTimer = null;
let autoLockTimer = null;

function setInfo(message) {
  appState.info = message;
}

function setError(message) {
  appState.error = message;
}

function clearTransientMessages() {
  appState.error = '';
  appState.info = '';
}

function syncFromRecord(record) {
  if (!record) {
    appState.config = null;
    appState.locked = true;
    appState.setupNeeded = true;
    return;
  }

  appState.config = {
    serverUrl: record.serverUrl,
    tokenSecret: record.tokenSecret,
    lockMinutes: record.lockMinutes || DEFAULT_LOCK_MINUTES,
    updatedAt: record.updatedAt,
    unlockedTokenBytes: null,
  };
  appState.lockMinutes = appState.config.lockMinutes;
  appState.setupNeeded = false;
  appState.locked = true;
}

export async function initialiseStore() {
  appState.busy = true;
  clearTransientMessages();
  try {
    const configRecord = await getSetting(CONFIG_KEY);
    syncFromRecord(configRecord?.value || null);
    const buttons = await getAllButtons();
    appState.buttons = buttons.map(normalizeButton);
    await refreshRemoteStates(false);
    registerActivity();
    startAutoLockTimer();
    appState.ready = true;
  } catch (error) {
    setError(error?.message || 'Erreur d’initialisation');
  } finally {
    appState.busy = false;
  }
}

export function registerActivity() {
  appState.lastActivityAt = nowIso();
  if (inactivityTimer) {
    window.clearTimeout(inactivityTimer);
  }
  inactivityTimer = window.setTimeout(() => {
    scheduleAutoLock();
  }, 30_000);
}

function startAutoLockTimer() {
  if (autoLockTimer) {
    window.clearInterval(autoLockTimer);
  }
  autoLockTimer = window.setInterval(() => {
    if (!appState.locked && appState.config) {
      const elapsed = Date.now() - new Date(appState.lastActivityAt).getTime();
      const limit = (appState.lockMinutes || DEFAULT_LOCK_MINUTES) * 60_000;
      if (elapsed >= limit) {
        lockApp();
      }
    }
  }, 10_000);
}

function scheduleAutoLock() {
  if (!appState.locked && appState.config) {
    const elapsed = Date.now() - new Date(appState.lastActivityAt).getTime();
    const limit = (appState.lockMinutes || DEFAULT_LOCK_MINUTES) * 60_000;
    if (elapsed >= limit) {
      lockApp();
    }
  }
}

export async function saveConfiguration({ serverUrl, token, masterPassword, lockMinutes }) {
  clearTransientMessages();
  const salt = createSalt();
  const tokenSecret = await encryptText(token, masterPassword, salt);
  await putSetting({
    key: CONFIG_KEY,
    value: {
      serverUrl: serverUrl.trim(),
      tokenSecret,
      lockMinutes: Number(lockMinutes || DEFAULT_LOCK_MINUTES),
      updatedAt: nowIso(),
    },
    updatedAt: nowIso(),
  });
  syncFromRecord((await getSetting(CONFIG_KEY)).value);
  const tokenBytes = utf8ToBytes(token);
  appState.config.unlockedTokenBytes = new Uint8Array(tokenBytes);
  wipe(tokenBytes);
  appState.locked = false;
  await refreshRemoteStates(true);
  registerActivity();
  setInfo('Configuration enregistrée');
}

export async function unlockApp(masterPassword) {
  if (!appState.config?.tokenSecret) {
    throw new Error('Aucune configuration');
  }
  const tokenBytes = await decryptBytes(appState.config.tokenSecret, masterPassword);
  appState.config.unlockedTokenBytes = new Uint8Array(tokenBytes);
  wipe(tokenBytes);
  appState.locked = false;
  await refreshRemoteStates(true);
  registerActivity();
  setInfo('Application déverrouillée');
}

export function lockApp() {
  if (appState.config?.unlockedTokenBytes) {
    wipe(appState.config.unlockedTokenBytes);
  }
  if (appState.config) {
    appState.config.unlockedTokenBytes = null;
  }
  appState.locked = true;
  setInfo('Application verrouillée');
}

export function getRuntimeConfig() {
  if (!appState.config || !appState.config.unlockedTokenBytes) {
    throw new Error('Configuration verrouillée');
  }
  return {
    serverUrl: appState.config.serverUrl,
    token: bytesToUtf8(appState.config.unlockedTokenBytes),
  };
}

export async function refreshRemoteStates(updateButtons = true) {
  if (!appState.config || !appState.config.unlockedTokenBytes) {
    return;
  }
  const runtime = getRuntimeConfig();
  const states = await fetchStates(runtime);
  if (updateButtons) {
    appState.buttons = appState.buttons.map((button) => {
      const remote = states.find((entry) => entry.entity_id === button.entityId);
      if (!remote) {
        return button;
      }
      return {
        ...button,
        state: remote.state,
        attributes: remote.attributes || {},
        lastSyncedAt: nowIso(),
        kind: button.kind || getEntityDomain(button.entityId),
      };
    });
  }
}

export async function toggleButtonState(button) {
  registerActivity();
  const runtime = getRuntimeConfig();
  const target = button.state === 'on' ? 'off' : 'on';
  await callEntityToggle(runtime, button.entityId, target);
  await refreshButtonState(button.id);
}

export async function refreshButtonState(id) {
  const button = await getButton(id);
  if (!button || !appState.config || !appState.config.unlockedTokenBytes) {
    return;
  }
  const runtime = getRuntimeConfig();
  const remote = await fetchEntityState(runtime, button.entityId);
  const updated = normalizeButton({
    ...button,
    state: remote.state,
    attributes: remote.attributes || {},
    lastSyncedAt: nowIso(),
  });
  await saveButtonInDb(updated);
  await reloadButtons();
}

export async function setLightState(id, payload) {
  registerActivity();
  const button = await getButton(id);
  if (!button) {
    return;
  }
  const runtime = getRuntimeConfig();
  await setLightValues(runtime, button.entityId, payload);
  await refreshButtonState(button.id);
}

export async function saveButton(button) {
  const normalized = normalizeButton({
    ...button,
    kind: button.kind || (button.entityId?.startsWith('light.') ? 'light' : 'switch'),
    updatedAt: nowIso(),
    createdAt: button.createdAt || nowIso(),
    order: button.order || defaultButtonOrder(appState.buttons),
  });
  await saveButtonInDb(normalized);
  await reloadButtons();
  return normalized;
}

export async function removeButton(id) {
  await deleteButtonInDb(id);
  await reloadButtons();
}

export async function reloadButtons() {
  const buttons = await getAllButtons();
  appState.buttons = buttons.map(normalizeButton);
}

export function getButtonById(id) {
  return appState.buttons.find((button) => Number(button.id) === Number(id));
}

export async function moveButton(id, direction) {
  const buttons = [...appState.buttons].sort((a, b) => a.order - b.order);
  const index = buttons.findIndex((button) => Number(button.id) === Number(id));
  if (index < 0) return;
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= buttons.length) return;
  const current = buttons[index];
  const target = buttons[targetIndex];
  const currentOrder = current.order;
  current.order = target.order;
  target.order = currentOrder;
  await saveButtonInDb(current);
  await saveButtonInDb(target);
  await reloadButtons();
}

export async function exportDatabaseCsv() {
  const settings = await db.settings.toArray();
  const buttons = await db.buttons.toArray();
  return toCsv([
    ...settings.map((row) => ({ table: 'settings', data: row })),
    ...buttons.map((row) => ({ table: 'buttons', data: row })),
  ]);
}

export async function importDatabaseCsv(text) {
  const rows = fromCsv(text);
  const settings = rows.filter((row) => row.table === 'settings').map((row) => row.data);
  const buttons = rows.filter((row) => row.table === 'buttons').map((row) => row.data);
  await replaceAll({ settings, buttons });
  await initialiseStore();
}

export function describeButtonState(button) {
  const label = button.state === 'on' ? 'Allumé' : button.state === 'off' ? 'Éteint' : 'Inconnu';
  return `${button.label} · ${label}`;
}

export function getEntityKind(entityId) {
  return getEntityDomain(entityId);
}

export function getConfigSummary() {
  if (!appState.config) {
    return 'Aucune configuration';
  }
  return `${appState.config.serverUrl} · verrouillage ${appState.lockMinutes} min`;
}

export function formatButtonDates(button) {
  return {
    createdAt: formatDateTime(button.createdAt),
    updatedAt: formatDateTime(button.updatedAt),
  };
}
