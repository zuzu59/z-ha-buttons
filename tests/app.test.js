import { describe, it, expect } from 'vitest'
import { version } from '../package.json'

describe('Application', () => {
  it('version doit être définie', () => {
    expect(version).toBeDefined()
    expect(typeof version).toBe('string')
    expect(version).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('version doit être 1.0.0', () => {
    expect(version).toBe('1.0.0')
  })
})
