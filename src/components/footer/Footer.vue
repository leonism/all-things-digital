<template>
  <footer class="flex flex-col items-center max-w-4xl mx-auto my-10 border-t dark:border-slate-800/60 pt-8">
    <FooterLogo />
    <Suspense>
      <template #default>
        <LazyFooterSocialButton />
      </template>
      <template #fallback>
        <div class="h-16 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded"></div>
      </template>
    </Suspense>
    <FooterNavLinks />
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-8">
      © {{ new Date().getFullYear() }} DGPond.COM. All rights reserved.
    </p>
  </footer>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
const LazyFooterSocialButton = defineAsyncComponent(() =>
  import('./FooterSocialButton.vue')
);
import FooterLogo from './FooterLogo.vue';
import FooterSocialButton from './FooterSocialButton.vue';
import FooterNavLinks from './FooterNavLinks.vue';
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
