<template>
  <ContentContact />
</template>

<script setup>
import { useHead } from '@unhead/vue';
import BaseLayout from '../layouts/BaseLayout.vue';
import ContentContact from '../content/ContentContact.vue';

useHead({
  title: 'Contact | DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
