<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="emitPageChange(currentPage - 1)"
    >
      Previous
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      :class="{ active: page === currentPage }"
      @click="emitPageChange(page)"
    >
      {{ page }}
    </button>
    <button
      :disabled="currentPage === totalPages"
      @click="emitPageChange(currentPage + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['page-change']);

const emitPageChange = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem; /* Space between buttons */
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  border-radius: 0.25rem; /* Rounded corners */
}

.pagination button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #007bff; /* Example active color */
  color: white;
  border-color: #007bff;
}

/* Dark mode styles for pagination */
.dark .pagination button {
  background-color: #333;
  border-color: #555;
  color: #eee;
}

.dark .pagination button:hover:not(:disabled) {
  background-color: #555;
}

.dark .pagination button.active {
  background-color: #0056b3; /* Example active color in dark mode */
  border-color: #0056b3;
}
</style>
