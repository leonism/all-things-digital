<template>
  <BaseLayout>
    <ContentCredits />
  </BaseLayout>
</template>

<script setup>
import { useHead } from '@unhead/vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import ContentCredits from '../content/ContentCredits.vue';

useHead({
  title: 'Credits | DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
