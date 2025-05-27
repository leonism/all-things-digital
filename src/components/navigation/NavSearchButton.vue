<template>
  <!-- start the search button -->
  <button
    id="searchButton"
    title="Search Button"
    aria-label="Search Button"
    class="flex items-center text-pink-heading justify-center w-10 h-10 bg-white mr-2 rounded-full shadow-sm dark:bg-white"
    @click="openSearch"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6 font-bold cursor-pointer sun text-pink-heading"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </button>
  <!-- end the search button -->
</template>

<script setup>
// Define emits to signal the parent component to open the search modal
const emit = defineEmits(['open-search']);

const openSearch = () => {
  emit('open-search');
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
