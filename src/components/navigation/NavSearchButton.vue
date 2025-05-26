<template>
  <!-- start the search button -->
  <button
    id="searchButton"
    title="Search Button"
    aria-label="Search Button"
    class="group relative hidden h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-broken-white shadow-sm transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5 dark:border-none dark:bg-gray-800 dark:hover:bg-gray-700 md:flex"
    @click="openSearch"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5 text-gray-600 transition-colors duration-300 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
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
    <span
      class="absolute -bottom-6 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 dark:text-gray-300"
    >
      Search
    </span>
  </button>
  <!-- end the search button -->
</template>

<script setup>
// Define emits to signal the parent component to open the search modal
const emit = defineEmits(["open-search"]);

const openSearch = () => {
  emit("open-search");
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

