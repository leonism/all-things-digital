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
      <NavSearchButton @open-search="$emit("open-search")" />
      <NavContactButton />
      <NavMobile />
    </section>
  </header>
</template>

<script setup>
import NavLogo from "./navigation/NavLogo.vue";
import NavDesktop from "./navigation/NavDesktop.vue";
import NavDarkMode from "./navigation/NavDarkMode.vue";
import NavSearchButton from "./navigation/NavSearchButton.vue";
import NavContactButton from "./navigation/NavContactButton.vue";
import NavMobile from "./navigation/NavMobile.vue";

// Define the emits for the component
defineEmits(["open-search"]);

</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

