<template>
  <div class="flex justify-between items-center mt-8">
    <router-link v-if=" previousPost " :to="`/blog/${previousPost.slug}`"
      class="border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-gray-600">
      &larr; Prev
    </router-link>
    <div v-else class="py-2 px-4"></div>
    <router-link v-if=" nextPost " :to="`/blog/${nextPost.slug}`"
      class="border border-gray-300 dark:border-none rounded-full bg-broken-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:hover:bg-gray-600">
      Next &rarr;
    </router-link>
  </div>
</template>

<script setup lang="ts">
interface BlogPost
{
  slug: string;
  // Add other required properties based on usage
}

defineProps<{
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
}>();
</script>
