<template>
  <div class="flex justify-between items-center mt-8">
    <router-link
      v-if="previousPost"
      :to="`/blog/${previousPost.slug}`"
      class="bg-gray-100 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:drop-shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-xl"
    >
      &larr; Prev
    </router-link>
    <router-link
      v-if="nextPost"
      :to="`/blog/${nextPost.slug}`"
      class="bg-gray-100 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:drop-shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-xl"
    >
      Next &rarr;
    </router-link>
  </div>
</template>

<script setup lang="ts">
interface BlogPost {
  slug: string;
  // Add other required properties based on usage
}

defineProps<{
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}>();
</script>
