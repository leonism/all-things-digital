<!-- src/components/BlogArticle.vue -->
<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <article class="mb-8">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="text-gray-600 mt-2">{{ date }}</p>
    <div
      class="mt-4"
      v-html="content"></div>
  </article>
</template>

<style scoped>
/* Scoped styles for the blog article */
</style>
