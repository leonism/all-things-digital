import { createRouter, createWebHistory } from 'vue-router';
// Import your view components here.
// Example: import HomeView from '../views/HomeView.vue';
// For now, let's use the existing HomeContent component for the home route
import HomeContent from '../content/HomeContent.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeContent // Replace with HomeView later if you create one
  },
  // Add other routes here later, for example:
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import('../views/AboutView.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use history mode
  routes, // short for `routes: routes`
});

export default router;
