<template>
  <section
    class="mr-3 p-0.5 flex shrink-0 basis-auto items-center self-start rounded-full bg-gradient-to-br from-indigo-400 to-pink-600 transition hover:from-indigo-500 hover:to-pink-700 transition-colors duration-300 transform hover:scale-110"
  >
    <router-link :to="link">
      <img
        :src="processedImageSrc"
        :alt="imageAlt"
        class="h-12 w-12 rounded-full max-w-full border-2 border-white dark:border-slate-800"
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

// Function to dynamically import images
const getImageUrl = (name: string): string => {
  // Construct the relative path from the component to the image
  const relativePath = `../../assets/img/${name}`;
  return new URL(relativePath, import.meta.url).href;
};

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

const processedImageSrc = computed(() => {
  if (props.imageSrc?.startsWith('/assets/img/')) {
    const filename = props.imageSrc.split('/').pop();
    if (filename) {
      return getImageUrl(filename);
    }
  }
  return props.imageSrc || '';
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
