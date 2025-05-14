<script>
import NavLogo from "./NavLogo.vue";
import NavDesktop from "./NavDesktop.vue";
import NavMobile from "./NavMobile.vue";
import NavContactButton from "./NavContactButton.vue";
</script>

<template>
  <header
    class="sticky top-0 z-10 bg-white/100 px-4 py-[25px] md:px-[25px] drop-shadow-xl backdrop-blur-lg dark:bg-main dark:drop-shadow-2xl dark:border-b dark:border-slate-900/20">
    <div
      class="flex justify-between items-center max-w-4xl mx-auto my-auto blurGrad">
      <NavLogo />
      <NavDesktop />
      <NavMobile />
      <NavContactButton />
    </div>
  </header>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
