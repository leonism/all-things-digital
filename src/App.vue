<!-- src/App.vue -->
<script setup>
import BaseLayout from "./layouts/BaseLayout.vue"; // Use relative path
// Remove the direct import of HomeContent
// import HomeContent from "/content/HomeContent.vue";
import { RouterView } from "vue-router"; // Import RouterView
</script>

<template>
  <BaseLayout>
    <template #title>DGPond.COM</template>
    <!-- Use router-view to display the component for the current route -->
    <router-view />
  </BaseLayout>
</template>
