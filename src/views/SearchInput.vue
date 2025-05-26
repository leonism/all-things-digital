<template>
  <div class="relative">
    <input
      type="search"
      v-model="searchTerm"
      @input="handleInput"
      placeholder="Search posts..."
      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
    />
    <!-- Basic search icon (optional) -->
    <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchTerm = ref('');

// Define emits to send the search term to the parent component
const emit = defineEmits(['update:search']);

const handleInput = () => {
  // Emit the current search term, converting to lowercase for case-insensitive search
  emit('update:search', searchTerm.value.toLowerCase());
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

