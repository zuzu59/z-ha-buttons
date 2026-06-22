function cleanBaseUrl(url) {
  return String(url || '').replace(/\/+$/, '');
}

export function getEntityDomain(entityId) {
  return String(entityId || '').split('.')[0] || 'switch';
}

function authHeaders(token) {
  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    : {
        'Content-Type': 'application/json',
      };
}

function errorMessage(response) {
  const map = {
    400: 'Requête Home Assistant invalide',
    401: 'Token Home Assistant invalide ou expiré',
    404: 'URL Home Assistant incorrecte',
    405: 'Méthode Home Assistant non autorisée',
  };
  return map[response.status] || `Home Assistant ${response.status}`;
}

export async function haFetch(config, path, options = {}) {
  const baseUrl = cleanBaseUrl(config.serverUrl);
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      ...options,
      headers: {
        ...authHeaders(config.token),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Impossible de joindre Home Assistant (CORS ou réseau)');
  }
  if (!response.ok) {
    throw new Error(errorMessage(response));
  }
  return response;
}

export async function pingHomeAssistant(config) {
  const response = await haFetch(config, '/api/');
  return response.json();
}

export async function fetchHomeAssistantConfig(config) {
  const response = await haFetch(config, '/api/config');
  return response.json();
}

export async function fetchStates(config) {
  const response = await haFetch(config, '/api/states');
  return response.json();
}

export async function fetchEntityState(config, entityId) {
  const response = await haFetch(config, `/api/states/${encodeURIComponent(entityId)}`);
  return response.json();
}

function serviceForEntity(entityId, nextState) {
  const domain = getEntityDomain(entityId);
  if (domain === 'light') {
    return nextState === 'off' ? 'turn_off' : 'turn_on';
  }
  if (domain === 'cover') {
    return nextState === 'on' ? 'open_cover' : 'close_cover';
  }
  return nextState === 'on' ? 'turn_on' : 'turn_off';
}

export async function callEntityToggle(config, entityId, nextState = 'toggle', data = {}) {
  const domain = getEntityDomain(entityId);
  const service = nextState === 'toggle' ? 'toggle' : serviceForEntity(entityId, nextState);
  const body = { entity_id: entityId, ...data };
  await haFetch(config, `/api/services/${domain}/${service}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function setLightValues(config, entityId, data) {
  await haFetch(config, '/api/services/light/turn_on', {
    method: 'POST',
    body: JSON.stringify({ entity_id: entityId, ...data }),
  });
}
