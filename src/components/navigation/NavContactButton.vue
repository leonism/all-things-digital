<template>
  <!-- start the contact button -->
  <section id="contactButton">
    <router-link to="/contact">
      <button
        aria-label="Contact Button"
        type="button"
        class="hidden md:align-center mx-0 px-5 py-[12px] py-auto text-white font-medium text-xs leading-tight uppercase rounded-lg transition duration-200 ease-in-out bg-linear-to-br from-indigo-400 to-pink-500 md:flex hover:text-whiteHover hover:shadow-lg hover:bg-opacity-40 hover:outline-1 dark:hover:shadow-cyan-500/60 hover:transition-colors hover:duration-200 focus:text-white focus:shadow-lg focus:outline-hidden focus:ring-1 active:text-white active:shadow-lg"
      >
        <div class="flex items-center">
          Contact Me
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5 ml-2"
          >
            <path
              fill-rule="evenodd"
              d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </button>
    </router-link>
  </section>
</template>

<script setup>
// No specific script logic needed for this simple component yet
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

