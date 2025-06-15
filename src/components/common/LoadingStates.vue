<template>
  <div class="loading-container">
    <!-- Skeleton for Blog Article Card -->
    <div v-if="type === 'blog-card'" class="animate-pulse">
      <div class="flex flex-col my-10 min-h-60 overflow-hidden rounded-2xl shadow-xl border border-transparent bg-broken-white dark:bg-postcard md:flex-row">
        <div class="mb-0 shrink-0 md:w-2/5">
          <div class="w-full h-48 md:h-full bg-gray-300 dark:bg-gray-700 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"></div>
        </div>
        <div class="flex grow flex-col p-4 md:p-5 space-y-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton for Featured Post -->
    <div v-else-if="type === 'featured-post'" class="animate-pulse">
      <div class="mt-10 mb-10 rounded-xl shadow-xl bg-broken-white dark:bg-postcard">
        <div class="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
        <div class="flex items-center p-6 space-x-4">
          <div class="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton for Image -->
    <div v-else-if="type === 'image'" class="animate-pulse">
      <div class="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
    </div>

    <!-- Generic spinner -->
    <div v-else-if="type === 'spinner'" class="flex justify-center items-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="type === 'error'" class="flex flex-col items-center justify-center p-8 text-center">
      <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ errorMessage || 'Failed to load content' }}</p>
      <button
        v-if="showRetry"
        @click="$emit('retry')"
        class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['blog-card', 'featured-post', 'image', 'spinner', 'error'].includes(value)
  },
  errorMessage: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: true
  }
});

defineEmits(['retry']);
</script>
