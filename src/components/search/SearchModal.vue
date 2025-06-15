<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-gray-800 bg-opacity-75"
    @click.self="closeModal"
  >
    <div
      class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-xl mx-4 border border-gray-200 dark:border-gray-700 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div class="p-5">
        <h2
          id="search-modal-title"
          class="text-lg font-medium text-gray-900 dark:text-white mb-4"
        >
          Search Posts
        </h2>
        <input
          type="search"
          ref="searchInput"
          v-model="searchQuery"
          placeholder="Search by title, description, or content..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-800 dark:text-white"
          @keyup.enter="performSearch"
        />
      </div>
      <div class="px-5 pb-5 max-h-96 overflow-y-auto">
        <ul
          v-if="Array.isArray(searchResults) && searchResults.length > 0"
          class="space-y-3"
        >
          <li v-for="post in searchResults" :key="post.slug">
            <router-link
              :to="{ name: 'blog-post', params: { slug: post.slug } }"
              class="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="closeModal"
            >
              <div class="flex items-start space-x-3">
                <!-- Post Thumbnail -->
                <div class="flex-shrink-0">
                  <img
                    :src="post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'"
                    :alt="post.featuredImage?.alt || post.title"
                    class="w-12 h-12 rounded-lg object-cover"
                    loading="lazy"
                  />
                </div>
                <!-- Post Content -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 dark:text-white line-clamp-1">
                    {{ post.title }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                    {{ post.excerpt || post.description }}
                  </p>
                  <div class="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {{ post.category }}
                    </span>
                    <span class="ml-2">{{ formatDate(post.date) }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
        <p
          v-else-if="searchQuery.trim() && searchResults.length === 0"
          class="text-gray-500 dark:text-gray-400 text-center py-4"
        >
          No results found for "{{ searchQuery }}".
        </p>
        <p v-else class="text-gray-500 dark:text-gray-400 text-center py-4">
          Enter a query to search posts.
        </p>
      </div>
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        aria-label="Close search modal"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

interface Post {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  category: string;
  date: string;
  featuredImage?: {
    src: string;
    alt: string;
  };
  contentHtml?: string;
}

import postsData from '../../blog-data.json';

const posts: Post[] = postsData as Post[];

const props = defineProps<{
  showModal: boolean;
}>();

const emit = defineEmits(['close']);

const searchQuery = ref('');
const searchResults = ref<Post[]>([]);
const searchInput = ref<HTMLInputElement | null>(null);
const router = useRouter();

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  searchResults.value = posts
    .filter((post: Post) => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const descriptionMatch = post.description?.toLowerCase().includes(query);
      const excerptMatch = post.excerpt?.toLowerCase().includes(query);
      const contentMatch = typeof post.contentHtml === 'string' && post.contentHtml.toLowerCase().includes(query);
      return titleMatch || descriptionMatch || excerptMatch || contentMatch;
    })
    .map((post: Post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      excerpt: post.excerpt,
      category: post.category,
      date: post.date,
      featuredImage: post.featuredImage,
    }));
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

watch(searchQuery, performSearch);

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  },
);

const closeModal = () => {
  searchQuery.value = '';
  searchResults.value = [];
  emit('close');
};
</script>

<style scoped>
/* Add any specific styles for the modal here */
</style>
