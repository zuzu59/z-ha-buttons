import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router.js';
import './styles.css';
import { initialiseStore } from './lib/store.js';

createApp(App).use(router).mount('#app');
initialiseStore();
