import { chromium } from 'playwright'

const HA_URL = process.env.HA_URL
const HA_TOKEN = process.env.HA_TOKEN

if (!HA_URL || !HA_TOKEN) {
  console.log('❌ Variables HA non définies')
  process.exit(1)
}

const BASE = process.env.HA_BASE_URL || 'http://localhost:4173/z-ha-buttons'

async function main() {
  console.log('🧪 Test E2E - Navigation humaine\n')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    ignoreHTTPSErrors: true
  })
  const page = await context.newPage()

  // 1. Accueil
  console.log('→ Page d\'accueil...')
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)

  // Verifier le welcome
  const welcome = await page.locator('text=Bienvenue').first()
  console.log(`   Bienvenue visible: ${await welcome.isVisible()}`)

  // 2. Cliquer sur Configurer
  console.log('→ Clic sur "Configurer"...')
  await page.click('text=Configurer')
  await page.waitForTimeout(800)

  // 3. Verifier qu'on est sur settings
  const settingsTitle = await page.locator('text=Configuration Home Assistant').first()
  console.log(`   Page settings visible: ${await settingsTitle.isVisible()}`)

  // 4. Remplir le formulaire
  console.log('→ Remplissage formulaire...')
  await page.fill('#serverUrl', HA_URL)
  await page.fill('#haName', 'Test HA')
  await page.fill('#token', HA_TOKEN)
  await page.fill('#masterPassword', 'test123')
  await page.fill('#confirmPassword', 'test123')
  await page.waitForTimeout(300)

  // 5. Cliquer "Tester la connexion"
  console.log('→ Clic "Tester la connexion"...')
  await page.click('button:has-text("Tester la connexion")')

  // 6. Attendre le resultat
  console.log('→ En attente resultat (15s)...')
  await page.waitForTimeout(15000)

  // 7. Verifier le message
  const msgEl = await page.locator('p:has-text("Connexion")').first()
  if (await msgEl.isVisible().catch(() => false)) {
    const msg = await msgEl.textContent()
    const trimmed = msg.trim()
    console.log(`   Message: ${trimmed}`)
    if (trimmed.includes('Connexion réussie')) {
      console.log('✅ Connexion HA réussie via navigation humaine !')
    } else if (trimmed.includes('Échec') || trimmed.includes('erreur')) {
      console.log('❌ Échec de connexion')
    } else {
      console.log('? Message ambigu')
    }
  } else {
    console.log('❌ Aucun message visible')
  }

  // 8. Screenshot final
  const ts = `${String(new Date().getDate()).padStart(2,'0')}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getFullYear()%100).padStart(2,'0')}.${String(new Date().getHours()).padStart(2,'0')}${String(new Date().getMinutes()).padStart(2,'0')}`
  await page.screenshot({ path: `screenshots/${ts}-e2e-connexion.png` })
  console.log(`📸 Screenshot: screenshots/${ts}-e2e-connexion.png`)

  await browser.close()
}

main().catch(err => { console.error(err); process.exit(1) })
