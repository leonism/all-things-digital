<template>
  <footer
    class="flex flex-col items-center max-w-4xl mx-auto my-10 md:my-10 border-t dark:border-slate-800/60 pt-8"
  >
    <FooterLogo />
    <FooterSocialButton />
    <FooterNavLinks />
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-8">
      © {{ new Date().getFullYear() }} DGPond.COM. All rights reserved.
    </p>
  </footer>
</template>

<script setup>
import FooterLogo from '@/components/footer/FooterLogo.vue';
import FooterSocialButton from '@/components/footer/FooterSocialButton.vue';
import FooterNavLinks from '@/components/footer/FooterNavLinks.vue';
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
