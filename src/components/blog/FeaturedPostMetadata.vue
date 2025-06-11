<template>
  <!-- Post metadata footer -->
  <footer
    class="flex items-center text-xs text-slate-500 dark:text-gray-500 mt-1"
  >
    <!-- Publication date -->
    <div class="flex items-center">
      <span v-if="authorName" class="flex items-center mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mr-1.5 h-3.5 w-3.5"
          aria-hidden="true"
          focusable="false"
          role="img"
        >
          <title>Author</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a8.967 8.967 0 0015 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span itemprop="author">{{ authorName }}</span>
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-3.5 h-3.5 mr-1"
        aria-hidden="true"
        focusable="false"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
      <time :datetime="date" itemprop="datePublished">
        {{ formattedDate }}
      </time>
    </div>

    <!-- Tags list (hidden on mobile) -->
    <div
      class="hidden md:inline-flex items-center ml-2"
      itemprop="keywords"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-3.5 h-3.5 mx-1"
        aria-hidden="true"
        focusable="false"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
        />
      </svg>
      <span>
        <template v-for="(tag, index) in tags" :key="tag">
          <router-link
            :to="`/blog/tag/${getTagSlug(tag)}`"
            class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            :title="`View posts tagged ${tag}`"
          >
            {{ tag }}
          </router-link>
          <span v-if="index < tags.length - 1">, </span>
        </template>
      </span>
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * FeaturedPostMetadata Component
 *
 * This component displays the metadata section of a featured blog post,
 * including author name, publication date, and tags.
 *
 * Props:
 * - authorName: The name of the author (optional)
 * - date: The publication date of the post (string)
 * - tags: An array of tags associated with the post
 */
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

/**
 * Generates a hyphenated slug from a tag name.
 * Replaces spaces with hyphens and converts to lowercase.
 * @param name The tag name.
 * @returns The hyphenated tag slug.
 */
const getTagSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

interface Props {
  authorName?: string;
  date: string;
  tags: string[];
}

const props = withDefaults(defineProps<Props>(), {
  authorName: '',
});

/**
 * Computed property to format the post date into a human-readable string.
 * Uses Intl.DateTimeFormatOptions for localization options.
 */
const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(props.date).toLocaleDateString('en-US', options);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>