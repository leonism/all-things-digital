<template>
<<<<<<< HEAD
  <Contact />
=======
  <BaseLayout>
    <ContentContact />
  </BaseLayout>
>>>>>>> parent of 1627ba9 (feat(blog): refactor blog components and views into modular structure)
</template>

<script setup>
import { useHead } from '@unhead/vue';
<<<<<<< HEAD
import Contact from '../components/content/ContentContact.vue';
=======
import BaseLayout from '../layouts/BaseLayout.vue';
import ContentContact from '../content/ContentContact.vue';
>>>>>>> parent of 1627ba9 (feat(blog): refactor blog components and views into modular structure)

useHead({
  title: 'Contact | DGPond.COM',
});
</script>

<style scoped>
/* Scoped styles for this view if any */
</style>
