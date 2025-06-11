<template>
  <!--
    Featured blog post card with modular components for improved maintainability.
    Uses FeaturedPostHeader for image/category and FeaturedPostContent for title/metadata.
    Maintains all original styling, functionality, and schema.org markup.
  -->
  <article
    id="featuredPost"
    class="my-10 sm:my-10 md:my-10 rounded-xl shadow-xl transition-all duration-500 hover:scale-[1.02] bg-broken-white dark:bg-postcard hover:shadow-2xl"
    itemscope
    itemtype="https://schema.org/BlogPosting"
    aria-labelledby="featuredPostTitle"
  >
    <!-- Modular Header Component - Featured image and category badge -->
    <FeaturedPostHeader
      :imageSrc="processedImageSrc"
      :imageAlt="imageAlt"
      :postLink="postLink"
      :category="category"
    />
    
    <!-- Modular Content Component - Author avatar, title, and metadata -->
    <FeaturedPostContent
      :title="title"
      :postLink="postLink"
      :authorImageSrc="authorImageSrc"
      :authorImageAlt="authorImageAlt"
      :authorLink="authorLink"
      :authorName="authorName"
      :date="date"
      :tags="tags"
    />
  </article>
</template>

<script setup lang="ts">
/**
 * BlogFeaturedPost Component (Refactored)
 *
 * This is the main container component for a featured blog post that orchestrates
 * modular sub-components for improved maintainability and readability.
 *
 * Architecture:
 * - FeaturedPostHeader: Handles featured image and category badge
 * - FeaturedPostContent: Manages author avatar, title, and metadata
 *
 * Props:
 * - imageSrc: URL for the featured image
 * - imageAlt: Alt text for the featured image
 * - title: The title of the blog post
 * - postLink: The router link path to the full blog post
 * - date: The publication date of the post (string)
 * - category: The category of the post
 * - categoryLink: The router link path to the category archive page
 * - tags: An array of tags associated with the post
 * - authorImageSrc: URL for the author's avatar image
 * - authorImageAlt: Alt text for the author's avatar image
 * - authorLink: The router link path to the author's page (defaults to '/about')
 * - authorName: The name of the author (optional)
 *
 * The component uses Vue 3 Composition API with modular sub-components
 * for better separation of concerns and maintainability.
 */
import { computed } from 'vue';
import FeaturedPostHeader from './FeaturedPostHeader.vue';
import FeaturedPostContent from './FeaturedPostContent.vue';

interface Props {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  postLink: string;
  date: string;
  category: string;
  categoryLink: string;
  tags: string[];
  authorImageSrc: string;
  authorImageAlt?: string;
  authorLink: string;
  authorName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: '',
  authorImageAlt: '',
  authorName: '',
  authorLink: '/about',
});

/**
 * Function to dynamically process image URLs.
 * Handles both relative paths and absolute URLs for Vite compatibility.
 * @param path The image path from props
 * @returns Processed image URL
 */
const getImageUrl = (path: string) => {
  // Use the path directly as it's already relative to the project root or an absolute URL
  // Vite will handle assets starting with /src/ or /public/ correctly
  return new URL(path, import.meta.url).href;
};

/**
 * Computed property for processed image source.
 * Ensures proper image URL handling for the featured image.
 */
const processedImageSrc = computed(() => {
  return props.imageSrc ? getImageUrl(props.imageSrc) : '';
});
</script>

<style scoped>
/**
 * Scoped styles for the main BlogFeaturedPost container.
 * Individual component styles are handled in their respective files:
 * - FeaturedPostHeader.vue
 * - FeaturedPostContent.vue
 * - FeaturedPostMetadata.vue
 */
</style>
