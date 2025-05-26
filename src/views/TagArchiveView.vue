<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 dark:text-white">Tag: #{{ tagName }}</h1>
    <div v-if="filteredPosts.length" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <!-- Reuse the post card structure from BlogListView -->
      <div v-for="post in filteredPosts" :key="post.slug" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col">
        <router-link :to="{ name: 'blog-post', params: { slug: post.slug } }" class="block">
          <img
            v-if="post.featuredImage && post.featuredImage.src"
            :src="post.featuredImage.src"
            :alt="post.featuredImage.alt || post.title"
            class="w-full h-48 object-cover"
            loading="lazy"
          />
          <div v-else class="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            No Image
          </div>
        </router-link>
        <div class="p-6 flex flex-col flex-grow">
          <h2 class="text-xl font-semibold mb-2 dark:text-white">
            <router-link :to="{ name: 'blog-post', params: { slug: post.slug } }" class="hover:text-pink-500 dark:hover:text-pink-400">
              {{ post.title }}
            </router-link>
          </h2>
          <div class="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
            <img v-if="post.author && post.author.image" :src="post.author.image" alt="" class="w-6 h-6 rounded-full mr-2 object-cover">
            <span>By {{ post.author?.name || 'Admin' }} on {{ formatDate(post.date) }}</span>
             <span v-if="post.readingTime" class="ml-auto">{{ post.readingTime }} read</span>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-4 flex-grow">
            {{ post.excerpt || post.description || 'No description available.' }}
          </p>
          <div class="mt-auto">
             <div class="mb-2">
              <span v-if="post.categories && post.categories.length" class="text-sm text-gray-500 dark:text-gray-400 mr-2">Categories:</span>
              <router-link
                v-for="category in post.categories"
                :key="category"
                :to="{ name: 'category-archive', params: { category: category } }"
                class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold mr-1 px-2.5 py-0.5 rounded"
              >
                {{ category }}
              </router-link>
            </div>
            <router-link :to="{ name: 'blog-post', params: { slug: post.slug } }" class="text-pink-600 dark:text-pink-400 hover:underline font-medium">
              Read more &rarr;
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-10">
      <p>No posts found with the tag "#{{ tagName }}".</p>
      <router-link to="/blog" class="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">Back to Blog List</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue'; // Import useHead
import postsData from '../blog-data.json';

const route = useRoute();
const tagName = ref(route.params.tag);

const filteredPosts = computed(() => {
  if (!tagName.value) return [];
  const lowerCaseTag = tagName.value.toLowerCase();
  return postsData.filter(post =>
    (!post.status || post.status === 'published') && // Filter published posts
    post.tags && post.tags.map(t => t.toLowerCase()).includes(lowerCaseTag)
  );
});

// Computed properties for meta tags
const pageTitle = computed(() => `Tag: #${tagName.value || 'Archive'} - All Things Digital`); // Replace site name
const pageDescription = computed(() => `Posts tagged with #${tagName.value || 'archive'}.`);
const canonicalUrl = computed(() => {
    const base = 'https://yourdomain.com'; // <<<--- IMPORTANT: Replace with your actual domain
    return tagName.value ? `${base}/blog/tag/${encodeURIComponent(tagName.value)}` : `${base}/blog`;
});

// Update meta tags using useHead, reacting to tagName changes
watch(tagName, (newTagName) => {
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
        { name: 'robots', content: 'index, follow' } // Allow indexing for tag pages
      ],
      link: [
        { rel: 'canonical', href: canonicalUrl.value }
      ]
    });
  } else {
     useHead({ title: 'Tag Archive' });
  }
}, { immediate: true });

// Watch route param changes
watch(() => route.params.tag, (newTag) => {
  tagName.value = newTag;
  // Meta tags are updated by the tagName watcher
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return dateString;
  }
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
