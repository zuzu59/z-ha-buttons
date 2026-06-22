import Dexie from 'dexie';

export const db = new Dexie('z-ha-buttons');

db.version(1).stores({
  settings: '&key',
  buttons: '++id, order, entityId, kind, updatedAt',
});

export async function getSetting(key) {
  return db.settings.get(key);
}

export async function putSetting(record) {
  return db.settings.put(record);
}

export async function getAllButtons() {
  return db.buttons.orderBy('order').toArray();
}

export async function getButton(id) {
  return db.buttons.get(Number(id));
}

export async function saveButton(button) {
  return db.buttons.put(button);
}

export async function deleteButton(id) {
  return db.buttons.delete(Number(id));
}

export async function replaceAll({ settings = [], buttons = [] }) {
  await db.transaction('rw', db.settings, db.buttons, async () => {
    await db.settings.clear();
    await db.buttons.clear();
    if (settings.length) {
      await db.settings.bulkPut(settings);
    }
    if (buttons.length) {
      await db.buttons.bulkPut(buttons);
    }
  });
}
