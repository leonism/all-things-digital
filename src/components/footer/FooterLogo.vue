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
      <picture>
        <source :srcset="avifSrc" type="image/avif" />
        <source :srcset="webpSrc" type="image/webp" />
        <img
          :src="pngSrc"
          width="35"
          height="35"
          alt="Company logo"
          class="animate-bounce-infinite border border-gray-300 dark:border-none rounded-full"
        />
      </picture>
    </a>
  </figure>
</template>

<script setup>
import { computed } from 'vue';

// Import all three formats explicitly
import pngLogo from '../../assets/img/icons/logo-footer.png';
import webpLogo from '../../assets/img/icons/logo-footer.webp';
import avifLogo from '../../assets/img/icons/logo-footer.avif';

// Use the imported assets directly
const pngSrc = computed(() => pngLogo);
const webpSrc = computed(() => webpLogo);
const avifSrc = computed(() => avifLogo);

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
