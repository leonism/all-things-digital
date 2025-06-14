<template>
  <picture>
    <!-- AVIF format for modern browsers -->
    <source
      v-if="avifSrcSet"
      :srcset="avifSrcSet"
      :sizes="sizes"
      type="image/avif"
    />
    <!-- WebP format for most modern browsers -->
    <source
      v-if="webpSrcSet"
      :srcset="webpSrcSet"
      :sizes="sizes"
      type="image/webp"
    />
    <!-- Fallback image -->
    <img
      :src="fallbackSrc"
      :srcset="fallbackSrcSet"
      :alt="alt"
      :width="width"
      :height="height"
      :class="imgClass"
      :loading="loading"
      :decoding="decoding"
      v-bind="$attrs"
    />
  </picture>
</template>

<script setup>
import { computed } from 'vue';
import cloudinaryMapping from '@/data/cloudinary-mapping.json';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: null,
  },
  height: {
    type: [String, Number],
    default: null,
  },
  sizes: {
    type: String,
    default: '100vw',
  },
  imgClass: {
    type: String,
    default: '',
  },
  loading: {
    type: String,
    default: 'lazy',
  },
  decoding: {
    type: String,
    default: 'async',
  },
});

// Get image data from cloudinary mapping based on public ID
const imageData = computed(() => {
  if (!props.src) return null;

  console.log('Looking for mapping with src:', props.src);
  console.log('Available mappings:', Object.keys(cloudinaryMapping));

  // Find any mapping entry where originalPublicId matches the src
  const mappingEntry = Object.values(cloudinaryMapping).find((entry) => {
    console.log(
      'Checking entry:',
      entry.originalPublicId,
      'against:',
      props.src,
    );
    return entry.originalPublicId === props.src;
  });

  if (mappingEntry) {
    console.log('Found mapping for:', props.src, mappingEntry);
  } else {
    console.warn('No mapping found for:', props.src);
    console.log(
      'All originalPublicIds:',
      Object.values(cloudinaryMapping).map((e) => e.originalPublicId),
    );
  }

  return mappingEntry || null;
});

// AVIF srcset from mapping
const avifSrcSet = computed(() => {
  const srcset = imageData.value?.srcsets?.avif;
  if (srcset) {
    console.log('AVIF srcset:', srcset);
  }
  return srcset || null;
});

// WebP srcset from mapping
const webpSrcSet = computed(() => {
  const srcset = imageData.value?.srcsets?.webp;
  if (srcset) {
    console.log('WebP srcset:', srcset);
  }
  return srcset || null;
});

// Fallback srcset from mapping
const fallbackSrcSet = computed(() => {
  const srcset = imageData.value?.srcsets?.auto;
  if (srcset) {
    console.log('Fallback srcset:', srcset);
  }
  return srcset || null;
});

// Fallback src (single image)
const fallbackSrc = computed(() => {
  if (imageData.value) {
    console.log('Using secure URL:', imageData.value.secureUrl);
    return imageData.value.secureUrl;
  }
  console.warn('No image data, using original src:', props.src);
  return props.src;
});
</script>
