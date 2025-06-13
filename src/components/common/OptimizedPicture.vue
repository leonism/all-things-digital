<template>
  <picture>
    <!-- AVIF format for modern browsers -->
    <source
      v-if="avifSrc"
      :srcset="avifSrcSet || avifSrc"
      :sizes="sizes"
      type="image/avif"
    />
    <!-- WebP format for most modern browsers -->
    <source
      v-if="webpSrc"
      :srcset="webpSrcSet || webpSrc"
      :sizes="sizes"
      type="image/webp"
    />
    <!-- Fallback to original format -->
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
import { useCloudinary } from '@/composables/useCloudinary';

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
  // Responsive breakpoints for srcset
  breakpoints: {
    type: Array,
    default: () => [400, 800, 1200],
  },
  // Cloudinary transformation options
  transformOptions: {
    type: Object,
    default: () => ({}),
  },
});

// Use Cloudinary composable for optimization
const cloudinary = useCloudinary(computed(() => props.src));

// Generate AVIF sources
const avifSrc = computed(() => {
  if (!cloudinary.isPublicId.value) return null;
  return cloudinary.withTransformations.value({
    f_avif: true,
    q_auto: true,
    ...props.transformOptions,
  });
});

const avifSrcSet = computed(() => {
  if (!cloudinary.isPublicId.value) return null;
  return props.breakpoints
    .map((width) => {
      const url = cloudinary.withTransformations.value({
        f_avif: true,
        q_auto: true,
        w: width,
        ...props.transformOptions,
      });
      return `${url} ${width}w`;
    })
    .join(', ');
});

// Generate WebP sources
const webpSrc = computed(() => {
  if (!cloudinary.isPublicId.value) return null;
  return cloudinary.withTransformations.value({
    f_webp: true,
    q_auto: true,
    ...props.transformOptions,
  });
});

const webpSrcSet = computed(() => {
  if (!cloudinary.isPublicId.value) return null;
  return props.breakpoints
    .map((width) => {
      const url = cloudinary.withTransformations.value({
        f_webp: true,
        q_auto: true,
        w: width,
        ...props.transformOptions,
      });
      return `${url} ${width}w`;
    })
    .join(', ');
});

// Fallback source (original format or optimized)
const fallbackSrc = computed(() => {
  if (cloudinary.isPublicId.value) {
    return cloudinary.withTransformations.value({
      f_auto: true,
      q_auto: true,
      ...props.transformOptions,
    });
  }
  return props.src;
});

const fallbackSrcSet = computed(() => {
  if (!cloudinary.isPublicId.value) return null;
  return props.breakpoints
    .map((width) => {
      const url = cloudinary.withTransformations.value({
        f_auto: true,
        q_auto: true,
        w: width,
        ...props.transformOptions,
      });
      return `${url} ${width}w`;
    })
    .join(', ');
});
</script>
