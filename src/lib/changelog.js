export function compareVersions(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number);
  const pb = String(b).replace(/^v/, '').split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    const delta = (pb[index] || 0) - (pa[index] || 0);
    if (delta !== 0) return delta;
  }
  return 0;
}

export function extractLatestChangelogVersion(markdown) {
  const match = String(markdown).match(/^## \[([^\]]+)\]/m);
  return match?.[1] || '';
}

export function getChangelogUpdateMessage(currentVersion, latestVersion) {
  if (!latestVersion) {
    return '';
  }
  return compareVersions(currentVersion, latestVersion) > 0
    ? `Nouvelle version disponible : ${latestVersion}`
    : 'Aucune nouvelle version disponible';
}

export function decodeBase64Utf8(base64) {
  const normalized = String(base64).replace(/\s+/g, '');
  if (typeof atob === 'function') {
    const bytes = Uint8Array.from(atob(normalized), (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  return Buffer.from(normalized, 'base64').toString('utf8');
}
