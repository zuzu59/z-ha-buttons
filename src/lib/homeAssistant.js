/**
 * Communication avec Home Assistant via WebSocket API
 */

// Délais de rafraîchissement après action
const POST_ACTION_DELAY = 2000  // 2 secondes avant première lecture
const RETRY_DELAY = 1000        // 1 seconde entre retries
const MAX_RETRIES = 3

function getWsUrl(serverUrl, token) {
  const base = serverUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  const protocol = serverUrl.startsWith('https') ? 'wss' : 'ws'
  return `${protocol}://${base}/api/websocket`
}

function sendMessage(ws, msg) {
  return new Promise((resolve, reject) => {
    // Ne jamais ajouter d'id pour le message auth (HA le rejette)
    const id = msg.type === 'auth' ? null : Math.floor(Math.random() * 1000000)
    const payload = { ...msg }
    if (id !== null) payload.id = id
    const handler = (event) => {
      const data = JSON.parse(event.data)
      // HA renvoie auth_ok/auth_invalid SANS id - matcher sur le type
      if (data.id === id || data.type === 'auth_ok' || data.type === 'auth_invalid') {
        ws.removeEventListener('message', handler)
        if (data.type === 'result') {
          resolve(data.result)
        } else if (data.type === 'auth_invalid') {
          reject(new Error('Token invalide'))
        } else {
          resolve(data)
        }
      }
    }
    ws.addEventListener('message', handler)
    ws.send(JSON.stringify(payload))

    // Timeout 10s
    setTimeout(() => {
      ws.removeEventListener('message', handler)
      reject(new Error('Timeout communication Home Assistant'))
    }, 10000)
  })
}

async function authenticate(ws, token) {
  const result = await sendMessage(ws, { type: 'auth', access_token: token })
  if (result.type === 'auth_invalid') {
    throw new Error('Token Home Assistant invalide')
  }
  if (result.type !== 'auth_ok') {
    throw new Error(`Authentification échouée: ${result.type}`)
  }
}

function openConnection(serverUrl, token) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(getWsUrl(serverUrl, token))

    ws.onopen = () => {
      authenticate(ws, token)
        .then(() => resolve(ws))
        .catch(reject)
    }

    ws.onerror = () => reject(new Error('Impossible de se connecter à Home Assistant'))
    ws.onclose = () => {}
  })
}

async function closeConnection(ws) {
  try {
    await sendMessage(ws, { type: 'close' })
    ws.close()
  } catch {
    ws.close()
  }
}

// --- Actions publiques ---

export async function pingHomeAssistant(config) {
  if (!config?.serverUrl || !config?.tokenSecret) {
    throw new Error('Configuration manquante')
  }
  const ws = await openConnection(config.serverUrl, config.tokenSecret)
  try {
    await closeConnection(ws)
    return true
  } catch (err) {
    throw new Error(`Erreur de connexion: ${err.message}`)
  }
}

export async function fetchStates(config) {
  if (!config?.serverUrl || !config?.tokenSecret) return []
  const ws = await openConnection(config.serverUrl, config.tokenSecret)
  try {
    const result = await sendMessage(ws, { type: 'get_states' })
    return result?.states || []
  } finally {
    await closeConnection(ws)
  }
}

export async function fetchEntityState(config, entityId) {
  if (!config?.serverUrl || !config?.tokenSecret) return null
  const ws = await openConnection(config.serverUrl, config.tokenSecret)
  try {
    const result = await sendMessage(ws, { type: 'get_states' })
    const states = result?.states || []
    return states.find(s => s.entity_id === entityId) || null
  } finally {
    await closeConnection(ws)
  }
}

export async function callEntityToggle(config, entityId, nextState = null, data = {}) {
  const parts = entityId.split('.')
  if (parts.length < 2) throw new Error(`ID d'entité invalide: ${entityId}`)

  const [domain, id] = parts

  if (!config?.serverUrl || !config?.tokenSecret) {
    throw new Error('Configuration manquante')
  }

  const ws = await openConnection(config.serverUrl, config.tokenSecret)
  try {
    const callData = { ...data }
    if (nextState !== null) {
      callData.entity_id = entityId
      callData.state = nextState
    }

    await sendMessage(ws, {
      type: 'call_service',
      domain,
      service: domain === 'light' ? 'turn_on' : 'turn_toggle',
      service_data: callData
    })
  } finally {
    await closeConnection(ws)
  }
}

export async function setLightValues(config, entityId, data) {
  if (!config?.serverUrl || !config?.tokenSecret) {
    throw new Error('Configuration manquante')
  }

  const ws = await openConnection(config.serverUrl, config.tokenSecret)
  try {
    await sendMessage(ws, {
      type: 'call_service',
      domain: 'light',
      service: 'turn_on',
      service_data: {
        entity_id: entityId,
        ...data
      }
    })
  } finally {
    await closeConnection(ws)
  }
}

// --- Post-action refresh with retries ---

export async function refreshStateAfterAction(config, entityId) {
  // Délai initial de 2 secondes
  await new Promise(r => setTimeout(r, POST_ACTION_DELAY))

  // Lire l'état confirmé
  let state = await fetchEntityState(config, entityId)

  // Retries (3 tentatives avec 1s entre chacune)
  let retries = 0
  while (retries < MAX_RETRIES && !state) {
    await new Promise(r => setTimeout(r, RETRY_DELAY))
    state = await fetchEntityState(config, entityId)
    retries++
  }

  return state
}

export async function refreshBrightnessAfterSet(config, entityId) {
  await new Promise(r => setTimeout(r, POST_ACTION_DELAY))

  let state = await fetchEntityState(config, entityId)
  let retries = 0
  while (retries < MAX_RETRIES && (!state || !state.attributes.brightness)) {
    await new Promise(r => setTimeout(r, RETRY_DELAY))
    state = await fetchEntityState(config, entityId)
    retries++
  }

  return state
}
