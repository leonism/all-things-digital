<template>
  <header id="mainHeading" class="text-center">
    <h1 id="mainHeading" class="gradient-headers">Category Blog Topics!</h1>
    <h2
      id="subHeading"
      class="text-shadow-2xs mt-1 mb-2 text-xl subpixel-antialiased font-bold leading-tight text-center md:font-extrabold md:text-3xl text-slate-600/90 dark:text-white"
    >
      All Things, Sort By: {{ categoryName }}
    </h2>
  </header>
</template>

<script setup>
const props = defineProps({
  categoryName: {
    type: String,
    default: 'Category',
  },
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
