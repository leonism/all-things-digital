<template>
  <BaseLayout>
    <ContentAbout />
  </BaseLayout>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import ContentAbout from '../content/ContentAbout.vue';

useHead({
  title: 'About | DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
