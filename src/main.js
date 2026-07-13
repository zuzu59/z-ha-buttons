import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAppStore } from './lib/db.js'

async function bootstrap() {
  // Initialiser le store Dexie avant le montage
  const store = await createAppStore()

  const app = createApp(App)
  app.provide('store', store)
  app.use(router)
  app.mount('#app')
}

bootstrap()
