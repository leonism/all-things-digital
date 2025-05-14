<!-- src/layouts/BaseLayout.vue -->
<script setup>
import Meta from "../components/Meta.vue";
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <!-- The <Meta> component won't render visibly here. Head management needs a different approach (e.g., Teleport or @vueuse/head) -->
  <Meta>
    <slot name="title"></slot>
  </Meta>
  <div class="bg-white-pale dark:bg-main min-h-screen flex flex-col">
    <!-- Use the correct component name -->
    <Navigation />
    <div
      id="mainWrapper"
      class="mx-5 flex-grow">
      <!-- Main content passed from App.vue -->
      <slot></slot>
    </div>
    <Footer />
  </div>
</template>

<style></style>
