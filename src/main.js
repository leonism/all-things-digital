import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/main.css"; // Add this line to import your main Tailwind CSS file

const app = createApp(App);
app.use(router);
app.mount("#app");
