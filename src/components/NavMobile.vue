<template>
  <div>
    <!-- Mobile Hamburger Icon -->
    <div
      class="flex justify-center w-10 h-10 ml-1 bg-white rounded-full shadow-lg md:hidden dark:bg-white">
      <button
        @click="toggleMenu"
        class="mt-3 hamburger">
        <span class="hamburger-top"></span>
        <span class="hamburger-middle"></span>
        <span class="hamburger-bottom"></span>
      </button>
    </div>
    <!-- Mobile Menu -->
    <nav
      v-if="isMenuOpen"
      class="absolute flex-col items-center self-end py-5 mt-10 font-bold bg-white shadow-inner md:hidden dark:shadow-inner rounded-xl sm:w-auto sm:self-center top-20 left-5 right-5 drop-shadow-2xl">
      <router-link
        v-for="(item, index) in navItems"
        :key="index"
        :to="item.to"
        class="block px-5 py-2 transition-colors duration-200 rounded-xl dark:hover:text-slate-900 hover:bg-pink-heading/70 hover:text-slate-900">
        {{ item.label }}
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavMobile",
  data() {
    return {
      isMenuOpen: false,
      navItems: [
        { label: "Home", to: "/" },
        { label: "Blog", to: "/blog" },
        { label: "Category", to: "/category" },
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>
