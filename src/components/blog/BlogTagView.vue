<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">Tag: #{{ tagName }}</h1>
    <div
      v-if="filteredPosts.length"
      class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <BlogArticleCard
        v-for="post in filteredPosts"
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
      <p>No posts found with the tag "#{{ tagName }}".</p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
        >Back to Blog List</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BlogTagView Component
 *
 * This component displays a list of blog posts associated with a specific tag.
 * It retrieves the tag name from the route parameters, filters the blog posts
 * from `blog-data.json` based on the tag, and updates the page's meta tags
 * using `@unhead/vue`.
 *
 * The component uses Vue 3 Composition API with `<script setup>`, computed
 * properties for filtering and meta tags, and watchers to react to route
 * and tag name changes.
 */
import { ref, computed, watch, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'; // Import useHead
import postsData from '../../blog-data.json';
import BlogArticleCard from './BlogArticleCard.vue'; // Import BlogArticleCard

const route = useRoute();
// Reactive reference to store the current tag name from the route.
// Handle the case where route.params.tag might be an array.
const tagName = ref(
  Array.isArray(route.params.tag) ? route.params.tag[0] : route.params.tag,
);

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
  readingTime?: string | number; // Added readingTime property
  schema?: any; // Use a more specific type if schema structure is known
  status?: 'published' | 'draft' | string; // Allow string type based on data structure
}

/**
 * Computed property that filters the imported `postsData` array
 * to include only published posts that have the current tag.
 * It converts tags to lowercase for case-insensitive matching.
 */
const filteredPosts: Ref<BlogPost[]> = computed(() => {
  if (!tagName.value) return [];
  const lowerCaseTag = tagName.value.toLowerCase();
  return postsData.filter(
    (post) =>
      (!post.status || post.status === 'published') && // Filter published posts
      post.tags &&
      post.tags.map((t) => t.toLowerCase()).includes(lowerCaseTag),
  );
});

// Computed properties for meta tags
const pageTitle = computed(
  () => `Tag: #${tagName.value || 'Archive'} - All Things Digital`,
); // Replace site name
const pageDescription = computed(
  () => `Posts tagged with #${tagName.value || 'archive'}.`,
);
const canonicalUrl = computed(() => {
  const base = 'https://yourdomain.com'; // <<<--- IMPORTANT: Replace with your actual domain
  return tagName.value
    ? `${base}/blog/tag/${encodeURIComponent(tagName.value)}`
    : `${base}/blog`;
});

// Watcher to update meta tags whenever the 'tagName' ref changes.
// This ensures that meta tags are updated when navigating between tags.
watch(
  tagName,
  (newTagName) => {
    if (newTagName) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: '/images/default-og-image.png' }, // Default image for tag pages
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: '/images/default-og-image.png' }, // Default image
          { name: 'robots', content: 'index, follow' }, // Allow indexing for tag pages
        ],
        link: [{ rel: 'canonical', href: canonicalUrl.value }],
      });
    } else {
      useHead({ title: 'Tag Archive' });
    }
  },
  { immediate: true },
);

// Watcher to react to changes in the route's tag parameter.
// This is triggered when navigating to a different tag page.
watch(
  () => route.params.tag,
  (newTag) => {
    // Handle the case where newTag might be an array.
    tagName.value = Array.isArray(newTag) ? newTag[0] : newTag;
    // Meta tags are updated by the tagName watcher
  },
);

/**
 * Formats a date string into a human-readable string.
 * @param dateString The date string to format.
 * @returns The formatted date string or the original string if formatting fails.
 */
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
