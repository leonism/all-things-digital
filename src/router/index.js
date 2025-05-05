import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: () => import("@/views/HomeView.vue") },
  { path: "/blog", component: () => import("@/views/BlogView.vue") },
  { path: "/about", component: () => import("@/views/AboutView.vue") },
  { path: "/contact", component: () => import("@/views/ContactView.vue") },
  { path: "/credits", component: () => import("@/views/CreditsView.vue") },
  { path: "/category", component: () => import("@/views/CategoryView.vue") },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
