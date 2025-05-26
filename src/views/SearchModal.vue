<template>
  <div
    v-if="showModal"
    class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-gray-800 bg-opacity-75"
    @click.self="closeModal"
  >
    <div class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-xl mx-4" role="dialog" aria-modal="true" aria-labelledby="search-modal-title">
      <div class="p-5">
        <h2 id="search-modal-title" class="text-lg font-medium text-gray-900 dark:text-white mb-4">Search Posts</h2>
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
        <ul v-if="searchResults.length" class="space-y-3">
          <li v-for="post in searchResults" :key="post.slug">
            <router-link
              :to="{ name: 'blog-post', params: { slug: post.slug } }"
              class="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="closeModal"
            >
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ post.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ post.description }}</p>
            </router-link>
          </li>
        </ul>
        <p v-else-if="searchQuery && !searchResults.length" class="text-gray-500 dark:text-gray-400 text-center py-4">
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
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import postsData from '../blog-data.json'; // Assuming this path is correct

const props = defineProps({
  showModal: Boolean,
});

const emit = defineEmits(['close']);

const searchQuery = ref('');
const searchResults = ref([]);
const searchInput = ref(null); // Ref for the input element
const router = useRouter();

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  searchResults.value = postsData.filter(post => {
    const titleMatch = post.title?.toLowerCase().includes(query);
    const descriptionMatch = post.description?.toLowerCase().includes(query);
    // Basic content search (might be slow for large content, consider indexing later)
    const contentMatch = post.contentHtml?.toLowerCase().includes(query);
    return titleMatch || descriptionMatch || contentMatch;
  });
};

watch(searchQuery, performSearch);

watch(() => props.showModal, (newValue) => {
  if (newValue) {
    // Focus the input when the modal opens
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
});

const closeModal = () => {
  searchQuery.value = ''; // Clear search on close
  searchResults.value = [];
  emit('close');
};

</script>

<style scoped>
/* Add any specific styles for the modal here */
</style>

