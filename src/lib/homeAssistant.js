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

function shouldFallbackToWebSocket(error) {
  const message = String(error?.message || error || '');
  return /CORS|Failed to fetch|NetworkError|Impossible de joindre Home Assistant/i.test(
    message,
  );
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

function websocketUrl(baseUrl) {
  const url = new URL(cleanBaseUrl(baseUrl));
  url.pathname = '/api/websocket';
  url.search = '';
  url.hash = '';
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}

function wsRequest(config, message) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(websocketUrl(config.serverUrl));
    const requestId = Math.floor(Math.random() * 1_000_000_000);
    let authenticated = false;
    let settled = false;

    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      try {
        socket.close();
      } catch {
        // ignore close failures
      }
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    };

    socket.onerror = () => {
      finish(new Error('Impossible de joindre Home Assistant (WebSocket)'));
    };

    socket.onmessage = (event) => {
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      if (data.type === 'auth_required') {
        socket.send(JSON.stringify({ type: 'auth', access_token: config.token }));
        return;
      }

      if (data.type === 'auth_ok') {
        authenticated = true;
        socket.send(JSON.stringify({ id: requestId, ...message }));
        return;
      }

      if (data.type === 'auth_invalid') {
        finish(new Error('Token Home Assistant invalide ou expiré'));
        return;
      }

      if (!authenticated || data.id !== requestId) {
        return;
      }

      if (data.type === 'result') {
        if (data.success === false) {
          finish(new Error(data.error?.message || 'Home Assistant a refusé la requête'));
          return;
        }
        finish(null, data.result);
        return;
      }
    };
  });
}

export async function pingHomeAssistant(config) {
  await wsRequest(config, { type: 'get_config' });
  return { message: 'API running.' };
}

export async function fetchHomeAssistantConfig(config) {
  return wsRequest(config, { type: 'get_config' });
}

export async function fetchStates(config) {
  return wsRequest(config, { type: 'get_states' });
}

export async function fetchEntityState(config, entityId) {
  const states = await wsRequest(config, { type: 'get_states' });
  return states.find((entry) => entry.entity_id === entityId) || null;
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

async function callService(config, domain, service, payload) {
  return wsRequest(config, {
    type: 'call_service',
    domain,
    service,
    service_data: payload,
  });
}

export async function callEntityToggle(config, entityId, nextState = 'toggle', data = {}) {
  const domain = getEntityDomain(entityId);
  const service = nextState === 'toggle' ? 'toggle' : serviceForEntity(entityId, nextState);
  const body = { entity_id: entityId, ...data };
  await callService(config, domain, service, body);
}

export async function setLightValues(config, entityId, data) {
  await callService(config, 'light', 'turn_on', {
    entity_id: entityId,
    ...data,
  });
}
