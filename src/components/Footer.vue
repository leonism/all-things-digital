<!-- src/components/Footer.vue -->
<script setup>
// No additional logic needed for now.
</script>

<template>
  <footer class="flex flex-col items-center max-w-4xl mx-auto my-10 border-t dark:border-slate-800/60">
    <div class="flex max-w-xs pt-5 mx-auto -mt-9 overflow-hidden drop-shadow-xs grayscale opacity-80">
      <img src="/assets/img/icons/logo-footer.png" width="35" height="35" alt="bottom-logo" />
    </div>
    <div class="mt-5">
      <ul class="flex flex-wrap justify-between max-w-(--breakpoint-md) mx-auto text-sm font-navigation text-slate-400">
        <li class="mx-2">
          <a
            class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            href="/"
          >
            Home
          </a>
        </li>
        <li class="mx-2">
          <a
            class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            href="/about.html"
          >
            About
          </a>
        </li>
        <li class="mx-2">
          <a
            class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            href="blog.html"
          >
            Blog
          </a>
        </li>
        <li class="mx-2">
          <a
            class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            href="credits.html"
          >
            Credits
          </a>
        </li>
      </ul>
    </div>
    <div class="flex items-center justify-between max-w-xs pt-8 mx-auto">
      <a
        href="#"
        class="ml-4 text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:hover:text-white"
      >
        <svg
          width="20"
          height="20"
          fill="currentColor"
          class="text-xl transition-colors duration-200 hover:text-gray-800 dark:hover:text-white"
          viewBox="0 0 1792 1792"
          xmlns="<http://www.w3.org/2000/svg>"
        >
          <!-- SVG Path for Social Media Icon -->
        </svg>
      </a>
    </div>
  </footer>
</template>

<style scoped>
/* Scoped styles for this component */
</style>
