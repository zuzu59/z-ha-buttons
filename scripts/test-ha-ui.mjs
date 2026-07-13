import { chromium } from 'playwright'

const HA_URL = process.env.HA_URL
const HA_TOKEN = process.env.HA_TOKEN

if (!HA_URL || !HA_TOKEN) {
  console.log('❌ Variables HA non définies')
  process.exit(1)
}

const BASE = process.env.HA_BASE_URL || 'http://localhost:4173/z-ha-buttons'

async function main() {
  console.log('🧪 Test connexion HA via UI...')
  console.log(`   HA_URL: ${HA_URL}`)
  console.log(`   HA_TOKEN: ${HA_TOKEN.substring(0, 20)}...`)
  console.log()

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2
  })
  const page = await context.newPage()

  // Capture console logs
  page.on('console', msg => {
    console.log(`   [BROWSER] ${msg.type()}: ${msg.text()}`)
  })
  page.on('pageerror', err => {
    console.log(`   [ERROR] ${err.message}`)
  })

  // 1. Aller sur settings
  console.log('→ Page settings...')
  await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded', timeout: 10000 })
  await page.waitForTimeout(1000)

  // 2. Remplir le formulaire
  console.log('→ Remplissage du formulaire...')
  await page.fill('#serverUrl', HA_URL)
  await page.fill('#haName', 'Test HA')
  await page.fill('#token', HA_TOKEN)
  await page.fill('#masterPassword', 'test123')
  await page.fill('#confirmPassword', 'test123')
  await page.waitForTimeout(500)

  // 3. Cliquer "Tester la connexion"
  console.log('→ Clic sur "Tester la connexion"...')
  await page.click('button:has-text("Tester la connexion")')

  // 4. Attendre le résultat
  console.log('→ En attente du résultat (15s)...')
  await page.waitForTimeout(15000)

  // 5. Capturer le résultat
  const screenshot = `${Date.now()}-test-connexion.png`
  await page.screenshot({ path: screenshot, fullPage: false })
  console.log(`📸 Screenshot: ${screenshot}`)

  // 6. Vérifier le message de succès/erreur
  const msgEl = await page.locator('.success-text, .error-text, p:has-text("Connexion")').first()
  if (await msgEl.isVisible().catch(() => false)) {
    const msg = await msgEl.textContent()
    console.log(`   Message: ${msg.trim()}`)
    if (msg.toLowerCase().includes('succès') || msg.toLowerCase().includes('connecté') || msg.toLowerCase().includes('ok')) {
      console.log('✅ Connexion HA réussie !')
    } else if (msg.toLowerCase().includes('erreur') || msg.toLowerCase().includes('échec') || msg.toLowerCase().includes('impossible')) {
      console.log('❌ Échec de connexion')
    } else {
      console.log(`? Message ambigu: ${msg.trim()}`)
    }
  } else {
    console.log('   Aucun message visible')
    // Check page content for debugging
    const content = await page.content()
    console.log('   Page has message element:', content.includes('Connexion') || content.includes('Échec'))
  }

  await browser.close()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
