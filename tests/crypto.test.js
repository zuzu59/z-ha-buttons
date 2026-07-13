import { describe, it, expect } from 'vitest'

// Utiliser un mock simplifié de Web Crypto pour les tests
describe('Crypto', () => {
  it('doit exporter les fonctions encrypt/decrypt', async () => {
    const cryptoLib = await import('../src/lib/crypto.js')
    expect(typeof cryptoLib.encrypt).toBe('function')
    expect(typeof cryptoLib.decrypt).toBe('function')
  })

  it('encrypt/decrypt doit être fonctionnel', async () => {
    const { encrypt, decrypt } = await import('../src/lib/crypto.js')
    const password = 'test-password-123'
    const text = 'Hello Home Assistant!'

    const encrypted = await encrypt(text, password)
    expect(encrypted).toBeDefined()
    expect(typeof encrypted).toBe('string')
    expect(encrypted).not.toBe(text)

    const decrypted = await decrypt(encrypted, password)
    expect(decrypted).toBe(text)
  })

  it('doit lever une erreur avec un mauvais mot de passe', async () => {
    const { encrypt, decrypt } = await import('../src/lib/crypto.js')
    const text = 'sensitive data'
    const encrypted = await encrypt(text, 'correct-password')

    await expect(decrypt(encrypted, 'wrong-password')).rejects.toThrow()
  })

  it('doit exporter generateMasterPassword', async () => {
    const { generateMasterPassword } = await import('../src/lib/crypto.js')
    expect(typeof generateMasterPassword).toBe('function')

    const pwd = await generateMasterPassword()
    expect(typeof pwd).toBe('string')
    expect(pwd.length).toBe(32) // 16 bytes = 32 hex chars
  })
})
