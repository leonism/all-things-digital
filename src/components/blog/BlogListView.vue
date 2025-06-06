<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <HeaderBlog />
    <div v-if="paginatedPosts.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <BlogArticleCard
        v-for="post in paginatedPosts"
        :key="post.slug"
        :imageSrc="
          post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        "
        :imageAlt="post.featuredImage?.alt || post.title"
        :title="post.title"
        :postLink="`/blog/${post.slug}`"
        :date="post.date"
        :excerpt="post.excerpt || post.description"
        :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'"
        :authorLink="post.author?.link || '/about'"
      />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No blog posts found.</p>
      <p>
        Make sure you have Markdown files in `/src/content/posts/` and run `node
        scripts/generate-blog-data.js`.
      </p>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
/**
 * BlogListView Component
 *
 * This component displays a list of blog posts using the `BlogArticleCard`
 * component. It fetches all published posts from `blog-data.json` when the
 * component is mounted and updates the page's meta tags using `@unhead/vue`.
 *
 * The component uses Vue 3 Composition API with `<script setup>`.
 */
import { ref, onMounted, computed, type Ref } from 'vue';
import { useHead } from '@unhead/vue';
import { useRouter, useRoute } from 'vue-router'; // Import useRouter and useRoute
import HeaderBlog from '../heading/HeaderBlog.vue';
import BlogArticleCard from './BlogArticleCard.vue';
import postsData from '../../blog-data.json';

interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  lastModified?: string;
  author?: {
    name: string;
    role?: string;
    image?: string;
    link?: string; // Added link property
  };
  category?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: {
    src: string;
    alt?: string;
  };
  contentHtml: string;
  seoTitle?: string;
  excerpt?: string;
  description?: string; // Added description property
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any; // Use a more specific type if schema structure is known
  status?: 'published' | 'draft' | string; // Allow string type based on data structure
}

// Get router and route instances
const router = useRouter();
const route = useRoute();

// Reactive references and constants for pagination
const postsPerPage = 6;
const currentPage = ref(1);
const allPosts: Ref<BlogPost[]> = ref([]);

// Reactive reference to store the list of blog posts for the current page.
const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return allPosts.value.slice(startIndex, endIndex);
});

// Computed property for total number of pages
const totalPages = computed(() => {
  return Math.ceil(allPosts.value.length / postsPerPage);
});

// Methods for pagination
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Update URL with page route parameter
    router.push({ name: 'blog-list-pagination', params: { page: page.toString() } });
    // Scroll to top of the blog list when changing page
    const mainWrapper = document.getElementById('mainWrapper');
    if (mainWrapper) {
      mainWrapper.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Set meta tags for the main blog list page using useHead.
// This updates the document head with SEO-related information.
useHead({
  title: 'Blog | DGPond.COM', // Updated title
  meta: [
    {
      name: 'description',
      content: 'Read the latest articles and insights on our blog.',
    }, // Customize description
    { property: 'og:title', content: 'Blog | DGPond.COM' },
    {
      property: 'og:description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://yourdomain.com/blog' }, // <<<--- IMPORTANT: Replace with your actual domain
    { property: 'og:image', content: '/images/default-og-image.png' }, // <<<--- IMPORTANT: Replace with your default OG image path
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Blog | DGPond.COM' },
    {
      name: 'twitter:description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { name: 'twitter:image', content: '/images/default-og-image.png' }, // <<<--- IMPORTANT: Replace with your default Twitter image path
  ],
  link: [
    { rel: 'canonical', href: 'https://yourdomain.com/blog' }, // <<<--- IMPORTANT: Replace with your actual domain
  ],
});

// Lifecycle hook that runs after the component is mounted.
// It fetches, filters, and sorts the blog posts, and reads initial page from URL.
onMounted(() => {
  // Filter for published posts and sort by date in descending order
  const publishedPosts = postsData.filter(post => post.status === 'published');
  publishedPosts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Descending order
  });

  allPosts.value = publishedPosts;

  // Read initial page from URL route parameter
  const initialPage = Number(route.params.page) || 1;
  if (initialPage > 1 && initialPage <= totalPages.value) {
    currentPage.value = initialPage;
  }
});
</script>

<style scoped>
/* Add component-specific styles if necessary */

/* Basic styling for pagination */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem; /* Space between buttons */
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 0.25rem; /* Rounded corners */
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #007bff; /* Example active color */
  color: white;
  border-color: #007bff;
}

/* Dark mode styles for pagination */
.dark .pagination button {
  background-color: #333;
  border-color: #555;
  color: #eee;
}

.dark .pagination button:hover:not(:disabled) {
  background-color: #555;
}

.dark .pagination button.active {
  background-color: #0056b3; /* Example active color in dark mode */
  border-color: #0056b3;
}
</style>

<style scoped>
/* Add component-specific styles if necessary */
</style>
