<template>
  <section id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <!-- Blog Header Section -->
    <HeaderBlog />

    <!-- Conditional Blog Posts Grid -->
    <div v-if="paginatedPosts.length" class="flex flex-col">
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
        :authorName="post.author?.name || 'Unknown Author'"
        :category="post.category"
      />
    </div>

    <!-- Empty State, fallback if no markdown populated -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No blog posts found.</p>
      <p>
        Make sure you have Markdown files in `/src/content/posts/` and run `node
        scripts/generate-blog-data.js`.
      </p>
    </div>

    <!-- Pagination Controls -->
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="goToPageLocal"
    />
  </section>
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
import { useRoute } from 'vue-router';
import { usePagination } from '../../composables/usePagination';
import HeaderBlog from '../heading/HeaderBlog.vue';
import BlogArticleCard from '../common/BlogArticleCard.vue';
import Pagination from '../../components/common/Pagination.vue';
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
    link?: string;
  };
  category?: string;
  categories?: string[];
  tags?: string[];
  featuredImage?: {
    src: string;
    alt?: string;
    caption?: string;
  };
  seoTitle?: string;
  excerpt?: string;
  description?: string;
  readingTime?: string;
  metaRobots?: string;
  canonicalUrl?: string;
  schema?: any;
  status?: 'published' | 'draft' | string;
  featured?: boolean;
  priority?: string;
}

// Reactive reference to store the current route information.
const route = useRoute();

// Number of posts displayed per page.
const postsPerPage = 6;

// Reactive reference to store all published blog posts.
const allPosts: Ref<BlogPost[]> = ref([]);

// Import router for navigation.
import { useRouter } from 'vue-router';
const router = useRouter();

// Use pagination composable to manage pagination state.
const { currentPage, totalPages, goToPage } = usePagination(
  computed(() => allPosts.value.length),
  postsPerPage,
);

// Function to handle page navigation locally and update the URL.
const goToPageLocal = (page: number) => {
  goToPage(page);
  router.push({
    name: 'blog-list-pagination',
    params: { page: String(page) },
  });
};

// Computed property to get the posts for the current page.
const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return allPosts.value.slice(startIndex, endIndex);
});

// Set meta tags for the main blog list page using useHead.
// This updates the document head with SEO-related information.
useHead({
  title: 'Blog | DGPond.COM',
  meta: [
    {
      name: 'description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { property: 'og:title', content: 'Blog | DGPond.COM' },
    {
      property: 'og:description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: 'https://all-things-digital.pages.dev/blog',
    },
    { property: 'og:image', content: '/images/default-og-image.png' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Blog | DGPond.COM' },
    {
      name: 'twitter:description',
      content: 'Read the latest articles and insights on our blog.',
    },
    { name: 'twitter:image', content: '/images/default-og-image.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://all-things-digital.pages.dev/blog' },
  ],
});

// Lifecycle hook that runs after the component is mounted.
// It fetches and filters the blog posts.
onMounted(() => {
  // Filter posts to include only those with status 'published'.
  const publishedPosts = postsData.filter(
    (post) => post.status === 'published',
  );

  // Sort posts by date in descending order.
  publishedPosts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  // Assign sorted posts to the reactive reference.
  allPosts.value = publishedPosts;

  // Determine the initial page from the route parameters.
  let initialPage = Number(route.params.page) || 1;
  if (isNaN(initialPage) || initialPage < 1) {
    initialPage = 1;
  }

  // Validate and set the current page based on total pages.
  if (initialPage > 1 && initialPage <= totalPages.value) {
    currentPage.value = initialPage;
  } else {
    currentPage.value = 1;
  }
});
</script>
