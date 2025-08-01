import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import('../views/HomeView.vue');
const AboutView = () => import('../views/AboutView.vue');
const ContactView = () => import('../views/ContactView.vue');
const CreditsView = () => import('../views/CreditsView.vue');
const CategoryView = () => import('../views/CategoryView.vue');
const NotFoundView = () => import('../views/NotFoundView.vue');
const BlogListView = () => import('../components/blog/BlogListView.vue');
const BlogPostView = () => import('../components/blog/BlogPostView.vue');
const BlogTagView = () => import('../components/blog/BlogTagView.vue');
const BlogCategoryView = () =>
  import('../components/blog/BlogCategoryView.vue');

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
    path: '/category',
    name: 'category-list',
    component: CategoryView,
  },
  {
    path: '/category/:category?/page/:page?', // Make category and page parameters optional
    name: 'blog-categories-list',
    component: CategoryView,
    props: true,
  },
  {
    // Route for individual blog posts using slug
    path: '/blog/:slug',
    name: 'blog-post',
    component: BlogPostView,
    props: true,
  },
  {
    path: '/blog/category/:category/page/:page?',
    name: 'category-archive-pagination',
    component: BlogCategoryView,
    props: true,
  },
  {
    path: '/blog/category/:category',
    name: 'category-archive',
    component: BlogCategoryView,
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
