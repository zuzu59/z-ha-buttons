#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const BASE_URL = '/z-ha-buttons/'
const PORT = 4173
const TIMEOUT = 30000

console.log('🔥 Lance le serveur preview...')

const server = spawn('npx', ['vite', 'preview', '--host', '0.0.0.0', '--port', String(PORT)], {
  cwd: join(process.cwd(), '..'),
  stdio: 'pipe'
})

let started = false
let serverReady = false
const serverOutput = []

server.stdout.on('data', (data) => {
  const text = data.toString()
  serverOutput.push(text)
  if (text.includes('Local:') && !started) {
    started = true
    console.log('✅ Serveur preview lancé sur http://localhost:' + PORT)
    serverReady = true
    runSmokeTests()
  }
})

server.stderr.on('data', (data) => {
  serverOutput.push(data.toString())
})

function runSmokeTests() {
  let passed = 0
  let failed = 0

  async function check(url, description) {
    return new Promise((resolve) => {
      const start = Date.now()
      const req = require('http').get(url, { timeout: 10000 }, (res) => {
        const elapsed = Date.now() - start
        if (res.statusCode >= 200 && res.statusCode < 400) {
          console.log(`  ✅ ${description} (${res.statusCode} - ${elapsed}ms)`)
          passed++
        } else {
          console.log(`  ❌ ${description} (${res.statusCode})`)
          failed++
        }
        resolve()
      })
      req.on('error', () => {
        console.log(`  ❌ ${description} (timeout/error)`)
        failed++
        resolve()
      })
      req.on('timeout', () => {
        req.destroy()
        console.log(`  ❌ ${description} (timeout)`)
        failed++
        resolve()
      })
    })
  }

  async function run() {
    // Attendre que le serveur soit prêt
    const start = Date.now()
    while (!serverReady && Date.now() - start < TIMEOUT) {
      await new Promise(r => setTimeout(r, 500))
    }

    if (!serverReady) {
      console.error('❌ Le serveur n\'a pas démarré à temps')
      cleanup()
      process.exit(1)
    }

    console.log('\n🧪 Tests smoke:')

    await check(`http://localhost:${PORT}${BASE_URL}index.html`, 'Page index')
    await check(`http://localhost:${PORT}${BASE_URL}`, 'Page racine')
    await check(`http://localhost:${PORT}${BASE_URL}app-icon.png`, 'Favicon PNG')
    await check(`http://localhost:${PORT}${BASE_URL}manifest.json`, 'Manifest PWA')
    await check(`http://localhost:${PORT}${BASE_URL}404.html`, 'Page 404 GitHub Pages')
    await check(`http://localhost:${PORT}${BASE_URL}about`, 'Page About')
    await check(`http://localhost:${PORT}${BASE_URL}help`, 'Page Help')

    console.log(`\n📊 Résultats: ${passed} passés, ${failed} échoués`)

    if (failed > 0) {
      cleanup()
      process.exit(1)
    } else {
      console.log('\n🎉 Tous les tests smoke sont passés !')
      cleanup()
    }
  }

  run()
}

function cleanup() {
  server.kill('SIGTERM')
  server.stdout.destroy()
  server.stderr.destroy()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
