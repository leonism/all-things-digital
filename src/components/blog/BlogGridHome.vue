<template>
  <section id="homeBlogArticles" class="flex flex-col">
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <BlogPostCard
        v-for="post in limitedPosts"
        :key="post.slug"
        :imageSrc="
          post.featuredImage?.src || '/assets/img/thumbnail-01-comp.jpg'
        "
        :imageAlt="post.featuredImage?.alt || post.title"
        :title="post.title"
        :postLink="`/blog/${post.slug}`"
        :date="post.date"
        :excerpt="post.excerpt"
        :tags="post.tags"
        :authorImageSrc="post.author?.image || '/assets/img/avatar.png'"
        :authorImageAlt="post.author?.name || 'Author profile picture'"
        :authorName="post.author?.name || 'Unknown Author'"
      />
    </div>
    <div
      v-if="limitedPosts.length === 0"
      class="text-center text-gray-500 dark:text-gray-400 py-10"
    >
      <p>No blog posts found.</p>
    </div>
  </section>
</template>

<script setup>
/**
 * BlogGridHome Component
 *
 * This component displays a limited grid of blog posts for the home page
 * using the `BlogPostCard` component. It fetches all posts from
 * `blog-data.json`, filters them to only show published posts, and then
 * limits the number of displayed posts.
 *
 * The component uses Vue 3 Composition API with `<script setup>` and a
 * computed property to handle the filtering and limiting logic.
 */
import { computed } from 'vue';
import BlogPostCard from '../common/BlogPostCard.vue';
import postsData from '../../blog-data.json';

/**
 * Computed property that filters the imported `postsData` array
 * to include only posts where the `status` is 'published' or
 * where the `status` field is not present (assuming it's published by default).
 * It then limits the result to the first 3 posts.
 */
const limitedPosts = computed(() => {
  // Get only published posts and limit to, for example, 3 for the home page grid
  return postsData
    .filter((post) => post.status === 'published' || !post.status)
    .slice(0, 3);
});
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
