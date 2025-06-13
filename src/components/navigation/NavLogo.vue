<template>
  <div id="logo" class="z-40 drop-shadow-sm overflow-x-hidden">
    <router-link to="/">
      <picture>
        <source :srcset="avifSrc" type="image/avif" />
        <source :srcset="webpSrc" type="image/webp" />
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

// Import all three formats explicitly
import pngLogo from '../../assets/img/icons/icon-dgpondcom.png';
import webpLogo from '../../assets/img/icons/icon-dgpondcom.webp';
import avifLogo from '../../assets/img/icons/icon-dgpondcom.avif';

// Use the imported assets directly
const pngSrc = computed(() => pngLogo);
const webpSrc = computed(() => webpLogo);
const avifSrc = computed(() => avifLogo);
</script>
