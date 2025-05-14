<!-- src/layouts/BaseLayout.vue -->
<script setup>
// Import the new Vue components
import Meta from "../components/Meta.vue"; // Relative path
import NavigationBar from "../components/Navigation.vue"; // Relative path & Correct Name
import Footer from "../components/Footer.vue"; // Relative path
</script>

<template>
  <!-- The <Meta> component won't render visibly here. Head management needs a different approach (e.g., Teleport or @vueuse/head) -->
  <Meta>
    <slot name="title"></slot>
  </Meta>

  <div class="bg-white-pale dark:bg-main min-h-screen flex flex-col">
    <!-- Use the correct component name -->
    <Navigation />
    <!-- Corrected from <Navigation /> -->
    <div
      id="mainWrapper"
      class="mx-5 flex-grow">
      <!-- Main content passed from App.vue -->
      <slot></slot>
    </div>
    <Footer />
    <!-- This was already correct -->
  </div>
</template>

<style>
/* Global styles might be needed, or keep them in main.css */
/* Ensure html, body take full height if needed */
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
body > div {
  /* Target the root div rendered by BaseLayout */
  min-height: 100vh;
}
</style>
