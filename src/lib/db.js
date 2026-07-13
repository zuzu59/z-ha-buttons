import Dexie from 'dexie'

let db = null

export async function createAppStore() {
  if (db) return db

  db = new Dexie('z-ha-buttons')

  db.version(10).stores({
    settings: '&key, value, updatedAt',
    buttons: '++id, [entityId+kind], order, entityId, kind, updatedAt',
    buttonOrder: '&key, value, updatedAt'
  })

  return db
}

// --- Settings ---

export async function getSetting(key) {
  const row = await db.settings.get(key)
  return row?.value ?? null
}

export async function saveSetting(key, value) {
  await db.settings.put({
    key,
    value: JSON.stringify(value),
    updatedAt: new Date().toISOString()
  })
}

export async function deleteSetting(key) {
  await db.settings.delete(key)
}

// --- Buttons ---

export async function getButtons() {
  return await db.buttons.toArray()
}

export async function getButton(id) {
  return await db.buttons.get(id)
}

export async function addButton(button) {
  return await db.buttons.add({
    ...button,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: '',
    attributes: {},
    lastSyncedAt: null
  })
}

export async function updateButton(id, updates) {
  await db.buttons.update(id, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
}

export async function deleteButton(id) {
  await db.buttons.delete(id)
}

export async function syncButtonState(id, state, attributes = {}) {
  await db.buttons.update(id, {
    state,
    attributes,
    lastSyncedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
}

// --- Button Order ---

export async function getButtonOrder() {
  const row = await db.buttonOrder.get('button-order')
  if (!row) return null
  try {
    return JSON.parse(row.value)
  } catch {
    return null
  }
}

export async function saveButtonOrder(ids) {
  await db.buttonOrder.put({
    key: 'button-order',
    value: JSON.stringify(ids),
    updatedAt: new Date().toISOString()
  })
}

// --- Reset ---

export async function resetDB() {
  await db.delete()
  db = null
}

// --- CSV Export/Import ---

export async function exportDB() {
  const settings = await db.settings.toArray()
  const buttons = await db.buttons.toArray()
  const order = await db.buttonOrder.toArray()
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    settings,
    buttons,
    buttonOrder: order
  }
}

export async function importDB(data) {
  if (!data || !data.buttons) throw new Error('Données CSV invalides')
  await db.delete()
  db = null
  db = new Dexie('z-ha-buttons')
  db.version(10).stores({
    settings: '&key, value, updatedAt',
    buttons: '++id, [entityId+kind], order, entityId, kind, updatedAt',
    buttonOrder: '&key, value, updatedAt'
  })

  if (data.settings) await db.settings.bulkPut(data.settings)
  if (data.buttons) await db.buttons.bulkPut(data.buttons)
  if (data.buttonOrder) await db.buttonOrder.bulkPut(data.buttonOrder)
}

export default db
