<template>
  <div id="logo" class="z-40 drop-shadow-sm overflow-x-hidden">
    <router-link to="/">
      <picture>
        <source
          :srcset="avifSrc"
          type="image/avif"
        />
        <source
          :srcset="webpSrc"
          type="image/webp"
        />
        <img
          :src="pngSrc"
          alt="Logo"
          id="DGPond"
          itemprop="logo"
          width="100"
          height="100"
          class="w-auto h-auto mt-1"
        />
      </picture>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Import the base PNG image
import pngLogo from '../../assets/img/icons/icon-dgpondcom.png';

// Create computed properties for different formats
const pngSrc = computed(() => pngLogo);

// For WebP and AVIF, we'll use the same base name but with different extensions
const webpSrc = computed(() => {
  return pngLogo.replace('.png', '.webp');
});

const avifSrc = computed(() => {
  return pngLogo.replace('.png', '.avif');
});
</script>
