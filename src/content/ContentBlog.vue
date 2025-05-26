<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <ContentBlogHeader />
    <ContentBlogGrid />
  </main>
</template>

<script setup>
import ContentBlogHeader from '../components/header/ContentBlogHeader.vue';
import ContentBlogGrid from './ContentBlogGrid.vue';
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
