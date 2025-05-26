<template>
  <div
    id="footerLogo"
    class="flex max-w-xs pt-5 mb-5 mx-auto -mt-9 overflow-hidden drop-shadow-xs grayscale opacity-80"
  >
    <a href="#" @click.prevent="scrollToTop">
      <img
        src="/assets/img/icons/logo-footer.png"
        width="35"
        height="35"
        alt="bottom-logo"
        class=""
      />
    </a>
  </div>
</template>

<script setup>
const scrollToTop = () => {
  // Smooth scroll to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Add component-specific styles if necessary */
</style>
