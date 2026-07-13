import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

const BASE = 'http://localhost:4173/z-ha-buttons'

describe('Smoke tests serveur', () => {
  it('doit répondre sur la page index', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/index.html`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit répondre sur /settings', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/settings`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit répondre sur /buttons/new', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/buttons/new`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit répondre sur /order', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/order`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit répondre sur /sync', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/sync`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit répondre sur /help', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/help`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit répondre sur /about', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/about`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit servir le manifest.webmanifest', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/manifest.webmanifest`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit servir le service worker', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/sw.js`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit servir le favicon', () => {
    const res = execSync(`curl -s -o /dev/null -w "%{http_code}" ${BASE}/app-icon.png`, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })
})
