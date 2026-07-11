import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import HelpView from './views/HelpView.vue';
import OrderView from './views/OrderView.vue';
import SettingsView from './views/SettingsView.vue';
import ButtonFormView from './views/ButtonFormView.vue';
import ButtonDetailView from './views/ButtonDetailView.vue';
import ImportExportView from './views/ImportExportView.vue';
import AboutView from './views/AboutView.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/help', name: 'help', component: HelpView },
    { path: '/order', name: 'order', component: OrderView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/buttons/new', name: 'button-new', component: ButtonFormView },
    { path: '/buttons/:id/edit', name: 'button-edit', component: ButtonFormView, props: true },
    { path: '/buttons/:id', name: 'button-detail', component: ButtonDetailView, props: true },
    { path: '/sync', name: 'sync', component: ImportExportView },
    { path: '/about', name: 'about', component: AboutView },
  ],
});
