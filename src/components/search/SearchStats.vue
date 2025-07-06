<template>
  <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 pb-0 mb-0">
    <!-- Results Count -->
    <div class="flex items-center space-x-2">
      <span v-if="totalResults > 0">
        <strong class="text-gray-900 dark:text-white">{{ totalResults }}</strong>
        {{ totalResults === 1 ? 'result' : 'results' }}
        <span v-if="query" class="ml-1">
          for <strong class="text-gray-900 dark:text-white">"{{ query }}"</strong>
        </span>
      </span>
      <span v-else-if="query">
        No results found for <strong class="text-gray-900 dark:text-white">"{{ query }}"</strong>
      </span>
      <span v-else>
        Start typing to search...
      </span>
    </div>

    <!-- Search Time -->
    <div v-if="searchTime !== null" class="flex items-center space-x-1">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {{ searchTime }}ms
      </span>
    </div>
  </div>

  <!-- Search Filters/Categories (if results exist) -->
  <div v-if="totalResults > 0 && categories.length > 0" class="mb-4">
    <div class="flex items-center space-x-2 text-xs">
      <span class="text-gray-500 dark:text-gray-400">Filter by:</span>
      <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.name"
            @click="$emit('filter-category', category.name)"
            :class="[
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors',
              category.active
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]"
          >
            {{ category.name }}
          <span class="ml-1 text-xs opacity-75">({{ category.count }})</span>
        </button>
      </div>
    </div>
  </div>

  <!-- No Results Suggestions -->
  <div v-if="totalResults === 0 && query && showSuggestions" class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
    <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
      Try these suggestions:
    </h3>
    <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
      <li>• Check your spelling</li>
      <li>• Try different keywords</li>
      <li>• Use more general terms</li>
      <li>• Browse by categories or tags below</li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  totalResults: {
    type: Number,
    default: 0
  },
  query: {
    type: String,
    default: ''
  },
  searchTime: {
    type: Number,
    default: null
  },
  categories: {
    type: Array,
    default: () => []
  },
  showSuggestions: {
    type: Boolean,
    default: true
  }
});

defineEmits(['filter-category']);
</script>
