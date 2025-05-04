<!-- src/components/Header.vue -->
<script setup>
// Props allow customization of the heading and subheading text
defineProps({
  mainHeading: {
    type: String,
    default: "All Things Digital",
  },
  subHeading: {
    type: String,
    default:
      "Data Driven Marketing, Machine Learning, Growth Hacking and Everything Sit in Between.",
  },
});
</script>

<template>
  <header class="text-center">
    <!-- Main Heading -->
    <h1
      id="mainHeading"
      class="mt-5 text-5xl leading-[1.25] subpixel-antialiased font-extrabold font-navigation tracking-tight text-transparent bg-clip-text md:text-6xl drop-shadow-lg bg-linear-to-br from-indigo-400 to-pink-600">
      {{ mainHeading }}
    </h1>

    <!-- Sub Heading -->
    <h2
      id="subHeading"
      class="text-shadow-2xs mt-3 mb-3 text-xl subpixel-antialiased font-bold leading-tight text-center md:font-extrabold md:text-3xl text-slate-600/90 dark:text-white">
      {{ subHeading }}
    </h2>
  </header>
</template>

<style scoped>
/* Scoped styles ensure these styles are encapsulated within this component */
</style>
