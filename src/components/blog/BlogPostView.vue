<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <article
      v-if="post"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <ContentBlogPostHeader
        :title="post.title"
        :subtitle="post.subtitle"
        :date="post.date"
        :tags="post.tags"
      />
      <img
        v-if="post.featuredImage && post.featuredImage.src"
        :src="post.featuredImage.src"
        :alt="post.featuredImage.alt || post.title"
        class="w-full h-64 md:h-96 object-cover"
      />
      <div class="p-6 md:p-8">
        <div
          class="prose dark:prose-invert max-w-none"
          v-html="post.contentHtml"
        ></div>

        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div v-if="post.categories && post.categories.length" class="mb-4">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300"
              >Categories:</span
            >
            <router-link
              v-for="category in post.categories"
              :key="category"
              :to="{
                name: 'category-archive',
                params: { category: category },
              }"
              class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {{ category }}
            </router-link>
          </div>
          <div v-if="post.tags && post.tags.length">
            <span class="font-semibold mr-2 text-gray-700 dark:text-gray-300"
              >Tags:</span
            >
            <router-link
              v-for="tag in post.tags"
              :key="tag"
              :to="{ name: 'tag-archive', params: { tag: tag } }"
              class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              #{{ tag }}
            </router-link>
          </div>
        </div>

        <div
          id="comments-section"
          class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h2 class="text-2xl font-bold mb-4 dark:text-white">Comments</h2>
          <p class="text-gray-500 dark:text-gray-400">
            (Comment system integration pending user configuration)
          </p>
        </div>
      </div>
    </article>
    <div v-else class="text-center py-16">
      <h2 class="text-2xl font-semibold dark:text-white">Post not found</h2>
      <p class="text-gray-500 dark:text-gray-400 mt-2">
        The requested blog post could not be found.
      </p>
      <router-link
        to="/blog"
        class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block"
      >
        &larr; Back to Blog List
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import HeaderBlogPost from '../heading/HeaderBlogPost.vue';
import postsData from '../../blog-data.json';

const route = useRoute();
const post = ref(null);

const findPost = (slug) => {
  const foundPost = postsData.find((p) => p.slug === slug);
  return foundPost && (!foundPost.status || foundPost.status === 'published')
    ? foundPost
    : null;
};

// Computed properties for meta tags
const pageTitle = computed(
  () => post.value?.seoTitle || post.value?.title || 'Blog Post',
);
const pageDescription = computed(
  () => post.value?.excerpt || 'Read this blog post.',
);
const ogImage = computed(
  () => post.value?.featuredImage?.src || '/images/default-og-image.png',
); // Add a default OG image path
const canonicalUrl = computed(() => {
  // Construct canonical URL - replace with your actual domain
  const base = 'https://yourdomain.com'; // <<<--- IMPORTANT: Replace with your actual domain
  return post.value ? `${base}/blog/${post.value.slug}` : base;
});

// Update meta tags using useHead
watch(
  post,
  (currentPost) => {
    if (currentPost) {
      useHead({
        title: pageTitle.value,
        meta: [
          { name: 'description', content: pageDescription.value },
          // Open Graph
          { property: 'og:title', content: pageTitle.value },
          { property: 'og:description', content: pageDescription.value },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: canonicalUrl.value },
          { property: 'og:image', content: ogImage.value },
          { property: 'article:published_time', content: currentPost.date },
          {
            property: 'article:modified_time',
            content: currentPost.lastModified || currentPost.date,
          },
          // Twitter Card
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: pageTitle.value },
          { name: 'twitter:description', content: pageDescription.value },
          { name: 'twitter:image', content: ogImage.value },
          // Robots
          {
            name: 'robots',
            content: currentPost.metaRobots || 'index, follow',
          },
        ],
        link: [
          {
            rel: 'canonical',
            href: currentPost.canonicalUrl || canonicalUrl.value,
          },
        ],
        // Add JSON-LD script if available in post data
        script: currentPost.schema
          ? [
              {
                type: 'application/ld+json',
                innerHTML: JSON.stringify(currentPost.schema),
              },
            ]
          : [],
      });
    } else {
      useHead({ title: 'Post Not Found' });
    }
  },
  { immediate: true },
);

// Watch route changes to update the post
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      post.value = findPost(newSlug);
      // Meta tags are updated automatically by the 'post' watcher above
    }
  },
  { immediate: true },
);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return dateString;
  }
};
</script>

<style>
/* Styles for Tailwind Typography */
.prose :where(code):not(:where([class~='not-prose'] *))::before,
.prose :where(code):not(:where([class~='not-prose'] *))::after {
  content: '';
}
</style>
