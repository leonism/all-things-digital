<template>
  <!-- start the mobile hamburger icon -->
  <aside
    id="mobileNavigation"
    class="flex justify-center w-10 h-10 ml-0 bg-white rounded-full shadow-lg md:hidden dark:bg-white drop-shadow-2xl dark:drop-shadow-2xl"
  >
    <!-- Add open class dynamically -->
    <button
      id="menu-btn"
      aria-label="Toggle navigation menu"
      aria-controls="mobile-menu"
      :aria-expanded="isMobileMenuOpen.toString()"
      type="button"
      class="mt-3 hamburger"
      :class="{ open: isMobileMenuOpen }"
      @click="toggleMobileMenu"
    >
      <span class="hamburger-top"></span>
      <span class="hamburger-middle"></span>
      <span class="hamburger-bottom"></span>
    </button>
  </aside>

  <!-- Overlay -->
  <div
    v-if="isMobileMenuOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    @click="closeMobileMenu"
  ></div>

  <!-- mobile navigation -->
  <nav
    id="mobile-menu"
    class="fixed top-0 right-0 h-full w-80 bg-white dark:bg-main shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden"
    :class="{
      'translate-x-full': !isMobileMenuOpen,
      'translate-x-0': isMobileMenuOpen
    }"
  >
    <!-- Header with close button -->
    <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Menu</h2>
      <button
        @click="closeMobileMenu"
        class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Close menu"
      >
        <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Navigation Links -->
    <div class="flex flex-col py-6">
      <router-link
        to="/"
        class="flex items-center px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-heading/10 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
        :class="{ 'bg-pink-heading/20 text-pink-heading border-r-2 border-pink-heading': $route.path === '/' }"
        @click="closeMobileMenu"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        Home
      </router-link>
      
      <router-link
        to="/blog"
        class="flex items-center px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-heading/10 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
        :class="{ 'bg-pink-heading/20 text-pink-heading border-r-2 border-pink-heading': $route.path === '/blog' }"
        @click="closeMobileMenu"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
        Blog
      </router-link>
      
      <router-link
        to="/category"
        class="flex items-center px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-heading/10 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
        :class="{ 'bg-pink-heading/20 text-pink-heading border-r-2 border-pink-heading': $route.path === '/category' }"
        @click="closeMobileMenu"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"></path>
        </svg>
        Category
      </router-link>
      
      <router-link
        to="/about"
        class="flex items-center px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-heading/10 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
        :class="{ 'bg-pink-heading/20 text-pink-heading border-r-2 border-pink-heading': $route.path === '/about' }"
        @click="closeMobileMenu"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        About
      </router-link>
      
      <router-link
        to="/contact"
        class="flex items-center px-6 py-3 text-slate-700 dark:text-slate-300 hover:bg-pink-heading/10 hover:text-pink-heading dark:hover:text-pink-heading transition-colors duration-200"
        :class="{ 'bg-pink-heading/20 text-pink-heading border-r-2 border-pink-heading': $route.path === '/contact' }"
        @click="closeMobileMenu"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        Contact
      </router-link>
    </div>

    <!-- Dark Mode Toggle -->
    <div class="absolute bottom-6 left-6 right-6">
      <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
        <NavDarkMode />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import NavDarkMode from './NavDarkMode.vue';

const isMobileMenuOpen = ref(false);
const route = useRoute();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Prevent body scroll when menu is open
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

// Close menu on route change
const handleRouteChange = () => {
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  // Watch for route changes
  route && route.path && handleRouteChange();
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  // Ensure body scroll is restored
  document.body.style.overflow = '';
});
</script>

<style scoped>
/* Add component-specific styles if necessary */
/* Styles for the hamburger button animation (assuming they exist globally or are imported) */
.hamburger {
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: all 0.25s;
  position: relative;
}

.hamburger-top,
.hamburger-middle,
.hamburger-bottom {
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 2px;
  background: hsl(279, 48%, 54%); /* Adjust color as needed */
  transform: rotate(0);
  transition: all 0.5s;
}

.hamburger-middle {
  transform: translateY(7px);
}

.hamburger-bottom {
  transform: translateY(14px);
}

.open {
  transform: rotate(90deg);
  transform: translateY(-1px);
}

.open .hamburger-top {
  transform: rotate(45deg) translateY(6px) translateX(6px);
}

.open .hamburger-middle {
  display: none;
}

.open .hamburger-bottom {
  transform: rotate(-45deg) translateY(6px) translateX(-6px);
}

/* Ensure dark mode styles for hamburger lines if needed */
.dark .hamburger-top,
.dark .hamburger-middle,
.dark .hamburger-bottom {
  background: hsl(279, 48%, 54%); /* Use text-pink-heading color in dark mode */
}
</style>
