<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <HeaderBlog />
    <div v-if="posts.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <BlogArticleCard
        v-for="post in posts"
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
import { ref, onMounted, type Ref } from 'vue';
import { useHead } from '@unhead/vue';
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

// Reactive reference to store the list of blog posts.
const posts: Ref<BlogPost[]> = ref([]);

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
// It fetches and filters the blog posts.
onMounted(() => {
  // Filter posts to include only those with status 'published' or no status field.
  posts.value = postsData.filter(
    (post) => !post.status || post.status === 'published',
  );
});
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
