<template>
  <header
    id="wrapperNavBar"
    class="sticky top-0 z-10 bg-white/85 px-4 py-[25px] md:px-[25px] backdrop-blur-4xl border-b border-slate-900/10 drop-shadow-3xl dark:bg-main/80 dark:backdrop-blur-4xl dark:drop-shadow-3xl dark:border-b dark:border-slate-900/20"
  >
    <section
      id="NavBar"
      class="flex flex-row items-center justify-between max-w-4xl mx-auto my-auto blurGrad"
    >
      <NavLogo />
      <NavDesktop />
      <NavDarkMode />
      <!-- Pass the emit up from NavSearchButton -->
      <NavSearchButton @open-search="$emit('open-search')" />
      <NavContactButton />
      <NavMobile />
    </section>
  </header>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import NavLogo from './NavLogo.vue';
import NavDesktop from './NavDesktop.vue';
import NavDarkMode from './NavDarkMode.vue';
import NavSearchButton from './NavSearchButton.vue';
import NavContactButton from './NavContactButton.vue';
// Lazy load mobile navigation (only needed on mobile)
const NavMobile = defineAsyncComponent(() => import('./NavMobile.vue'));

defineEmits(['open-search']);
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
