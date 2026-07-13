import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.HA_BASE_URL || 'http://localhost:4173/z-ha-buttons'
const OUT_DIR = join(process.cwd(), 'screenshots')

// Timestamp: ddMMyy.hhmm
const now = new Date()
const pad = n => String(n).padStart(2, '0')
const ts = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${pad(now.getFullYear() % 100)}.${pad(now.getHours())}${pad(now.getMinutes())}`

const ROUTES = [
  '/',
  '/settings',
  '/buttons/new',
  '/order',
  '/sync',
  '/help',
  '/about',
  '/buttons/123'
]

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  console.log(`📸 Screenshots: ${OUT_DIR}/`)
  console.log(`   Timestamp: ${ts}`)
  console.log(`   Base URL: ${BASE}`)
  console.log()

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }, // iPhone X
    deviceScaleFactor: 2
  })
  const page = await context.newPage()

  for (const route of ROUTES) {
    const url = `${BASE}${route}`
    const filename = `${ts}-${route.replace(/\//g, '-') || 'index'}.png`
    const filepath = join(OUT_DIR, filename)

    console.log(`→ ${route}`)
    try {
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500) // Wait for animations

      // Wait for main container
      await page.waitForSelector('#app', { state: 'visible' }).catch(() => {})

      await page.screenshot({ path: filepath, fullPage: false })
      console.log(`   ✅ ${filename} (${(await import('node:fs')).statSync(filepath).size / 1024} KB)`)
    } catch (err) {
      console.log(`   ❌ ${err.message}`)
    }
  }

  await browser.close()
  console.log('\n✅ Done!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
