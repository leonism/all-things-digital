<script setup>
// Import the main layout
import BaseLayout from "./layouts/BaseLayout.vue";
// Meta management should ideally happen within BaseLayout or using a dedicated library
</script>

<template>
  <BaseLayout>
    <!-- The router-view will render the content for the current route inside the <slot> of BaseLayout.vue -->
    <router-view />
  </BaseLayout>
</template>

<style>
/* Keep global styles if any, or ensure they are in main.css */
/* Styles from BaseLayout.vue will also apply */
</style>
