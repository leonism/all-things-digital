<!-- src/components/ContentLatestBlog.vue -->
<script setup>
// No additional logic needed for now, but this is where you could add interactivity later.
</script>

<template>
  <section class="mt-10 mb-10">
    <!-- Centered text on mobile, left-aligned on wider screens -->
    <h2
      class="text-center sm:text-left text-4xl/12 subpixel-antialiased font-extrabold tracking-tight text-transparent drop-shadow-xl font-navigation bg-linear-to-br from-indigo-400 to-pink-600 bg-clip-text">
      Latest Blog
    </h2>
    <p
      class="text-left tracking-wide font-navigation text-slate-700 dark:text-white">
      "Catch the latest from the blog — a space where I regularly document my
      hands-on experiments and insights into emerging web technologies. I dive
      into what's new, break things along the way, and share the lessons learned
      so you can skip the pitfalls and focus on building better."
    </p>
  </section>
</template>

<style scoped>
/* Scoped styles for this component */
</style>
