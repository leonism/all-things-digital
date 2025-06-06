<template>
  <div class="flex justify-between items-center mt-8">
    <router-link
      v-if="previousPost"
      :to="`/blog/${previousPost.slug}`"
      class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md"
    >
      &larr; Previous
    </router-link>
    <div v-else class="py-2 px-4"></div>
    <router-link
      v-if="nextPost"
      :to="`/blog/${nextPost.slug}`"
      class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md"
    >
      Next &rarr;
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { type BlogPost } from '../../types'; // Assuming you have a type definition for BlogPost

defineProps<{
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}>();
</script>
