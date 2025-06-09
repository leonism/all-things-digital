<template>
  <nav v-if="totalPages > 1" aria-label="Pagination">
    <ul class="flex items-center justify-center gap-1 sm:gap-2 my-15">
      <!-- Previous Button - Changed to semi-rounded (rounded-lg) and button-like appearance -->
      <li>
        <button
          @click="emitPageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-sm sm:text-base transition-colors duration-200"
          :class="{
            'text-slate-700 hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-gray-700':
              currentPage !== 1,
            'text-slate-300 dark:text-gray-600 cursor-not-allowed':
              currentPage === 1,
          }"
          aria-label="Previous page"
        >
          <span aria-hidden="true">&larr;</span>
          <span class="ml-1">Previous</span>
        </button>
      </li>

      <!-- Page Numbers - Unchanged from previous version -->
      <li v-for="page in totalPages" :key="page">
        <button
          @click="emitPageChange(page)"
          class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-xs sm:text-base transition-colors duration-300"
          :class="{
            'text-slate-700 shadow-md transition-all duration-300 dark:text-white dark:hover:bg-gray-700':
              page === currentPage,
            'text-slate-300 shadow-md transition-all duration-300 hover:bg-white dark:text-white dark:hover:bg-gray-700':
              page !== currentPage,
          }"
          :aria-current="page === currentPage ? 'page' : null"
          :aria-label="`Go to page ${page}`"
        >
          {{ page }}
        </button>
      </li>

      <!-- Next Button - Changed to semi-rounded (rounded-lg) and button-like appearance -->
      <li>
        <button
          @click="emitPageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 text-sm sm:text-base transition-colors duration-200"
          :class="{
            'text-slate-700 hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-gray-700':
              currentPage !== totalPages,
            'text-slate-300 dark:text-gray-600 cursor-not-allowed':
              currentPage === totalPages,
          }"
          aria-label="Next page"
        >
          <span class="mr-1">Next</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['pageChange']);

const emitPageChange = (page: number) => {
  emit('pageChange', page);
};
</script>

<style scoped></style>
