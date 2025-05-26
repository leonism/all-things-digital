<template>
  <nav class="mt-1 mb-2 px-4">
    <ul
      class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-navigation text-slate-400 sm:justify-between sm:gap-2 md:mx-auto md:max-w-[--breakpoint-md]"
    >
      <li>
        <router-link
          class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          title="Home"
          to="/"
        >
          Home
        </router-link>
      </li>
      <li>
        <router-link
          class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          title="About"
          to="/about"
        >
          About
        </router-link>
      </li>
      <li>
        <router-link
          class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          title="Blog"
          to="/blog"
        >
          Blog
        </router-link>
      </li>
      <li>
        <router-link
          class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          to="/credits" <!-- Assuming a /credits route -->
        >
          Credits
        </router-link>
      </li>
      <li>
        <!-- Placeholder link - update route when page exists -->
        <router-link
          class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          title="Cookies"
          to="/cookies" <!-- Placeholder route -->
        >
          Cookies
        </router-link>
      </li>
      <li>
        <!-- Placeholder link - update route when page exists -->
        <router-link
          class="text-gray-400 transition-colors duration-200 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          title="Privacy Policy"
          to="/privacy" <!-- Placeholder route -->
        >
          Privacy Policy
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
// No specific script logic needed for this simple component yet
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

