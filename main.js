import { createApp } from 'vue';
import { createHead } from '@unhead/vue'; // Import createHead
import App from './App.vue';
import router from './router';
import './main.css'; // Assuming main CSS entry point

const app = createApp(App);
const head = createHead(); // Create head instance

app.use(router);
app.use(head); // Use the head instance

app.mount('#app');

