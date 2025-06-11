<template>
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
      <FeaturedPostMetadata
        :authorName="authorName"
        :date="date"
        :tags="tags"
      />
    </section>
  </section>
</template>

<script setup lang="ts">
/**
 * FeaturedPostContent Component
 *
 * This component displays the content section of a featured blog post,
 * including the author avatar, post title, and metadata.
 *
 * Props:
 * - title: The title of the blog post
 * - postLink: The router link path to the full blog post
 * - authorImageSrc: URL for the author's avatar image
 * - authorImageAlt: Alt text for the author's avatar image
 * - authorLink: The router link path to the author's page
 * - authorName: The name of the author (optional)
 * - date: The publication date of the post (string)
 * - tags: An array of tags associated with the post
 */
import { RouterLink } from 'vue-router';
import AvatarAuthor from '../common/AvatarAuthor.vue';
import FeaturedPostMetadata from './FeaturedPostMetadata.vue';

interface Props {
  title: string;
  postLink: string;
  authorImageSrc: string;
  authorImageAlt?: string;
  authorLink: string;
  authorName?: string;
  date: string;
  tags: string[];
}

withDefaults(defineProps<Props>(), {
  authorImageAlt: '',
  authorName: '',
  authorLink: '/about',
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>