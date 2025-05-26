<template>
  <footer
    class="flex flex-col items-center max-w-4xl mx-auto my-10 md:my-10 border-t dark:border-slate-800/60 pt-8"
  >
    <FooterLogo />
    <FooterSocialButton />
    <FooterNavLinks />
    <!-- Copyright or other info can be added here -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-8">
      © {{ new Date().getFullYear() }} DGPond.COM. All rights reserved.
    </p>
  </footer>
</template>

<script setup>
// Import subcomponents that will be created next
import FooterLogo from "./footer/FooterLogo.vue";
import FooterSocialButton from "./footer/FooterSocialButton.vue";
import FooterNavLinks from "./footer/FooterNavLinks.vue";

// Note: The script tag <script type="module" src="./assets/js/script.js"></script>
// originally included after the footer needs to be handled.
// Global scripts should ideally be imported in main.js or App.vue.
// Component-specific logic from script.js should be refactored into relevant Vue components.
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>

