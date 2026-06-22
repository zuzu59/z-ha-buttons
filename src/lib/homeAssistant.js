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

export async function haFetch(config, path, options = {}) {
  const baseUrl = cleanBaseUrl(config.serverUrl);
  const response = await fetch(`${baseUrl}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      ...authHeaders(config.token),
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Home Assistant ${response.status}`);
  }
  return response;
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
