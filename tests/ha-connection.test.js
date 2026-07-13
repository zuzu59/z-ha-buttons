import { describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'

const HA_URL = process.env.HA_URL
const HA_TOKEN = process.env.HA_TOKEN

const haTests = describe('HA Connection (HTTP)', () => {
  it('doit répondre au ping HTTP', () => {
    const cmd = `curl -s -o /dev/null -w "%{http_code}" --insecure "${HA_URL}/api/" -H "Authorization: Bearer ${HA_TOKEN}"`
    const res = execSync(cmd, { encoding: 'utf8' })
    expect(res.trim()).toBe('200')
  })

  it('doit lister les entités', () => {
    const cmd = `curl -s --insecure "${HA_URL}/api/" -H "Authorization: Bearer ${HA_TOKEN}"`
    const body = execSync(cmd, { encoding: 'utf8' })
    const json = JSON.parse(body)
    expect(json).toHaveProperty('message')
    expect(json.message).toContain('API')
    console.log('  → HA Version:', json.version)
    console.log('  → HA Source:', json.source)
  })

  it('doit retourner les states des entités test', () => {
    const entites = [process.env.HA_ENTITE_1, process.env.HA_ENTITE_2, process.env.HA_ENTITE_3].filter(Boolean)
    for (const entite of entites) {
      const cmd = `curl -s --insecure "${HA_URL}/api/states/${entite}" -H "Authorization: Bearer ${HA_TOKEN}"`
      const body = execSync(cmd, { encoding: 'utf8' })
      const state = JSON.parse(body)
      expect(state).toHaveProperty('state')
      console.log(`  → ${entite} = ${state.state}`)
    }
  })
})

// Skip si variables non définies
if (!HA_URL || !HA_TOKEN) {
  haTests.skip()
}
