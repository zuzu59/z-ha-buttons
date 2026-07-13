#!/usr/bin/env node
/**
 * Tests E2E headless — Navigation comme un humain
 * 1. Configurer l'application + test connexion HA
 * 2. Créer un bouton avec HA_ENTITE_1
 * 3. Tester le bouton (toggle)
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { chromium } from 'playwright'

const HA_URL = process.env.HA_URL || 'https://hafamillez.duckdns.org:8123'
const HA_TOKEN = process.env.HA_TOKEN
const HA_ENTITE_1 = process.env.HA_ENTITE_1 || 'light.chloe_table'

if (!HA_TOKEN) {
  console.error('❌ HA_TOKEN non définie')
  process.exit(1)
}

const SCREENSHOT_DIR = 'screenshots'
import { mkdirSync } from 'fs'
mkdirSync(SCREENSHOT_DIR, { recursive: true })

const now = new Date()
const yymmdd = String(now.getFullYear()).slice(-2) +
               String(now.getMonth() + 1).padStart(2, '0') +
               String(now.getDate()).padStart(2, '0')
const hhmm = String(now.getHours()).padStart(2, '0') +
             String(now.getMinutes()).padStart(2, '0')
const ts = `${yymmdd}.${hhmm}`

function ss(page, name) {
  return page.screenshot({
    path: `${SCREENSHOT_DIR}/${ts}-${name}.png`,
    fullPage: false
  }).then(() => console.log(`  📸 ${ts}-${name}.png`))
}

async function main() {
  console.log('🚀 Tests E2E headless\n')

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    ignoreHTTPSErrors: true
  })
  const page = await ctx.newPage()

  try {
    // === TEST 1: Configurer + connexion HA ===
    console.log('📝 TEST 1: Configurer + connexion HA\n')

    await page.goto('http://localhost:4173/')
    await page.waitForTimeout(3000)
    await ss(page, '01-home')

    // Configurer
    await page.locator('text=Configurer').click()
    await page.waitForTimeout(1000)
    await ss(page, '02-settings')

    // Remplir
    const inputs = page.locator('input')
    await inputs.first().fill(HA_URL)
    await inputs.nth(2).fill(HA_TOKEN)
    await ss(page, '03-form-filled')

    // Tester
    console.log('  🔌 Test connexion...')
    await page.locator('button', { hasText: 'Tester la connexion' }).click()
    await page.waitForTimeout(8000)
    const testStatus = await page.locator('.error-text, .success-text').first().textContent().catch(() => '')
    console.log('  📡 Résultat:', testStatus.trim())
    await ss(page, '04-connection-result')

    // Sauvegarder
    console.log('  💾 Sauvegarde...')
    await page.locator('button', { hasText: 'Enregistrer' }).click()
    await page.waitForTimeout(2000)
    const saveStatus = await page.locator('.error-text, .success-text').first().textContent().catch(() => '')
    console.log('  📦', saveStatus.trim())
    await ss(page, '05-config-saved')

    // === TEST 2: Créer un bouton ===
    console.log('\n🔘 TEST 2: Créer un bouton\n')

    // Retour accueil puis ajouter bouton
    await page.goto('http://localhost:4173/')
    await page.waitForTimeout(2000)
    await ss(page, '06-home-ready')

    await page.locator('text=Ajouter un bouton').click()
    await page.waitForTimeout(1500)
    await ss(page, '07-button-form')

    // Remplir
    await page.fill('#entityId', HA_ENTITE_1)
    await page.fill('#label', 'Chambre Table')
    await page.selectOption('#kind', { value: 'light' })
    await ss(page, '08-button-form-filled')

    // Sauvegarder
    await page.locator('button', { hasText: 'Enregistrer' }).click()
    await page.waitForTimeout(2000)
    await ss(page, '09-button-saved')

    // === TEST 3: Vérifier le bouton ===
    console.log('\n🔌 TEST 3: Vérifier le bouton\n')

    await page.goto('http://localhost:4173/')
    await page.waitForTimeout(3000)
    await ss(page, '10-home-with-button')

    const body = await page.textContent('body')
    const hasButton = body.includes('Chambre Table') || body.includes(HA_ENTITE_1)
    console.log('  ✅ Bouton visible:', hasButton ? 'OUI' : 'NON')

    if (hasButton) {
      // Tenter le toggle
      try {
        await page.locator('text=Chambre Table').click()
        await page.waitForTimeout(1500)
        await ss(page, '11-toggle-clicked')
        console.log('  🔄 Toggle effectué')
      } catch (e) {
        console.log('  ⚠️ Toggle:', e.message.slice(0, 100))
      }
    }

    console.log('\n✅ Tests terminés!\n')
    console.log('📁 Screenshots:', SCREENSHOT_DIR, '\n')

  } catch (error) {
    console.error('❌ Erreur:', error.message)
    await ss(page, 'error')
  } finally {
    await browser.close()
  }
}

main()
