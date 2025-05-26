<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <BlogHeader />
    <BlogContentGrid />
  </main>
</template>

<script setup>
import BlogHeader from '@/components/header/ContentBlogHeader.vue';
import BlogContentGrid from '@/components/blog/BlogContentGrid.vue';
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
