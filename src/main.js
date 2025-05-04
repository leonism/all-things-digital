import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router"; // Import the router configuration
import "./assets/main.css"; // Import global CSS

// Create the single Vue app instance
const app = createApp(App);

// Create and use Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Use the router
app.use(router);

// Mount the app to the #app element in index.html
app.mount("#app");
