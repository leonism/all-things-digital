<template>
  <div
    v-if="suggestions.length > 0"
    class="border-t border-gray-200 dark:border-gray-700 pt-4"
  >
    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      Search Suggestions
    </h3>

    <div class="space-y-3">
      <!-- Categories -->
      <div v-if="categorySuggestions.length > 0">
        <h4
          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
        >
          Categories
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categorySuggestions"
            :key="category"
            @click="$emit('suggestion-click', category)"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <svg
              class="w-3 h-3 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Tags -->
      <div v-if="tagSuggestions.length > 0">
        <h4
          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
        >
          Tags
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in tagSuggestions"
            :key="tag"
            @click="$emit('suggestion-click', tag)"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <svg
              class="w-3 h-3 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Authors -->
      <div v-if="authorSuggestions.length > 0">
        <h4
          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
        >
          Authors
        </h4>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="author in authorSuggestions"
            :key="author"
            @click="$emit('suggestion-click', author)"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <svg
              class="w-3 h-3 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {{ author }}
          </button>
        </div>
      </div>

      <!-- Popular Searches -->
      <div v-if="popularSuggestions.length > 0">
        <h4
          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2"
        >
          Popular Searches
        </h4>
        <div class="space-y-1">
          <button
            v-for="suggestion in popularSuggestions"
            :key="suggestion"
            @click="$emit('suggestion-click', suggestion)"
            class="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg
              class="w-4 h-4 mr-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  suggestions: {
    type: Array,
    default: () => [],
  },
  maxSuggestions: {
    type: Number,
    default: 6,
  },
});

defineEmits(['suggestion-click']);

// Separate suggestions by type
const categorySuggestions = computed(() => {
  return props.suggestions
    .filter((s) => s.type === 'category')
    .map((s) => s.value)
    .slice(0, Math.floor(props.maxSuggestions / 3));
});

const tagSuggestions = computed(() => {
  return props.suggestions
    .filter((s) => s.type === 'tag')
    .map((s) => s.value)
    .slice(0, Math.floor(props.maxSuggestions / 3));
});

const authorSuggestions = computed(() => {
  return props.suggestions
    .filter((s) => s.type === 'author')
    .map((s) => s.value)
    .slice(0, Math.floor(props.maxSuggestions / 3));
});

const popularSuggestions = computed(() => {
  return props.suggestions
    .filter((s) => s.type === 'popular')
    .map((s) => s.value)
    .slice(0, 5);
});
</script>
