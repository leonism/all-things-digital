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

  <!-- mobile navigation -->
  <nav
    id="mobile-menu" <!-- Changed ID to match aria-controls -->
    class="absolute flex-col items-center self-end py-5 mt-10 font-bold bg-white shadow-inner md:hidden dark:shadow-inner rounded-xl sm:w-auto sm:self-center top-20 left-5 right-5 drop-shadow-2xl"
    :class="{ hidden: !isMobileMenuOpen }" <!-- Toggle visibility -->
  >
    <router-link
      to="/"
      class="block px-5 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-pink-heading/70 hover:text-slate-900"
      @click="closeMobileMenu" <!-- Close menu on link click -->
      >Home</router-link
    >
    <router-link
      to="/blog"
      class="block px-5 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-pink-heading/70 hover:text-slate-900"
      @click="closeMobileMenu"
      >Blog</router-link
    >
    <router-link
      to="/categories"
      class="block px-5 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-pink-heading/70 hover:text-slate-900"
      @click="closeMobileMenu"
      >Category</router-link
    >
    <router-link
      to="/about"
      class="block px-5 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-pink-heading/70 hover:text-slate-900"
      @click="closeMobileMenu"
      >About</router-link
    >
    <router-link
      to="/contact"
      class="block px-5 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-pink-heading/70 hover:text-slate-900"
      @click="closeMobileMenu"
      >Contact</router-link
    >
  </nav>
</template>

<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Note: The hamburger animation CSS needs to be present globally
// or imported/scoped here for the open class to work.
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
  background: #000; /* Adjust color as needed */
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
  background: #000; /* Adjust dark mode color if needed */
}
</style>
