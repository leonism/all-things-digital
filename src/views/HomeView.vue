<template>
  <main id="mainWrapper" class="max-w-4xl mx-5 sm:mx-5 md:mx-10 lg:mx-auto">
    <ContentHomeHeader />
    <FeaturedPostSection />
    <LatestPostsSection />
    <HomeBlogGrid />
  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import ContentHomeHeader from '../components/header/ContentHomeHeader.vue';
import HomeBlogGrid from '../content/HomeBlogGrid.vue';
import FeaturedPostSection from '../components/blog/FeaturedPostSection.vue';
import LatestPostsSection from '../components/blog/LatestPostsSection.vue';

useHead({
  title: 'DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
