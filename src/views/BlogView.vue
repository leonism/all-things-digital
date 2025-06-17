<template>
  <section id="mainWrapper"
  class="max-w-4xl sm:mx-5 md:mx-10 lg:mx-auto"
  role="main">
    <!-- Blog Header Section -->
    <HeaderBlog />
    <!-- Conditional Blog Posts Grid -->
    <template v-if=" paginatedPosts.length ">
      <BlogArticleCard v-for=" post in paginatedPosts " :key="post.slug" :imageSrc="post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        " :imageAlt="post.featuredImage?.alt || post.title" :title="post.title" :postLink="`/blog/${post.slug}`"
        :date="post.date" :excerpt="post.excerpt || post.description" :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'" :authorLink="post.author?.link || '/about'"
        :authorName="post.author?.name || 'Unknown Author'" :category="post.category" role="article" />
      <!-- Pagination Controls -->
      <Suspense v-if=" totalPages > 1 ">
        <template #default>
          <LazyPagination :currentPage="currentPage" :totalPages="totalPages" @page-change="handlePageChange" />
        </template>
        <template #fallback>
          <div class="flex justify-center py-4">
            <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-64 rounded"></div>
          </div>
        </template>
      </Suspense>
    </template>
    <!-- Empty State, backfall if no markdown populated  -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10" role="alert">
      <h2>No blog posts found.</h2>
      <p>
        Make sure you have Markdown files in `/src/content/posts/` and run `node
        scripts/generate-blog-data.js`.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * BlogView Component
 *
 * This component displays a list of blog posts using the `BlogArticleCard`
 * component. It fetches all published posts from `blog-data.json` when the
 * component is mounted and updates the page's meta tags using `@unhead/vue`.
 *
 * The component uses Vue 3 Composition API with `<script setup>`.
 */
import { ref, onMounted, computed, type Ref } from 'vue';
import HeaderBlog from '../components/heading/HeaderBlog.vue';
import BlogArticleCard from '../components/home/BlogArticleCard.vue';
import Pagination from '../components/common/Pagination.vue';
import { usePagination } from '../composables/usePagination';
import postsData from '../blog-data.json';
import { useWebsiteSEO } from '../composables/useSEO';

interface BlogPost
{
  slug: string;
  title: string;
  seoTitle?: string;
  date: string;
  lastModified?: string;
  author?: {
    name: string;
    role?: string;
    image?: string;
    link?: string;
  };
  category?: string;
  tags?: string[];
  featuredImage?: {
    src: string;
    alt?: string;
    caption?: string;
  };
  excerpt?: string;
  readingTime?: string;
  status?: 'published' | 'draft' | string;
  featured?: boolean;
  priority?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  description?: string;
}

// Reactive reference to store all published blog posts.
const allPublishedPosts: Ref<BlogPost[]> = ref( [] );
// Configure how many post being shown per pages.
const postsPerPage = 6;
// Confihure the pagination.
const { currentPage, totalPages, goToPage } = usePagination(
  computed( () => allPublishedPosts.value.length ),
  postsPerPage,
);

const paginatedPosts = computed( () =>
{
  const start = ( currentPage.value - 1 ) * postsPerPage;
  const end = start + postsPerPage;
  return allPublishedPosts.value.slice( start, end );
} );

// Function to handle page changes from the pagination component
const handlePageChange = ( page: number ) =>
{
  goToPage( page );
  // Optional: Scroll to top when page changes
  window.scrollTo( { top: 0, behavior: 'smooth' } );
};

// SEO Meta Tags using composable
useWebsiteSEO({
  title: 'Blog',
  description: 'Explore our latest blog posts covering technology, digital trends, programming tutorials, and industry insights. Stay updated with the latest in tech.',
  keywords: ['blog', 'technology', 'programming', 'tutorials', 'digital trends', 'tech news', 'web development', 'software'],
  canonicalPath: '/blog'
});

// Lifecycle hook that runs after the component is mounted.
// It fetches and filters the blog posts.
onMounted( () =>
{
  // Filter posts to include only those with status 'published' or no status field.
  allPublishedPosts.value = postsData.filter(
    ( post ) => !post.status || post.status === 'published',
  );
} );
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

<script setup>
const LazyPagination = defineAsyncComponent(
  () => import('../components/common/Pagination.vue'),
);
</script>
