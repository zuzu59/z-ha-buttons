import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { compareSemver, formatVersionMessage } from '../src/lib/version.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

describe('Changelog', () => {
  it('doit exister et être lisible', () => {
    const changelogPath = join(root, 'CHANGELOG.md')
    const content = readFileSync(changelogPath, 'utf-8')
    expect(content).toContain('# CHANGELOG')
    expect(content).toContain('## v1.0.0')
  })

  it('doit pouvoir être parsé pour extraire les versions', () => {
    const changelogPath = join(root, 'CHANGELOG.md')
    const content = readFileSync(changelogPath, 'utf-8')
    const versions = content.match(/##\s*v?(\d+\.\d+\.\d+)/gi)
    expect(versions).toBeDefined()
    expect(versions.length).toBeGreaterThan(0)
  })

  it('compareSemver doit retourner 1 si a > b', () => {
    expect(compareSemver('2.0.0', '1.0.0')).toBe(1)
  })

  it('compareSemver doit retourner -1 si a < b', () => {
    expect(compareSemver('0.9.0', '1.0.0')).toBe(-1)
  })

  it('compareSemver doit retourner 0 si a === b', () => {
    expect(compareSemver('1.0.0', '1.0.0')).toBe(0)
  })

  it('doit afficher un message clair pour nouvelle version', () => {
    const msg = formatVersionMessage('new', '2.0.0')
    expect(msg).toContain('2.0.0')
    expect(msg).toContain('Nouvelle version')
  })

  it('doit afficher un message pour version à jour', () => {
    const msg = formatVersionMessage('up-to-date')
    expect(msg).toContain('à jour')
  })
})
