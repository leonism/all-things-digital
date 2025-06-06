<template>
  <!-- start the desktop nav // items-center justify-center -->
  <nav
    id="desktopNav"
    class="z-50 flex flex-row items-center self-center justify-center flex-grow"
  >
    <ul
      class="hidden text-base font-semibold font-navigation text-pink-heading leading-tight md:flex md:justify-between dark:text-white"
    >
      <li>
        <router-link
          to="/"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
          >Home</router-link
        >
      </li>
      <li>
        <router-link
          to="/blog"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
          >Blog</router-link
        >
      </li>
      <li>
        <!-- Assuming category will list all categories, or link to a main category page -->
        <router-link
          to="/category"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
          >Category</router-link
        >
      </li>
      <li>
        <router-link
          to="/about"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900"
          active-class="bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white"
          >About</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script setup>
// No specific script logic needed for this simple component yet
</script>

<style scoped>
/* Add component-specific styles if necessary */
.router-link-exact-active {
  /* You can add specific styles for the exact active link if needed */
  /* Tailwind's active-class prop is often sufficient */
}
</style>
