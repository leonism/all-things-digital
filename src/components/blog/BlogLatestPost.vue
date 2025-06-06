<template>
  <!--
    Article section for "Latest Blog" showcase
    Maintains all original styling classes and hover effects
  -->
  <article class="mt-10 mb-10 overflow-hidden rounded-2xl shadow-xl border border-transparent bg-broken-white dark:bg-postcard transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl md:flex-row md:my-6">
    <!--
      Semantic heading with preserved gradient text styling
      Note: h2 is appropriate here as it's a section title
    -->
    <header class="text-center mx-5 mt-3 mb-2 sm:text-left">
      <h2 class="text-4xl/12 subpixel-antialiased font-extrabold tracking-tight text-transparent drop-shadow-xl font-navigation bg-clip-text bg-linear-to-br from-indigo-400 to-pink-600">
        Latest Blog
      </h2>
    </header>

    <!--
      Content section with preserved text styling and responsive behavior
      Using <section> here would be redundant, so we keep it as <div>
    -->
    <div class="text-justify wrap-break-word tracking-wide mx-5 mt-2 mb-5 font-navigation text-slate-700 dark:text-white">
      <p>
        Discover the latest updates from the blog — a space where I regularly
        document my hands-on experiments and insights with emerging web
        technologies. I delve into cutting-edge tools, frameworks, and workflows,
        highlighting both breakthroughs and common pitfalls, so you can navigate
        them with confidence and clarity.
      </p>
    </div>
  </article>

  <!--
    Blog posts insertion point
    Maintained original slot comment and functionality
  -->
  <slot name="latest-posts"></slot>
</template>

<script setup>
// Component logic placeholder
// Preserved original comment about no needed logic
</script>

<style scoped>
/*
  Scoped styles container
  Preserved original comment structure
*/
</style>
