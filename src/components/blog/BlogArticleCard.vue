<template>
  <!-- Blog Post Card Component - Enhanced with semantic HTML and ARIA -->
  <article
    class="flex flex-col min-h-60 my-5 sm:my-5 md:my-3 overflow-hidden rounded-2xl shadow-xl border border-transparent bg-broken-white dark:bg-postcard transform transition-all duration-500 md:flex-row md:my-6 hover:scale-[1.02] hover:shadow-2xl"
    aria-labelledby="article-title article-excerpt"
    itemtype="https://schema.org/BlogPosting"
  >
    <!-- Featured Image with proper figure semantics -->
    <figure
      class="mb-0 shrink-0 md:w-2/5"
      itemprop="image"
      itemscope
      itemtype="https://schema.org/ImageObject"
    >
      <img
        :src="processedImageSrc"
        :alt="imageAlt"
        class="w-full h-full object-cover aspect-video"
        width="1000"
        height="600"
        itemprop="url"
        loading="lazy"
        decoding="async"
      />
    </figure>

    <!-- Main content container with proper landmark roles -->
    <section
      class="flex grow flex-col p-4 md:p-5 md:ml-0"
      role="region"
      aria-labelledby="article-title"
    >
      <!-- Article Header with author and metadata -->
      <header class="mb-3 flex items-center">
        <AvatarAuthor
          :imageSrc="processedAuthorImageSrc"
          :imageAlt="authorImageAlt"
          :link="authorLink"
          itemprop="author"
          itemscope
          itemtype="https://schema.org/Person"
        />
        <section id="postMetaData" class="grow">
          <!-- Main article title as h2 for proper document outline -->
          <h2
            id="article-title"
            class="text-left font-navigation text-base text-slate-700 line-clamp-2 dark:text-white"
            itemprop="headline"
          >
            <router-link
              :to="postLink"
              itemprop="url"
              class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Read more about '{{ title }}'"
            >
              {{ title }}
            </router-link>
          </h2>
          <!-- Author, Publication Date (with machine-readable format), and Category -->
          <section
            class="flex items-center text-xs text-slate-500 dark:text-gray-400 mt-1"
          >
            <span v-if="authorName" class="flex items-center text-nowrap">
              <span
                itemprop="author"
                class="hidden sm:hidden md:flex md:mr-1 md:mr-2"
              >
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
                {{ authorName }}
              </span>
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
                <title>Published date</title>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <time :datetime="date" itemprop="datePublished">
                <span itemprop="date" class="mr-1 md:mr-2">
                  {{ formattedDate }}
                </span>
              </time>
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
                <title>Category</title>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 6h.008v.008H6V6z"
                />
              </svg>
              <span itemprop="category" class="mr-1 md:mr-2">
                <router-link
                  :to="`/blog/category/${category.toLowerCase()}`"
                  class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  itemprop="articleSection"
                >
                  {{ category }}
                </router-link>
              </span>
            </span>
          </section>
        </section>
      </header>

      <!-- Article Excerpt with accessible description -->
      <p
        id="article-excerpt"
        itemprop="description"
        class="text-left text-slate-90 font-navigation tracking-wide text-slate-700 line-clamp-4 dark:text-white"
      >
        {{ excerpt }}
      </p>

      <!-- Article Footer with semantic tagging -->
      <footer
        class="flex items-center text-xs text-slate-500 mt-2 dark:text-gray-400"
        aria-label="Article tags"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="mr-2 h-5 w-5"
          aria-hidden="true"
          focusable="false"
          role="img"
        >
          <title>Tags</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 6h.008v.008H6V6z"
          />
        </svg>
        <span itemprop="keywords">
          <template v-for="(tag, index) in tags" :key="tag">
            <router-link
              :to="`/blog/tag/${getTagSlug(tag)}`"
              class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              :aria-label="`Browse articles tagged ${tag}`"
              itemprop="about"
            >
              {{ tag }}
            </router-link>
            <span v-if="index < tags.length - 1" aria-hidden="true">, </span>
          </template>
        </span>
      </footer>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import AvatarAuthor from '../common/AvatarAuthor.vue';

interface Props {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  postLink: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  authorImageSrc?: string;
  authorImageAlt?: string;
  authorLink?: string;
  authorName?: string; // Add authorName prop
  category?: string; // Add category prop
}

/**
 * Generates a hyphenated slug from a tag name.
 * Replaces spaces with hyphens and converts to lowercase.
 * @param name The tag name.
 * @returns The hyphenated tag slug.
 */
const getTagSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

const props = withDefaults(defineProps<Props>(), {
  imageAlt: '',
  excerpt: '',
  tags: () => [],
  authorImageSrc: '/assets/img/avatar.png',
  authorImageAlt: 'Author profile picture',
  authorLink: '/about',
  authorName: 'Unknown Author', // Default for authorName
  category: '', // Default for category
});

// Function to dynamically import images
const getImageUrl = (path) => {
  // Use the path directly as it's already relative to the project root or an absolute URL
  // Vite will handle assets starting with /src/ or /public/ correctly
  return new URL(path, import.meta.url).href;
};

const processedImageSrc = computed(() => {
  // Pass the full path from the frontmatter directly to getImageUrl
  return props.imageSrc ? getImageUrl(props.imageSrc) : '';
});

const processedAuthorImageSrc = computed(() => {
  // Pass the full path from the frontmatter directly to getImageUrl
  return props.authorImageSrc ? getImageUrl(props.authorImageSrc) : '';
});

const formattedDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(props.date).toLocaleDateString('en-US', options);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
