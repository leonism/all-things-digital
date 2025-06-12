<template>
  <ContentAbout />
</template>

<script setup>
import { useHead } from '@unhead/vue';
import ContentAbout from '../content/ContentAbout.vue';
import AboutHeader from '../components/heading/HeaderAbout.vue';

useHead({
  title: 'About | DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
