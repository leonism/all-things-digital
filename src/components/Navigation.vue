<!-- src/components/NavigationBar.vue -->
<script setup>
// Import sub-components if you convert nav-desktop/mobile too
// import NavDesktop from './NavDesktop.vue';
// import NavMobile from './NavMobile.vue';
// import HamburgerMenu from './HamburgerMenu.vue'; // If needed for mobile nav toggle

// You might need state for mobile menu visibility
import { ref } from "vue";
const isMobileMenuOpen = ref(false);

// Placeholder for logo path - adjust as needed after moving assets
const logoPath = "/img/icons/icon-dgpondcom.png"; // Assuming img is moved to public/img
</script>

<template>
  <header
    id="wrapperNavBar"
    class="sticky top-0 z-10 bg-white/100 px-4 py-[25px] md:px-[25px] drop-shadow-xl backdrop-blur-lg dark:bg-main dark:drop-shadow-2xl dark:border-b dark:border-slate-900/20">
    <div
      id="NavBar"
      class="flex justify-between max-w-4xl mx-auto my-auto blurGrad">
      <div
        id="logo"
        class="z-40 drop-shadow-sm overflow-x-hidden">
        <a href="/">
          <!-- Or use <router-link> if using Vue Router -->
          <img
            :src="logoPath"
            alt="Logo"
            id="DGPond"
            class="w-auto h-auto max-w-full" />
        </a>
      </div>

      <!-- Replace EJS includes with Vue components -->
      <!-- Desktop Nav Placeholder -->
      <nav class="hidden md:flex space-x-4">
        {/* Replace with NavDesktop component */}
        <a href="/">Home</a>
        <a href="/about.html">About</a> {/* These will become router links */}
      </nav>

      <!-- Mobile Nav Placeholder -->
      <div class="md:hidden">
        {/* Replace with NavMobile component & Hamburger */}
        <button @click="isMobileMenuOpen = !isMobileMenuOpen">Menu</button>
        {/* Add mobile menu structure here, conditionally rendered based on
        isMobileMenuOpen */}
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>
