<template>
  <!doctype html>
  <html lang="en">
    <body class="bg-gray-100 dark:bg-main">
      <Navigation />
      <slot />
      <Footer />
    </body>
  </html>
</template>

<script setup>
import Navigation from '../components/navigation/Navigation.vue';
import Footer from '../components/footer/Footer.vue';
</script>

<style>
/* Any global styles or imports if necessary */
</style>
