<script>
import NavDesktop from "@/components/NavDesktop.vue";
import NavMobile from "@/components/NavMobile.vue";
</script>

<template>
  <header
    class="sticky top-0 z-10 bg-white/100 px-4 py-[25px] md:px-[25px] drop-shadow-xl backdrop-blur-lg dark:bg-main dark:drop-shadow-2xl dark:border-b dark:border-slate-900/20">
    <div
      class="flex justify-between items-center max-w-4xl mx-auto my-auto blurGrad">
      <!-- Logo -->
      <div class="z-40 drop-shadow-sm overflow-x-hidden">
        <router-link to="/">
          <img
            src="@/assets/img/icons/icon-dgpondcom.png"
            alt="Logo"
            class="w-auto h-10" />
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <NavDesktop />

      <!-- Mobile Navigation -->
      <NavMobile />
    </div>
  </header>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
