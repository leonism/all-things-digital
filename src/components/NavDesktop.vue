<template>
  <nav class="z-50 flex flex-row items-center self-center justify-between">
    <ul class="hidden text-base font-semibold leading-tight md:flex md:justify-between font-navigation text-pink-heading dark:text-white">
      <li v-for="(item, index) in navItems" :key="index">
        <router-link :to="item.to"
          class="block px-3 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-slate-100 hover:text-slate-900">
          {{ item.label }}
        </router-link>
      </li>
    </ul>
    <div class="flex items-center z-60">
      <!-- Dark Mode Button -->
      <button aria-label="Toggle Dark Mode" @click="toggleDarkMode"
        class="transition transform hover:-rotate-12 flex items-center text-pink-heading justify-center w-10 h-10 bg-white rounded-full shadow-sm dark:bg-white">
        <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-6 h-6 cursor-pointer moon text-pink-heading/80 dark:text-pink-heading">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="w-6 h-6 font-bold cursor-pointer sun text-pink-heading dark:text-pink-heading">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      </button>
      <!-- Contact Button -->
      <router-link to="/contact" class="hidden md:flex ml-3 px-5 pt-2.5 pb-2 text-white font-medium text-xs leading-normal uppercase rounded-lg transition duration-200 ease-in-out bg-linear-to-br from-indigo-400 to-pink-500 hover:text-whiteHover hover:shadow-lg hover:bg-opacity-40 hover:outline-1 dark:hover:shadow-cyan-500/60 hover:transition-colors hover:duration-200 focus:text-white focus:shadow-lg focus:outline-hidden focus:ring-1 active:text-white active:shadow-lg">
        Contact Me
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd"
            d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
            clip-rule="evenodd" />
        </svg>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavDesktop',
  data() {
    return {
      isDarkMode: false,
      navItems: [
        { label: 'Home', to: '/' },
        { label: 'Blog', to: '/blog' },
        { label: 'Category', to: '/category' },
        { label: 'About', to: '/about' },
      ],
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      // Add logic to toggle dark mode globally (e.g., via Vuex or localStorage)
    },
  },
};
</script>
