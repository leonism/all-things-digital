import { createApp } from 'vue';
import { createHead } from '@unhead/vue/client';
import App from './App.vue';
import router from './router';
import './assets/styles/main.css';

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);
app.mount('#app');
