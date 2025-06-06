import { createRouter, createWebHistory } from 'vue-router';

// Import Views
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import ContactView from '../views/ContactView.vue';
import CreditsView from '../views/CreditsView.vue';
import CategoryView from '../views/CategoryView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import BlogListView from '../components/blog/BlogListView.vue';
import BlogPostView from '../components/blog/BlogPostView.vue';
import BlogTagView from '../components/blog/BlogTagView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/credits',
    name: 'credits',
    component: CreditsView,
  },
  {
    path: '/blog',
    name: 'blog-list',
    component: BlogListView,
  },
  {
    path: '/blog/page/:page',
    name: 'blog-list-pagination',
    component: BlogListView,
    props: true, // Pass route params as props to the component
  },
  {
    path: '/category/:category?', // Make category parameter optional
    name: 'blog-categories-list', // Renamed for clarity
    component: CategoryView,
    props: true,
  },
  {
    // Route for individual blog posts using slug
    path: '/blog/:slug',
    name: 'blog-post',
    component: BlogPostView,
    props: true, // Pass route params as props to the component
  },
  {
    path: '/blog/category/:category',
    name: 'category-archive',
    component: CategoryView,
    props: true,
  },
  {
    path: '/blog/tag/:tag',
    name: 'tag-archive',
    component: BlogTagView,
    props: true,
  },
   {
    path: '/blog/tag/:tag/page/:page',
    name: 'tag-archive-pagination',
    component: BlogTagView,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll behavior to scroll to top on new page loads
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
