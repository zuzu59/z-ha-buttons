import { createRouter, createWebHistory } from 'vue-router'

const BASE_URL = import.meta.env.BASE_URL || '/'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/Settings.vue') },
  { path: '/buttons/new', name: 'button-new', component: () => import('../views/ButtonForm.vue') },
  { path: '/buttons/:id/edit', name: 'button-edit', component: () => import('../views/ButtonForm.vue'), props: true },
  { path: '/buttons/:id', name: 'button-detail', component: () => import('../views/ButtonDetail.vue'), props: true },
  { path: '/order', name: 'order', component: () => import('../views/Order.vue') },
  { path: '/sync', name: 'sync', component: () => import('../views/Sync.vue') },
  { path: '/help', name: 'help', component: () => import('../views/Help.vue') },
  { path: '/about', name: 'about', component: () => import('../views/About.vue') }
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
})

export default router
