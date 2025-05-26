<template>
  <About />
</template>

<script setup>
import { useHead } from '@unhead/vue';
import About from '@/components/content/ContentAbout.vue';

useHead({
  title: 'About | DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
