/**
 * Utilitaires de version
 */

export function compareSemver(a, b) {
  const partsA = a.replace('v', '').split('.').map(Number)
  const partsB = b.replace('v', '').split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    const pa = partsA[i] || 0
    const pb = partsB[i] || 0
    if (pa > pb) return 1
    if (pa < pb) return -1
  }
  return 0
}

export function formatVersionMessage(status, remoteVersion) {
  if (status === 'new') {
    return `🆕 Nouvelle version disponible : ${remoteVersion}`
  }
  return '✅ Tu es à jour'
}
