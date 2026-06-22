const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const KDF_ITERATIONS = 600_000;

export function wipe(bytes) {
  if (bytes instanceof Uint8Array) {
    bytes.fill(0);
  }
}

export function bytesToBase64(bytes) {
  let binary = '';
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

export function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export function utf8ToBytes(value) {
  return encoder.encode(value);
}

export function bytesToUtf8(bytes) {
  return decoder.decode(bytes);
}

export function createSalt() {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return salt;
}

export function createIv() {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  return iv;
}

async function importPassword(passwordBytes) {
  return crypto.subtle.importKey('raw', passwordBytes, 'PBKDF2', false, [
    'deriveKey',
  ]);
}

export async function deriveAesKey(password, salt, iterations = KDF_ITERATIONS) {
  const passwordBytes = utf8ToBytes(password);
  const baseKey = await importPassword(passwordBytes);
  wipe(passwordBytes);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptBytes(plainBytes, password, salt = createSalt()) {
  const iv = createIv();
  const key = await deriveAesKey(password, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plainBytes);
  const cipherBytes = new Uint8Array(encrypted);
  return {
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    data: bytesToBase64(cipherBytes),
    iterations: KDF_ITERATIONS,
  };
}

export async function encryptText(plainText, password, salt = createSalt()) {
  const plainBytes = utf8ToBytes(plainText);
  const payload = await encryptBytes(plainBytes, password, salt);
  wipe(plainBytes);
  return payload;
}

export async function decryptBytes(payload, password) {
  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const data = base64ToBytes(payload.data);
  const key = await deriveAesKey(password, salt, payload.iterations ?? KDF_ITERATIONS);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  wipe(data);
  wipe(salt);
  wipe(iv);
  return new Uint8Array(decrypted);
}

export async function decryptText(payload, password) {
  const plainBytes = await decryptBytes(payload, password);
  const plainText = bytesToUtf8(plainBytes);
  wipe(plainBytes);
  return plainText;
}

export async function encryptJson(value, password) {
  return encryptText(JSON.stringify(value), password);
}

export async function decryptJson(payload, password) {
  return JSON.parse(await decryptText(payload, password));
}

export function nowIso() {
  return new Date().toISOString();
}

export function formatDateTime(value) {
  if (!value) {
    return '—';
  }
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
