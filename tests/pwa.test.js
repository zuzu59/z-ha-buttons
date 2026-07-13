import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

describe('PWA', () => {
  it('doit avoir un fichier manifest.json dans public/', () => {
    const manifestPath = join(root, 'public', 'manifest.json')
    const content = readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(content)
    expect(manifest.name).toBe('z-ha-buttons')
    expect(manifest.short_name).toBe('HA Buttons')
    expect(manifest.display).toBe('standalone')
    expect(manifest.icons).toBeDefined()
    expect(manifest.icons.length).toBeGreaterThan(0)
  })

  it('doit avoir un favicon dans public/', () => {
    const iconPath = join(root, 'public', 'app-icon.png')
    const content = readFileSync(iconPath)
    // Vérifie que le fichier existe et commence par les bytes PNG
    expect(content.length).toBeGreaterThan(0)
    // PNG signature: \x89PNG
    expect(content[0]).toBe(0x89)
    expect(content[1]).toBe(0x50)
    expect(content[2]).toBe(0x4E)
    expect(content[3]).toBe(0x47)
  })

  it('doit avoir un 404.html pour GitHub Pages', () => {
    const path404 = join(root, 'public', '404.html')
    const content = readFileSync(path404, 'utf-8')
    expect(content).toContain('<!DOCTYPE html>')
    expect(content).toContain('z-ha-buttons')
  })

  it('doit avoir un fichier .nojekyll', () => {
    const nojekyllPath = join(root, 'public', '.nojekyll')
    expect(readFileSync(nojekyllPath, 'utf-8')).toBe('')
  })
})
