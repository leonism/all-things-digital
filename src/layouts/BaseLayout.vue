<script setup>
import Navigation from '../components/navigation/Navigation.vue';
import Footer from '../components/footer/Footer.vue';

defineEmits(['open-search']);
</script>

<template>
  <Navigation @open-search="$emit('open-search')" />
  <slot />
  <Footer />
</template>

<style>
/* Any global styles or imports if necessary */
</style>
