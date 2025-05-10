import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"), // Lazy-loaded
  },
  // More routes will be added as we convert HTML files
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
