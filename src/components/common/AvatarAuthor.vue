<template>
  <section
    class="mr-3 p-0.5 flex shrink-0 basis-auto items-center self-start rounded-full bg-gradient-to-br from-indigo-400 to-pink-600 transition hover:from-indigo-500 hover:to-pink-700 transition-colors duration-300 transform hover:scale-110"
  >
    <router-link :to="link">
      <OptimizedPicture
        :src="processedImageSrc"
        :alt="imageAlt"
        img-class="h-12 w-12 rounded-full max-w-full border-2 border-white dark:border-slate-800"
        :transform-options="{ c: 'thumb', g: 'face', r: 'max' }"
        :breakpoints="[48, 96]"
        sizes="48px"
        itemprop="author"
        itemscope
        itemtype="https://schema.org/Person"
      />
    </router-link>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { useCloudinary } from '@/composables/useCloudinary';
import OptimizedPicture from './OptimizedPicture.vue';

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    default: 'Author profile picture',
  },
  link: {
    type: String,
    default: '/about', // Default link to about page
  },
});

// Use Cloudinary for author avatar optimization
const authorImageCloudinary = useCloudinary(computed(() => props.imageSrc));

const processedImageSrc = computed(() => {
  // Generate optimized avatar with face detection and cropping
  return authorImageCloudinary.thumbnail.value(48, {
    c: 'thumb',
    g: 'face',
    r: 'max' // Make it circular
  });
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
