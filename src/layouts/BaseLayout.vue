<!-- src/layouts/BaseLayout.vue -->
<script setup>
// Import the new Vue components
import Meta from "/components/Meta.vue"; // Keep using Meta.vue
import NavigationBar from "/components/NavigationBar.vue"; // Use the new Vue component
import Footer from "/components/Footer.vue"; // Keep using Footer.vue
</script>

<template>
  <!-- The <Meta> component handles the <head> content -->
  <Meta>
    <slot name="title"></slot> <!-- Keep dynamic title slot -->
  </Meta>
  <!-- The body tag is handled by index.html, structure the visible content here -->
  <div class="bg-white-pale dark:bg-main min-h-screen flex flex-col">
    <NavigationBar /> {/* Use the Vue navigation component */}
    <div id="mainWrapper" class="mx-5 flex-grow">
      <slot></slot> {/* Main content passed from App.vue */}
    </div>
    <Footer /> {/* Use the Vue footer component */}
  </div>
</template>

<style>
/* Global styles might be needed, or keep them in main.css */
/* Ensure html, body take full height if needed */
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
body > div { /* Target the root div rendered by BaseLayout */
   min-height: 100vh;
}
</style>
