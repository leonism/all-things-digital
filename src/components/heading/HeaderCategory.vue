<template>
  <header class="text-center">
    <h1
      id="mainHeading"
      class="mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] subpixel-antialiased font-extrabold font-navigation tracking-tight text-transparent bg-clip-text drop-shadow-lg bg-linear-to-br from-indigo-400 to-pink-600"
    >
      Category Blog Topics!
    </h1>
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
