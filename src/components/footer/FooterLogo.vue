<template>
  <!-- Footer logo with semantic markup and bounce animation -->
  <figure
    id="footerLogo"
    class="flex max-w-xs pt-5 mb-5 mx-auto -mt-18 overflow-hidden drop-shadow-xs grayscale opacity-80"
  >
    <!-- Logo link with click handler for scrolling to top -->
    <a
      href="#"
      @click.prevent="scrollToTop"
      class="hover:opacity-100 transition-opacity duration-300"
      aria-label="Scroll to top of page"
    >
      <img
        src="/assets/img/icons/logo-footer.png"
        width="35"
        height="35"
        alt="Company logo"
        class="animate-bounce-infinite"
      />
    </a>
  </figure>
</template>

<script setup>
// Smooth scroll to top functionality
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Bounce animation with smooth transitions */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-infinite {
  animation: bounce 1.5s ease-in-out infinite;
  transition: all 0.3s ease;
}

/* Hover effects */
#footerLogo:hover {
  opacity: 1;
  filter: grayscale(0) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.animate-bounce-infinite:hover {
  animation-play-state: paused;
}
</style>
