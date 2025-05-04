import { createRouter, createWebHistory } from 'vue-router';
// For now, let's use the existing HomeContent component for the home route
import HomeContent from '../content/HomeContent.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeContent // Or replace with a dedicated HomeView if created
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting (lazy loading)
    // creates a separate chunk (About.[hash].js) for this route
    // which is loaded when the route is visited.
    // You'll need to create src/views/AboutView.vue
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    // You'll need to create src/views/ContactView.vue
    component: () => import('../views/ContactView.vue')
  },
  {
    path: '/blogs', // Changed from /blog to /blogs as requested
    name: 'Blogs', // Changed name to Blogs
    // You'll need to create src/views/BlogView.vue
    component: () => import('../views/BlogView.vue')
  },
  {
    path: '/credits',
    name: 'Credits',
    // You'll need to create src/views/CreditsView.vue
    component: () => import('../views/CreditsView.vue')
  }
  // Add other specific routes like individual blog posts later if needed
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Use history mode
  routes, // short for `routes: routes`
  // Optional: Add scroll behavior to scroll to top on navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
