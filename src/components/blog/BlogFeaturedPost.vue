<template>
  <!--
    Featured blog post card with hover effects and schema.org markup
    Maintains all original classes and functionality while improving semantics
  -->
  <article
    id="featuredPost"
    class="my-10 sm:my-10 md:my-10 rounded-xl shadow-xl transition-all duration-500 hover:scale-[1.02] bg-broken-white dark:bg-postcard hover:shadow-2xl"
    itemscope
    itemtype="https://schema.org/BlogPosting"
    aria-labelledby="featuredPostTitle"
  >
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
    <!-- Article Content - Contains author info and post metadata -->
    <section class="flex flex-row items-center text-center p-2 md:p-6">
      <!-- Author avatar with link -->
      <section class="ml-1 md:ml-5">
        <AvatarAuthor
          :imageSrc="authorImageSrc"
          :imageAlt="authorImageAlt"
          :link="authorLink"
          class="drop-shadow-lg"
        />
      </section>
      <!-- Post title and metadata -->
      <section class="ml-3 mr-3 flex-1 text-left">
        <!-- Post title as heading -->
        <h2
          id="featuredPostTitle"
          class="font-navigation line-clamp-2 text-slate-700 dark:text-white leading-6 md:text-xl/5 md:leading-7"
          itemprop="headline"
        >
          <router-link
            :to="postLink"
            itemprop="url"
            class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {{ title }}
          </router-link>
        </h2>

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
      </section>
    </section>
  </article>
</template>

<script setup lang="ts">
/**
 * BlogFeaturedPost Component
 *
 * This component displays a featured blog post with its image, title, date,
 * category, and author avatar. It receives all necessary data as props.
 *
 * Props:
 * - imageSrc: URL for the featured image.
 * - imageAlt: Alt text for the featured image.
 * - title: The title of the blog post.
 * - postLink: The router link path to the full blog post.
 * - date: The publication date of the post (string).
 * - category: The category of the post.
 * - categoryLink: The router link path to the category archive page.
 * - tags: An array of tags associated with the post.
 * - authorImageSrc: URL for the author's avatar image.
 * - authorImageAlt: Alt text for the author's avatar image.
 * - authorLink: The router link path to the author's page (defaults to '/about').
 *
 * The component uses Vue 3 Composition API with `<script setup>` and computed
 * properties to format the date.
 */
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AvatarAuthor from '../common/AvatarAuthor.vue';

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
  authorName?: string; // Add authorName prop
}

const props = withDefaults(defineProps<Props>(), {
  authorLink: '/about',
});

// Function to dynamically import images
const getImageUrl = (path: string) => {
  // Use the path directly as it's already relative to the project root or an absolute URL
  // Vite will handle assets starting with /src/ or /public/ correctly
  return new URL(path, import.meta.url).href;
};

const processedImageSrc = computed(() => {
  // Pass the full path from the frontmatter directly to getImageUrl
  return props.imageSrc ? getImageUrl(props.imageSrc) : '';
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
