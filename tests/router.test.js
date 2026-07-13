/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'

// Test basique du router - vérifie que les routes sont définies
describe('Router', () => {
  it('doit avoir une route "/"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const homeRoute = routes.find(r => r.path === '/')
    expect(homeRoute).toBeDefined()
  })

  it('doit avoir une route "/settings"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const settingsRoute = routes.find(r => r.path === '/settings')
    expect(settingsRoute).toBeDefined()
  })

  it('doit avoir une route "/buttons/new"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const newRoute = routes.find(r => r.path === '/buttons/new')
    expect(newRoute).toBeDefined()
  })

  it('doit avoir une route "/order"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const orderRoute = routes.find(r => r.path === '/order')
    expect(orderRoute).toBeDefined()
  })

  it('doit avoir une route "/sync"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const syncRoute = routes.find(r => r.path === '/sync')
    expect(syncRoute).toBeDefined()
  })

  it('doit avoir une route "/help"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const helpRoute = routes.find(r => r.path === '/help')
    expect(helpRoute).toBeDefined()
  })

  it('doit avoir une route "/about"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const aboutRoute = routes.find(r => r.path === '/about')
    expect(aboutRoute).toBeDefined()
  })

  it('doit avoir une route "/buttons/:id"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const detailRoute = routes.find(r => r.path === '/buttons/:id')
    expect(detailRoute).toBeDefined()
  })

  it('doit avoir une route "/buttons/:id/edit"', async () => {
    const router = (await import('../src/router/index.js')).default
    const routes = router.getRoutes()
    const editRoute = routes.find(r => r.path === '/buttons/:id/edit')
    expect(editRoute).toBeDefined()
  })
})
