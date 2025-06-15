<template>
  <nav class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-12 mb-8 gap-4"
    aria-label="Post navigation">
    <!-- Previous Post Button -->
    <router-link v-if=" previousPost " :to="`/blog/${previousPost.slug}`"
      class="group flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-broken-white dark:bg-postcard border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 flex-1 sm:flex-initial sm:min-w-[280px] sm:max-w-xs"
      :title="`Previous: ${previousPost.title || 'Previous post'}`">
      <div
        class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-300">
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Previous</div>
        <div
          class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 truncate">
          {{ previousPost.title || 'Previous Post' }}
        </div>
      </div>
    </router-link>

    <!-- Spacer when no previous post (hidden on mobile) -->
    <div v-else class="hidden sm:block flex-1 sm:min-w-[280px] sm:max-w-xs"></div>

    <!-- Next Post Button -->
    <router-link v-if=" nextPost " :to="`/blog/${nextPost.slug}`"
      class="group flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-broken-white dark:bg-postcard border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 flex-1 sm:flex-initial sm:min-w-[280px] sm:max-w-xs sm:text-right"
      :title="`Next: ${nextPost.title || 'Next post'}`">
      <div class="flex-1 min-w-0 order-1 sm:order-none">
        <div
          class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide text-left sm:text-right">
          Next</div>
        <div
          class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300 truncate text-left sm:text-right">
          {{ nextPost.title || 'Next Post' }}
        </div>
      </div>
      <div
        class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors duration-300 order-2 sm:order-none">
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </router-link>

    <!-- Spacer when no next post (hidden on mobile) -->
    <div v-else class="hidden sm:block flex-1 sm:min-w-[280px] sm:max-w-xs"></div>
  </nav>
</template>

<script setup lang="ts">
interface BlogPost
{
  slug: string;
  title?: string;
  // Add other required properties based on usage
}

defineProps<{
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}>();
</script>
