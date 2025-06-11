<template>
  <!-- Article Header - Contains featured image and category badge -->
  <header class="relative">
    <figure
      class="relative"
      itemprop="image"
      itemscope
      itemtype="https://schema.org/ImageObject"
    >
      <router-link :to="postLink" itemprop="url" aria-label="Read full post">
        <img
          :src="imageSrc"
          :alt="imageAlt"
          :width="1000"
          :height="600"
          class="object-cover w-full h-full aspect-video rounded-2xl rounded-b-none dark:mask-b-from-10% dark:mask-b-to-90%"
          itemprop="url"
          decoding="async"
        />
      </router-link>

      <!-- Category badge positioned absolutely over the image -->
      <figcaption class="absolute bottom-2 right-2 md:bottom-10 md:right-8">
        <router-link
          :to="`/blog/category/${getTagSlug(category)}`"
          :title="`View all posts in ${category} category`"
          class="inline-block"
        >
          <span
            class="text-white text-xs px-2.5 py-1 rounded-full bg-linear-to-br from-indigo-400/50 to-pink-600/50 dark:bg-gray-800"
            itemprop="about"
          >
            {{ category }}
          </span>
        </router-link>
      </figcaption>
    </figure>
  </header>
</template>

<script setup lang="ts">
/**
 * FeaturedPostHeader Component
 *
 * This component displays the header section of a featured blog post,
 * including the featured image and category badge overlay.
 *
 * Props:
 * - imageSrc: URL for the featured image
 * - imageAlt: Alt text for the featured image
 * - postLink: The router link path to the full blog post
 * - category: The category of the post
 */
import { RouterLink } from 'vue-router';

/**
 * Generates a hyphenated slug from a category name.
 * Replaces spaces with hyphens and converts to lowercase.
 * @param name The category name.
 * @returns The hyphenated category slug.
 */
const getTagSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

interface Props {
  imageSrc: string;
  imageAlt?: string;
  postLink: string;
  category: string;
}

withDefaults(defineProps<Props>(), {
  imageAlt: '',
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>